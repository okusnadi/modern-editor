import React from "react"
import ReactWinJS from "react-winjs"
import keyboardJS from "keyboardjs"

import connectToStores from "alt/utils/connectToStores"

import AceWrapper from "./ace-wrapper.js"
import TabStore from "stores/tab.js"
import TabActions from "actions/tab.js"
import SettingActions from "actions/setting.js"

let printManager = Windows.Graphics.Printing.PrintManager.getForCurrentView()

class EditorPage extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object,
    getString: React.PropTypes.func,
    settings: React.PropTypes.object
  }

  static getStores() {
    return [TabStore]
  }

  static getPropsFromStores() {
    return {
      tabs: TabStore.getState()
    }
  }

  constructor(props) {
    super(props)

    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this)
    this.handleSaveAsButtonClick = this.handleSaveAsButtonClick.bind(this)
    this.handleIncreaseFontSizeButtonClick = this.handleIncreaseFontSizeButtonClick.bind(this)
    this.handleDecreaseFontSizeButtonClick = this.handleDecreaseFontSizeButtonClick.bind(this)
    this.handlePrintTaskRequested = this.handlePrintTaskRequested.bind(this)
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
    let tab = this.props.tabs.getIn(["list", this.props.tabs.get("currentTab")])
      .set("text", text)
      .set("notSave", true)
    TabActions.updateTab({ id: this.props.tabs.get("currentTab"), tab })
  }

  handleIncreaseFontSizeButtonClick() {
    SettingActions.setAceOptionsValue({ name: "fontSize", value: this.context.settings.aceOptions.fontSize + 1 })
  }

  handleDecreaseFontSizeButtonClick() {
    if (this.context.settings.fontSize < 2) return
    SettingActions.setAceOptionsValue({ name: "fontSize", value: this.context.settings.aceOptions.fontSize - 1 })
  }

  handleSaveAsButtonClick() {
    TabActions.saveAsFile({ id: this.props.tabs.get("currentTab") })
  }

  handlePrintTaskRequested(printEvent) {
    let tab = this.props.tabs.getIn(["list", this.props.tabs.get("currentTab")])
    let text = tab.get("text") || ""
    let modeName = (tab.get("syntaxMode") ? tab.get("syntaxMode").name : "text")

    let html
    if (modeName != "text") {
      let highlighter = ace.require("ace/ext/static_highlight")
      let dom = ace.require("ace/lib/dom")
      let Mode = ace.require(`ace/mode/${modeName}`).Mode
      let theme = ace.require(`ace/theme/${this.context.settings.syntaxTheme}`)

      let highlighted = highlighter.render(text, new Mode(), theme)
      dom.importCssString(highlighted.css, "ace_highlight")
      html = highlighted.html
    }
    else {
      html = text
    }

    let d = document.createElement("div")
    d.innerHTML = html
    let frag = document.createDocumentFragment()
    frag.appendChild(d)

    let printTask = printEvent.request.createPrintTask("Printing", args => {
      let deferral = args.getDeferral()

      MSApp.getHtmlPrintDocumentSourceAsync(frag).then(source => {
        args.setSource(source)
        deferral.complete();
      })
    })
  }

  handleSaveButtonClick() {
    TabActions.saveFile({ id: this.props.tabs.get("currentTab") })
  }

  handlePrintButtonClick() {
    Windows.Graphics.Printing.PrintManager.showPrintUIAsync()
  }

  handleShareAsTextButtonClick() {
    let dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView()
    dataTransferManager.ondatarequested = e => {
      let request = e.request
      request.data.properties.title = "\0"
      request.data.properties.description = "\0"
      let tab = this.props.tabs.getIn(["list", this.props.tabs.get("currentTab")])
      let text = tab.get("text") || ""
      request.data.setText(text)
      dataTransferManager.ondatarequested = null
    }
    Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI()
  }

  handleShareAsFileButtonClick() {
    let tab = this.props.tabs.getIn(["list", this.props.tabs.get("currentTab")])
    let fileToken = tab.get("fileToken")

    if (!fileToken || tab.get("notSave") == true) {
      let msg = new Windows.UI.Popups.MessageDialog(
        this.context.getString("save-file-first"),
        this.context.getString("oops")
      )
      return msg.showAsync()
    }

    return Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.getFileAsync(fileToken)
      .then(file => {
        let dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView()
        dataTransferManager.ondatarequested = e => {
          let request = e.request
          request.data.properties.title = "\0"
          request.data.properties.description = "\0"

          request.data.setStorageItems([file])
          dataTransferManager.ondatarequested = null
        }
        Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI()
      })
  }

  componentDidMount() {
    keyboardJS.on("ctrl + s", this.handleSaveButtonClick)
    keyboardJS.on("ctrl + shift + s", this.handleSaveAsButtonClick)
    keyboardJS.on("ctrl + =", this.handleIncreaseFontSizeButtonClick)
    keyboardJS.on("ctrl + -", this.handleDecreaseFontSizeButtonClick)

    printManager.addEventListener("printtaskrequested", this.handlePrintTaskRequested)
  }

  componentWillUnmount() {
    keyboardJS.off("ctrl + s", this.handleSaveButtonClick)
    keyboardJS.off("ctrl + shift + s", this.handleSaveAsButtonClick)
    keyboardJS.off("ctrl + =", this.handleIncreaseFontSizeButtonClick)
    keyboardJS.off("ctrl + -", this.handleDecreaseFontSizeButtonClick)

    printManager.removeEventListener("printtaskrequested", this.handlePrintTaskRequested)

    /*let cursorPos = this.refs.ace.editor.selection.getCursor()
    let tab = this.props.tab
      .set("cursorPos", cursorPos)
    TabActions.updateTab({ id: this.props.tabs.get("currentTab"), tab, silent: true })*/
  }

  render() {
    let tab = this.props.tabs.getIn(["list", this.props.tabs.get("currentTab")])

    let shareFlyout = (
      <ReactWinJS.Menu>
        <ReactWinJS.Menu.Button
          key="shareAsText"
          label={this.context.getString("share-as-text")}
          onClick={this.handleShareAsTextButtonClick.bind(this)} />
        <ReactWinJS.Menu.Button
          key="shareAsFile"
          label={this.context.getString("share-as-file")}
          onClick={this.handleShareAsFileButtonClick.bind(this)} />
      </ReactWinJS.Menu>
    )

    let appBar = (
      <ReactWinJS.ToolBar className="app-flex-auto">
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
         key="print"
         icon=""
         label={this.context.getString("print")}
         onClick={this.handlePrintButtonClick.bind(this)}  />

       <ReactWinJS.ToolBar.FlyoutCommand
         key="share"
         icon=""
         label={this.context.getString("share")}
         flyoutComponent={shareFlyout}  />

       <ReactWinJS.ToolBar.Button
         key="saveAs"
         section="secondary"
         label={this.context.getString("save-as")}
         onClick={this.handleSaveAsButtonClick.bind(this)}  />
     </ReactWinJS.ToolBar>
   )

   let bottomBar = (
     <div className="app-bottom-bar app-flex-auto">
        <div style={{ float: "left" }}>
          <span>{(tab.get("syntaxMode") ? tab.getIn(["syntaxMode", "caption"]) : "Text")}</span>
          <span> | </span>
          <span> {this.context.getString("length")}: {(tab.get("text") || "").length}</span>
        </div>
     </div>
   )

    return (
      <div className="app-editor-page">
        {appBar}
        <AceWrapper
          ref="ace"
          mode={(tab.get("syntaxMode") ? tab.getIn(["syntaxMode", "name"]) : "text")}
          theme={this.context.settings.syntaxTheme}
          options={{
            ...this.context.settings.aceOptions,
            newLineMode: "auto",
            useSoftTabs: true,
            overwrite: false,
            useSoftTabs: true,
            readOnly: false
          }}
          name="editor"
          value={tab.get("text") || ""}
          cursorStart={-1}
          editorProps={{$blockScrolling: Infinity}}
          onChange={this.handleTextChange.bind(this)} />
        {bottomBar}
      </div>
    )
  }
}

export default connectToStores(EditorPage)
