import React from "react"
import ReactDOM from "react-dom"

class AceWrapper extends React.Component {
  static propTypes = {
    mode: React.PropTypes.string,
    theme: React.PropTypes.string,
    height: React.PropTypes.string,
    width: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onCopy: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    cursorStart: React.PropTypes.number,
    editorProps: React.PropTypes.object
  }

  static defaultProps = {
    mode: "text",
    theme: "monokai",
    height: "500px",
    width: "500px",
    value: "",
    onChange: null,
    onCopy: null,
    onPaste: null,
    onFocus: null,
    onBlur: null,
    options: {},
    cursorStart: 1,
    editorProps: {}
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this)
    this.editor = ace.edit(el)
    this.editor.setTheme(`ace/theme/${this.props.theme}`)
    this.editor.session.setValue(this.props.value, this.props.cursorStart)
    this.editor.session.setMode(`ace/mode/${this.props.mode}`)

    Object.keys(this.props.editorProps).forEach(propKey => {
      this.editor[propKey] = this.props.editorProps[propKey]
    })

    this.editor.setOptions(this.props.options)

    this.editor.commands.removeCommand("showSettingsMenu")

    this.editor.on("focus", () => {
      if (this.props.onFocus) {
        this.props.onFocus()
      }
    })
    this.editor.on("blur", () => {
      if (this.props.onBlur) {
        this.props.onBlur()
      }
    })
    this.editor.on("copy", text => {
      if (this.props.onCopy) {
        this.props.onCopy(text)
      }
    })
    this.editor.on("paste", text => {
      if (this.props.onPaste) {
        this.props.onPaste(text)
      }
    })
    this.editor.on("change", () => {
      if (this.props.onChange && !this.silent) {
        let value = this.editor.getValue()
        this.props.onChange(value)
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.mode != nextProps.value) {
      this.editor.session.setMode(`ace/mode/${nextProps.mode}`)
    }
    if (this.props.options.fontSize != nextProps.options.fontSize) {
      this.editor.setFontSize(nextProps.options.fontSize)
    }
    if (this.editor.getValue() !== nextProps.value) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      this.silent = true
      this.editor.setValue(nextProps.value, nextProps.cursorStart)
      this.silent = false
    }
    return false
  }

  render() {
    return <div style={this.props.style} />
  }
}

export default AceWrapper
