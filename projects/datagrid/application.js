'use strict';

var React    = require('react')
var DataGrid = require('react-datagrid')
import { render } from 'react-dom'

require('react-datagrid/index.css')

var columns = [
    { name: 'feed_name' },
    { name: 'feed_type', width: 200 },
    { name: 'geo_locals', width: 200 },
    { name: 'topics', width: 100}
]

function ds(query){
    var timestamp = +new Date
    return fetch('./api/tabledata.js')
}

var PAGE = 1
var PAGE_SIZE = 110

const App =  React.createClass({

    reload: function(){
        this.refs.grid.reload()
    },
    onPageChange: function(page) {
        PAGE = page
        this.setState({})
    },
    onPageSizeChange: function(pageSize, props) {
        if (pageSize > PAGE_SIZE){
            //when page size gets bigger, the page may not exist
            //so make sure you update that as well
            PAGE = Math.min(PAGE, Math.ceil(props.dataSourceCount / pageSize))
        }
        PAGE_SIZE = pageSize
        this.setState({})
    },
    render: function(){
        return <div>
            <p>
                <button onClick={this.reload}>Reload</button>
            </p>
            <DataGrid
                ref="grid"
                dataSource={ds}
                page={PAGE}
                pageSize={PAGE_SIZE}
                onPageChange={this.onPageChange}
                onPageSizeChange={this.onPageSizeChange}
                idProperty='id'
                columns={columns}
                style={{height: 500}}
                />
        </div>
    }
})

render(<App source="./api/tabledata.js" />, document.getElementById('app'))