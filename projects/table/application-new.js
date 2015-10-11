var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var LOADING_ROW_REQUEST = {title: "Loading... (requesting)"};

var NUMBER_OF_ROWS_MAX = 1000;
var NUMBER_OF_ROWS_PER_REQUEST = 5;


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

class RowDataLoader {
    constructor(onDataLoad) {
        this._onDataLoad = onDataLoad;
        this._queue = [];
        this._data = {};
    }

    getRowData(rowIndex) {
        if (!this._data[rowIndex]) {
            this._queueRequestFor(rowIndex);
            this._data[rowIndex] = LOADING_ROW_REQUEST;
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

var MovieTable = React.createClass({
    componentWillMount() {
        this._dataLoader = new RowDataLoader(() => {
            this.forceUpdate();
        });
    },

    _rowGetter(rowIndex) {
        return this._dataLoader.getRowData(rowIndex);
    },

    _clearDataForRow(rowIndex) {
        this._dataLoader.clearRowData(rowIndex);
    },

    _renderButton(_1, _2, _3, rowIndex) {
        return (<button style={{width: '100%'}} onClick={this._clearDataForRow.bind(null, rowIndex)}>clear data</button>);
    },

    render: function() {
        return (
            <Table
                rowHeight={30}
                rowGetter={this._rowGetter}
                rowsCount={NUMBER_OF_ROWS_MAX}
                width={450}
                maxHeight={450}
                headerHeight={40}
                onRowClick={this._onRowClick}>
                <Column
                    label="Movie Title"
                    width={270}
                    dataKey="title"
                    />
                <Column
                    label="Rank"
                    width={100}
                    cellRenderer={this._renderButton}
                    dataKey="rank"
                    />
                <Column
                    label="Year"
                    width={80}
                    dataKey="year"
                    />
            </Table>
        );
    }
});


React.render(<MovieTable />, document.body);