
function makeFancyFakeRequest(rowStart, rowEnd, onLoad) {
    var FAKE_REQUEST_TIMEOUT = 3000;
    var FakeRows = [
        {selected: false, title: "Citizen Kane", rank: "1", year: "1941"},
        {selected: false, title: "The Shawshank Redemption", rank: "2", year: "1995"},
        {selected: false, title: "The Godfather", rank: "3", year: "1971"}
    ];

    console.log('Making request', rowStart, rowEnd);

    setTimeout(() => {
        var data = {};
        for (var i = rowStart; i <= rowEnd; i++) {
            data[i] = FakeRows[i % FakeRows.length];
        }
        onLoad(data);
    }, FAKE_REQUEST_TIMEOUT);
}

class FancyData {
    constructor(onDataLoad) {
        this._onDataLoad = onDataLoad;
        this._queue = [];
        this._data = {};
        this.LOADING_ROW_REQUEST = {title: "Loading... (requesting)"};
        this.NUMBER_OF_ROWS_MAX = 5000;
        this.NUMBER_OF_ROWS_PER_REQUEST = 5;
    }

    getRowData(rowIndex) {
        if (!this._data[rowIndex]) {
            this._queueRequestFor(rowIndex);
            this._data[rowIndex] = this.LOADING_ROW_REQUEST;
        }

        return this._data[rowIndex];
    }

    clearRowData(rowIndex) {
        delete this._data[rowIndex];
        this._onDataLoad();
    }

    _queueRequestFor(rowIndex) {
        this._queue.push(rowIndex);

        if (!this._queueFlushID) {
            this._queueFlushID = setTimeout(this._flushRequestQueue.bind(this), 0);
        }
    }

    _flushRequestQueue() {
        var sectionsToLoad = this._queue.reduce((requestSections, rowIndex) => {
            var rowBase = rowIndex - (rowIndex % this.NUMBER_OF_ROWS_PER_REQUEST);
            if (requestSections.indexOf(rowBase) === -1) {
                return requestSections.concat(rowBase);
            }

            return requestSections;
        }, []);

        sectionsToLoad.forEach(rowBase => {
            this._loadDataRange(
                rowBase,
                Math.min(rowBase + this.NUMBER_OF_ROWS_PER_REQUEST, this.NUMBER_OF_ROWS_MAX)
            );
        });

        this._queue = [];
        this._queueFlushID = null;
    }

    _loadDataRange(rowStart, rowEnd) {
        makeFancyFakeRequest(rowStart, rowEnd, (data) => {
            Object.assign(this._data, data);
            this._onDataLoad();
        });
    }
}
