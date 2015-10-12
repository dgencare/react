function makeFancyFakeRequest(rowStart, rowEnd, onLoad) {
    getJSON(API_URL, (error, payload) => {
        var data = {};
        var count = 0;
        for (var k in payload.data) {
            data[count] = payload.data[count];
            count++;
        }
        onLoad({results: data, totalResults: data.count, pageSize:1});
    })
}

class RowDataLoader {
    constructor(onDataLoad) {
        this._onDataLoad = onDataLoad;
        this._queue = [];
        this._data = {};
        this.LOADING_ROW_REQUEST = {feed_name: "Loading... (requesting)"};
    }

    getRowData(rowIndex) {
        if (!this._data[rowIndex]) {
            this._queueRequestFor(rowIndex);
            this._data[rowIndex] = this.LOADING_ROW_REQUEST;
        }

        return this._data[rowIndex];
    }

    _queueRequestFor(rowIndex) {
        this._queue.push(rowIndex);

        if (!this._queueFlushID) {
            this._queueFlushID = setTimeout(this._flushRequestQueue.bind(this), 0);
        }
    }

    _flushRequestQueue() {
        var sectionsToLoad = this._queue.reduce((requestSections, rowIndex) => {
            var rowBase = rowIndex - (rowIndex % NUMBER_OF_ROWS_PER_REQUEST);
            if (requestSections.indexOf(rowBase) === -1) {
                return requestSections.concat(rowBase);
            }

            return requestSections;
        }, []);

        sectionsToLoad.forEach(rowBase => {
            this._loadDataRange(
                rowBase,
                Math.min(rowBase + NUMBER_OF_ROWS_PER_REQUEST, NUMBER_OF_ROWS_MAX)
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