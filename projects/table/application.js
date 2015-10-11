import React from 'react'
import { render } from 'react-dom'
import { Table, Column } from 'fixed-data-table'
import getJSON from './lib/getJSON'

require('./css/fixed-data-table')

var NUMBER_OF_ROWS_MAX = 3;
var NUMBER_OF_ROWS_PER_REQUEST = 3;
var API_URL = 'api/tabledata.js';
var divTwitterStyle = {
    height: '25px',
    width: '25px',

};
var divRSSStyle = {
    height: '25px',
    width: '25px',

};
var buttonVisStyle = {
    background: "url('./images/Visualize.png') no-repeat top left",
    padding: "2px 8px",
    width: "35px",
    height: "35px"
};

function makeFancyFakeRequest(rowStart, rowEnd, onLoad) {
    getJSON(API_URL, (error, payload) => {
        var data = {};
        var count = 0;
        for (var k in payload.data) {
            data[count] = payload.data[count];
            count++;
        }
        onLoad(data);
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

const App = React.createClass({
    componentWillMount() {
        this._dataLoader = new RowDataLoader(() => {
            this.forceUpdate();
        });
    },

    getInitialState: function() {
        return {
            visulizeButtonClicked: null
        };
    },

    _rowGetter(rowIndex) {
        return this._dataLoader.getRowData(rowIndex);
    },

    _handleVisulizeClick(rowData, rowIndex) {
        console.log("Visulize id: " + rowIndex);
    },

    _renderVisulize(cellData, cellDataKey, rowData, rowIndex) {
        if(typeof rowData.id != 'undefined') {
            return <button style={buttonVisStyle} onClick={this._handleVisulizeClick.bind(null, rowData, rowIndex)}></button>;
            //return (<button style={{width: 'auto'}} onClick={this._handleVisulizeClick}>Visualize</button>);
        }
    },

    _renederFeedType(feed_type, fieldName, rowObj, rowIndex) {
        if(typeof feed_type != 'undefined') {
            switch(feed_type) {
                case "twitter":
                    return (<img style={divTwitterStyle} src="./images/twitter_32_32.png"/>);
                    break;
                case "rss":
                    return (<img style={divRSSStyle} src="./images/rss_16_16.png"/>);
                    break;
            }

        }
    },

    render: function() {
        return (
            <Table
                rowHeight={40}
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
                    cellRenderer={this._renederFeedType}
                    align="center"
                    />
                <Column
                    label="Geo Locations"
                    width={150}
                    dataKey="geo_locals"
                    align="center"
                    />
                <Column
                    label="Topics"
                    width={100}
                    dataKey="topics"
                    align="center"
                    />
                <Column
                    label="Visulize"
                    width={80}
                    cellRenderer={this._renderVisulize}
                    dataKey=""
                    align="center"
                    />
            </Table>
        );
    }
});


render(<App source="./api/tabledata.js" />, document.getElementById('app'))