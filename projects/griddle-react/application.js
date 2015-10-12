import React from 'react'
import { render } from 'react-dom'
var Griddle = require('griddle-react')
import getJSON from './lib/getJSON'

require('./css/griddle.css')
var API_URL = 'api/tabledata.js';
var colMetadata =  [{
        "columnName": "feed_name",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "Feed Name"
    },
    {
        "columnName": "feed_type",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Feed Type",
        "customComponent": feedtypeComponent
        },
    {
        "columnName": "geo_locations",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Geo Locations"
        },
    {
        "columnName": "topics",
        "order": 6,
        "locked": false,
        "visible": true,
        "displayName": "Topics"
        }];

var feedtypeComponent = React.createClass({
    render: function() {
        var feed_type = this.props.data['feed_type']
        if (typeof feed_type != 'undefined') {
            switch (feed_type) {
                case "twitter":
                    return (<img style={divTwitterStyle} src="./images/twitter_32_32.png"/>);
                    break;
                case "rss":
                    return (<img style={divRSSStyle} src="./images/rss_16_16.png"/>);
                    break;
            }
        }
    }
});

const App = React.createClass({
    getInitialState: function () {
        return {data: [{}]}
    },

    componentDidMount: function () {
        getJSON(API_URL, (error, payload) => {
            var data = [];
            var count = 0;
            for (var k in payload.data) {
                data[count] = payload.data[count];
                count++;
            }
            this.setState({data: data});
        }.bind(this)
        );
    },

    _rowClick(row) {
        console.log(row.props.data);
    },

    render() {
        return <div>
            <Griddle
                columnMetadata={colMetadata}
                tableClassName={{textAlign: "center"}}
                results={this.state.data}
                tableClassName="Feeds"
                showSettings={true}
                columns={["feed_name", "feed_type", "geo_locations", "topics"]}
                onRowClick={this._rowClick}
                />
        </div>
    }

})

render(<App />, document.getElementById('app'))
