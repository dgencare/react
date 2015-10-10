import React from 'react'
import { render } from 'react-dom'
import { Table, Column } from 'fixed-data-table'
import { API } from './api/DataAPI.js'
import { EntityStore } from './api/EntityStore.js'

require('./css/fixed-data-table')


const App = React.createClass({
    getInitialState: function() {
        return {rows: []};
    },

    setRowData: function(data) {
        this.state.rows = data;
    },

    defaultProps: {
        source: "",
        rows: []
    },

    setData: function(data) {
        this.state.rows = data;
    },

    rowGetter: function(idx) {
        return this.state.rows[idx];
    },

    render: function() {
        return <Table
            rowHeight={50}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            width={1000}
            height={500}
            headerHeight={25}>
            <Column
                label="Col 1"
                width={200}
                dataKey={0}
                />
            <Column
                label="Col 2"
                width={200}
                dataKey={1}
                />
        </Table>
    }
})

render(<App source="./api/tabledata.js" />, document.getElementById('app'))
