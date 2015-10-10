import React from 'react'
import { render } from 'react-dom'
import TransitionGroup from 'react-addons-transition-group'
import HeightFader from './components/HeightFader'

class App extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      items: []
    }
  }

  addItem(e) {
    if (e.key === 'Enter') {
      if (this.guid == null)
        this.guid = 1

      const newItem = {
        id: this.guid++,
        label: e.target.value
      }

      this.setState({
        items: [ newItem ].concat(this.state.items)
      })

      e.target.value = ''
    }
  }

  removeItem(item) {
    this.setState({
      items: this.state.items.filter(i => i !== item)
    })
  }

  render() {
    return (
      <div>
        <h1>TransitionGroup</h1>
        <input onKeyPress={(e) => this.addItem(e)} />
        <ul>
          {this.state.items.map(item =>
            <li key={item.id}>
              {item.label} <button onClick={() => this.removeItem(item)}>remove</button>
            </li>
          )}
        </ul>
      </div>
    )
  }

}

render(<App />, document.getElementById('app'))
