////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Use a <Spring> to animate the transition
// - See https://github.com/chenglou/react-motion for docs
//
// Got extra time?
//
// - Experiment with different stiffness/damping values (see https://github.com/chenglou/react-motion#spring-)
// - Insert a few more switches (try using id #switch2 and #switch3) that use the same Spring to animate their values
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { render } from 'react-dom'
import { Spring } from 'react-motion'

require('./styles')

class ToggleSwitch extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isActive: false
    }
  }

  toggle() {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  handleClick() {
    this.toggle()
  }
  
  render() {
    let { isActive } = this.state
    let knobLeft = isActive ? 400 : 0

    return (
      <div id="switch1" className="toggle-switch" onClick={e => this.handleClick(e)}>
        <div className="toggle-switch-knob" style={{
          WebkitTransform: `translate3d(${knobLeft}px,0,0)`,
          transform: `translate3d(${knobLeft}px,0,0)`
        }} />
      </div>
    )
  }

}

render(
  <ToggleSwitch />,
  document.getElementById('app')
)
