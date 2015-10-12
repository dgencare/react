import React from 'react'
import { render } from 'react-dom'
import DataGrid from 'react-datagrid'

//css style
require('react-datagrid/index.css')
require('./css/styles.css')

var columns = [
    { name: 'feed_name', title: 'Feed Name' },
    { name: 'feed_type', title: 'Feed Type', textAlign: 'center', width: 110, render: function(feed_type){ return cellRenderFeedType(feed_type);} },
    { name: 'geo_locations', title: 'Geo Locations', textAlign: 'center', width: 150 },
    { name: 'topics', title: 'Topics', textAlign: 'center', width: 100}
]

//style for feed_types
var divTwitterStyle = {
    height: '25px',
    width: '25px',

};
var divRSSStyle = {
    height: '25px',
    width: '25px',

};

function cellRenderFeedType(feed_type) {
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
}

const App =  React.createClass({
    reload: function(){
        this.refs.grid.reload()
    },

    handleRowClick: function(rowProps, event){
        console.log(rowProps);
    },

    render: function(){
        return <div>
            <DataGrid
                dataSource='./api/tabledata.js'
                idProperty='id'
                columns={columns}
                style={{height: 200, borderStyle: "solid", borderWidth: 1}}
                emptyText={'No feeds'}
                onRowClick={this.handleRowClick}
                />
        </div>
    }
})

render(<App source="./api/tabledata.js" />, document.getElementById('app'))