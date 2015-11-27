import React from "react"

class PassContext extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  }

  static childContextTypes = {
    settings: React.PropTypes.object,
    getString: React.PropTypes.func,
    mode: React.PropTypes.string
  }

  getChildContext() {
    return this.props.context
  }

  render() {
    return this.props.children
  }
}

export default PassContext
