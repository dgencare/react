import React from 'react'
import { render } from 'react-dom'
var Griddle = require('griddle-react')
import getJSON from './lib/getJSON'

require('./css/griddle.css')
var API_URL = 'api/tabledata.js';
var divTwitterStyle = {
    height: '25px',
    width: '25px',

};
var divRSSStyle = {
    height: '25px',
    width: '25px',

};

var feedtypeComponent = React.createClass({
    render: function() {
        var feed_type = this.props.rowData['feed_type']
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
        return (<div></div>);
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
        var colMetadata =  [{
            'columnName': 'feed_name',
            'order': 1,
            'locked': true,
            'visible': true,
            'displayName': 'Feed Name'
        },
            {
                'columnName': 'feed_type',
                'order': 2,
                'locked': true,
                'visible': true,
                'displayName': 'Feed Type',
                'customComponent': feedtypeComponent,
                'cssClassName': 'cellCenter'
            },
            {
                'columnName': 'geo_locations',
                'order': 3,
                'locked': true,
                'visible': true,
                'displayName': 'Geo Locations',
                'cssClassName': 'cellCenter'
            },
            {
                'columnName': 'topics',
                'order': 6,
                'locked': true,
                'visible': true,
                'displayName': 'Topics',
                'cssClassName': 'cellCenter'
            }
        ];

        return <div>
            <Griddle
                columnMetadata={colMetadata}
                tableClassName={{textAlign: "center"}}
                results={this.state.data}
                tableClassName="Feeds"
                showSettings={false}
                columns={["feed_name", "feed_type", "geo_locations", "topics"]}
                onRowClick={this._rowClick}
                />
        </div>
    }

})

render(<App />, document.getElementById('app'))
