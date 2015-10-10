////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Write a <ListView> that only shows the elements in the view.
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { render } from 'react-dom'
import RainbowList from './lib/RainbowList'

const { array, func, number } = React.PropTypes

require('./styles')

class ListView extends React.Component {

  static propTypes = {
    items: array.isRequired,
    itemHeight: number.isRequired,
    availableHeight: number.isRequired,
    renderItem: func.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      scrollTop: 0
    }
  }

  handleScroll(e) {
    this.setState({
      scrollTop: e.target.scrollTop
    })
  }

  render() {
    let { items, itemHeight, availableHeight, renderItem, style } = this.props
    let totalHeight = items.length * itemHeight

    let { scrollTop } = this.state
    let scrollBottom = scrollTop + availableHeight

    let startIndex = Math.floor(scrollTop / itemHeight)
    let endIndex = Math.ceil(scrollBottom / itemHeight)

    return (
      <div style={{ ...style, height: '100%', overflowY: 'scroll' }} onScroll={(e) => this.handleScroll(e)}>
        <div style={{ height: totalHeight }}>
          <ol style={{ paddingTop: (startIndex * itemHeight) }}>
          {items.slice(startIndex, endIndex).map((item, index) =>
            <li key={item.text} style={{ pointerEvents: 'none' }}>
            {renderItem(item)}
            </li>
          )}
          </ol>
        </div>
      </div>
    )
  }
 
}

render(
  <RainbowList ListView={ListView} length={500000} />,
  document.getElementById('app')
)
