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
    let knob1Left = isActive ? 400 : 0
    let knob2Left = isActive ? 600 : 0
    let knob3Left = isActive ? 300 : 0

    return (
      <Spring endValue={{
        knob1: { val: knob1Left, config: [ 150, 20 ] },
        knob2: { val: knob2Left, config: [ 100, 9 ] },
        knob3: { val: knob3Left }
      }}>
        {({ knob1, knob2, knob3 }) =>
          <div>
            <div id="switch1" className="toggle-switch" onClick={e => this.handleClick(e)}>
              <div className="toggle-switch-knob" style={{
                WebkitTransform: `translate3d(${knob1.val}px,0,0)`,
                transform: `translate3d(${knob1.val}px,0,0)`
              }} />
            </div>
            <div id="switch2" className="toggle-switch" onClick={e => this.handleClick(e)}>
              <div className="toggle-switch-knob" style={{
                WebkitTransform: `translate3d(${knob2.val}px,0,0)`,
                transform: `translate3d(${knob2.val}px,0,0)`
              }} />
            </div>
            <div id="switch3" className="toggle-switch" onClick={e => this.handleClick(e)}>
              <div className="toggle-switch-knob" style={{
                WebkitTransform: `translate3d(${knob3.val}px,0,0)`,
                transform: `translate3d(${knob3.val}px,0,0)`
              }} />
            </div>
          </div>
        }
      </Spring>
    )
  }

}

render(
  <ToggleSwitch />,
  document.getElementById('app')
)
