import React from 'react'
import { render } from 'react-dom'
import { Table, Column } from 'fixed-data-table'
import getJSON from './lib/getJSON'

require('./css/fixed-data-table')

var NUMBER_OF_ROWS_MAX = 2;
var NUMBER_OF_ROWS_PER_REQUEST = 2;
var API_URL = 'api/tabledata.js';

function makeFancyFakeRequest(rowStart, rowEnd, onLoad) {


    getJSON(API_URL, (error, payload) => {
        var data = {};
        var count = 0;
        for (var k in payload.data) {
            data[count] = payload.data[count];
            count++;
        }
        onLoad(data);
        //onLoad(payload);
    })


     /*
     var FAKE_REQUEST_TIMEOUT = 10;
     var FakeRows = [
     {feed_name: "CNN world news", feed_type: "rss", geo_locals: 10, topics: 4}
     ];

     console.log('Making request', rowStart, rowEnd);

    setTimeout(() => {
        var data = {};
        for (var i = rowStart; i <= rowEnd; i++) {
            data[i] = FakeRows[i % FakeRows.length];
        }
        onLoad(data);
    }, FAKE_REQUEST_TIMEOUT);
*/
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

const App = React.createClass({
    componentWillMount() {
        this._dataLoader = new RowDataLoader(() => {
            this.forceUpdate();
        });
    },

    _rowGetter(rowIndex) {
        return this._dataLoader.getRowData(rowIndex);
    },

    _renderVisulize(_1, _2, _3, rowIndex) {
        return (<button style={{width: 'auto'}} onClick={console.log('visulize button clicked')}>Visulize</button>);
    },

    render: function() {
        return (
            <Table
                rowHeight={30}
                rowGetter={this._rowGetter}
                rowsCount={NUMBER_OF_ROWS_MAX}
                width={700}
                maxHeight={450}
                headerHeight={40}
                onRowClick={this._onRowClick}>
                <Column
                    label="Feed Name"
                    width={270}
                    dataKey="feed_name"
                    />
                <Column
                    label="Feed Type"
                    width={100}
                    dataKey="feed_type"
                    />
                <Column
                    label="Geo Locations"
                    width={150}
                    dataKey="geo_locals"
                    />
                <Column
                    label="Topics"
                    width={100}
                    dataKey="topics"
                    />
                <Column
                    label="Visulize"
                    width={80}
                    cellRenderer={this._renderVisulize}
                    dataKey=""
                    />
            </Table>
        );
    }
});


render(<App source="./api/tabledata.js" />, document.getElementById('app'))