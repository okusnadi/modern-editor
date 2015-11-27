import React from "react"
import ReactWinJS from "react-winjs"
import keyboardJS from "keyboardjs"

import AceWrapper from "views/ace-wrapper"
import TabActions from "actions/tab.js"
import SettingActions from "actions/setting.js"

class FilePage extends React.Component {
  static contextTypes = {
    getString: React.PropTypes.func,
    settings: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this)
    this.handleSaveAsButtonClick = this.handleSaveAsButtonClick.bind(this)
    this.handleIncreaseFontSizeButtonClick = this.handleIncreaseFontSizeButtonClick.bind(this)
    this.handleDecreaseFontSizeButtonClick = this.handleDecreaseFontSizeButtonClick.bind(this)
  }

  handleUndoButtonClick() {
    this.refs.ace.editor.undo()
  }

  handleRedoButtonClick() {
    this.refs.ace.editor.redo()
  }

  handleFindButtonClick() {
    this.refs.ace.editor.execCommand("find")
  }

  handleTextChange(text) {
    let tab = this.props.tab
      .set("text", text)
      .set("notSave", true)
    TabActions.updateTab({ id: this.props.id, tab })
  }

  handleIncreaseFontSizeButtonClick() {
    SettingActions.setValue({ name: "fontSize", value: this.context.settings.fontSize + 1 })
  }

  handleDecreaseFontSizeButtonClick() {
    if (this.context.settings.fontSize < 2) return
    SettingActions.setValue({ name: "fontSize", value: this.context.settings.fontSize - 1 })
  }

  handleSaveAsButtonClick() {
    TabActions.saveAsFile({ id: this.props.id })
  }

  handleSaveButtonClick() {
    TabActions.saveFile({ id: this.props.id })
  }

  componentDidMount() {
    keyboardJS.on("ctrl + s", this.handleSaveButtonClick)
    keyboardJS.on("ctrl + shift + s", this.handleSaveAsButtonClick)
    keyboardJS.on("ctrl + =", this.handleIncreaseFontSizeButtonClick)
    keyboardJS.on("ctrl + -", this.handleDecreaseFontSizeButtonClick)
  }

  componentWillUnmount() {
    keyboardJS.off("ctrl + s", this.handleSaveButtonClick)
    keyboardJS.off("ctrl + shift + s", this.handleSaveAsButtonClick)
    keyboardJS.off("ctrl + =", this.handleIncreaseFontSizeButtonClick)
    keyboardJS.off("ctrl + -", this.handleDecreaseFontSizeButtonClick)
    /*let cursorPos = this.refs.ace.editor.selection.getCursor()
    let tab = this.props.tab
      .set("cursorPos", cursorPos)
    TabActions.updateTab({ id: this.props.id, tab, silent: true })*/
  }

  render() {
    let appBar = (
      <ReactWinJS.ToolBar>
        <ReactWinJS.ToolBar.Button
          key="save"
          icon=""
          label={this.context.getString("save")}
          onClick={this.handleSaveButtonClick}/>

       <ReactWinJS.ToolBar.Button
         key="undo"
         icon=""
         label={this.context.getString("undo")}
         onClick={this.handleUndoButtonClick.bind(this)} />

        <ReactWinJS.ToolBar.Button
          key="redo"
          icon=""
          label={this.context.getString("redo")}
          onClick={this.handleRedoButtonClick.bind(this)} />

       <ReactWinJS.ToolBar.Button
         key="decreaseFontSize"
         icon=""
         label={this.context.getString("decrease-font-size")}
         disabled={this.context.settings.fontSize < 2}
         onClick={this.handleDecreaseFontSizeButtonClick} />

        <ReactWinJS.ToolBar.Button
          key="increaseFontSize"
          icon=""
          label={this.context.getString("increase-font-size")}
          onClick={this.handleIncreaseFontSizeButtonClick} />

         <ReactWinJS.ToolBar.Button
           key="find"
           icon=""
           label={this.context.getString("find")}
           onClick={this.handleFindButtonClick.bind(this)}  />

         <ReactWinJS.ToolBar.Button
           key="saveAs"
           section="secondary"
           label={this.context.getString("save-as")}
           onClick={this.handleSaveAsButtonClick.bind(this)}  />
     </ReactWinJS.ToolBar>
   )

    return (
      <div className="app-file-page">
        {appBar}
        <AceWrapper
          ref="ace"
          mode={this.props.tab.get("syntaxMode")}
          theme={this.context.settings.syntaxTheme}
          height="calc(100vh - 48px)"
          fontSize={this.context.settings.fontSize}
          width="100%"
          options={{
            ...this.context.settings.aceOptions,
            newLineMode: "auto",
            useSoftTabs: true,
            overwrite: false,
            useSoftTabs: true,
            readOnly: false
          }}
          name="editor"
          initialValue={this.props.tab.get("text") || ""}
          cursorStart={-1}
          editorProps={{$blockScrolling: Infinity}}
          onChange={this.handleTextChange.bind(this)} />
      </div>
    )
  }
}

export default FilePage
