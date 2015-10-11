import React from 'react'

export class AsyncProps extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      asyncProps: null,
      prevProps: null
    }
  }

  componentDidMount() {
    this.load(this.props, (err, props) => {
      this.setState({ asyncProps: props })
    })
  }

  componentWillReceiveProps(nextProps) {
    let location = this.props.routerProps.location
    let nextLocation = nextProps.routerProps.location
    if (location !== nextLocation) {
      this.setState({
        prevProps: this.props
      })
      this.load(nextProps, (err, asyncProps) => {
        this.setState({
          asyncProps,
          prevProps: null
        })
      })
    }
  }

  load(props, cb) {
    let params = props.routerProps.params
    props.Component.loadProps(params, cb)
  }

  render() {
    let { asyncProps, prevProps } = this.state
    let props = prevProps || this.props
    let { Component, routerProps } = props
    let loading = !!prevProps

    if (!asyncProps)
      return null
    else
      return <Component {...routerProps} {...asyncProps} loading={loading}/>
  }

}

export function asyncProps (Component, props) {
  return Component.loadProps ?
    <AsyncProps Component={Component} routerProps={props}/> :
    <Component {...props}/>
}


