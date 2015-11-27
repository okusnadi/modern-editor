import React from "react"
import ReactWinJS from "react-winjs"
import keyboardJS from "keyboardjs"
import connectToStores from "alt/utils/connectToStores"

import SettingStore from "stores/setting.js"
import SettingActions from "actions/setting.js"
import TabStore from "stores/tab.js"
import TabActions from "actions/tab.js"

import FilePage from "views/file-page.js"
import SettingsPage from "views/settings-page.js"
import AboutPage from "views/about-page.js"

import PassContext from "./pass-context.js"

class Layout extends React.Component {
  static childContextTypes = {
    settings: React.PropTypes.object,
    getString: React.PropTypes.func,
    mode: React.PropTypes.string
  }

  static getStores() {
    return [SettingStore, TabStore]
  }

  static getPropsFromStores() {
    return {
      settings: SettingStore.getState(),
      tabs: TabStore.getState()
    }
  }

  constructor(props) {
    super(props)

    let mode = this.getMode()

    this.state = {
      mode,
      paneOpened: (mode != "small")
    }

    this.handleResize = this.handleResize.bind(this)
  }

  getChildContext() {
    return {
      settings: this.props.settings,
      getString: this.getString,
      mode: this.state.mode
    }
  }

  setAppTheme(theme) {
    // Theme
    [`/winjs/css/ui-${theme}.min.css`, `app-${theme}.min.css`].forEach(url => {
      let ss = document.styleSheets
      for (let i = 0, max = ss.length; i < max; i++) {
        if (ss[i].href == url)
          return
      }
      let link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = url
      document.getElementsByTagName("head")[0].appendChild(link)
    })
  }

  setAppColor(primaryColor) {
    let regCode = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(primaryColor.dark)
    let backgroundColor = {
      r: parseInt(regCode[1], 16),
      g: parseInt(regCode[2], 16),
      b: parseInt(regCode[3], 16),
      a: 1
    }
    let foregroundColor = { r: 255, g: 255, b: 255, a: 1 }

    // PC
  	if (Windows.UI.ViewManagement.ApplicationView) {
      let v = Windows.UI.ViewManagement.ApplicationView.getForCurrentView()
      v.titleBar.backgroundColor = backgroundColor
      v.titleBar.foregroundColor = foregroundColor
      v.titleBar.buttonBackgroundColor = backgroundColor
      v.titleBar.buttonForegroundColor = foregroundColor
  	}

    if (Windows.UI.ViewManagement.StatusBar) {
      let statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView()
      statusBar.backgroundColor = backgroundColor
      statusBar.foregroundColor = foregroundColor
      statusBar.backgroundOpacity = 1
      if (this.props.settings.statusBar == true) {
        statusBar.showAsync()
      }
      else {
        statusBar.hideAsync()
      }
    }

  }

  getMode() {
    return (
      window.innerWidth >= 1024 ? "large" :
      window.innerWidth >= 720 ? "medium" :
      "small"
    )
  }

  getSplitViewConfig() {
    const splitViewConfigs = {
      small: {
        closedDisplayMode: "none",
        openedDisplayMode: "overlay"
      },
      medium: {
        closedDisplayMode: "none",
        openedDisplayMode: "inline"
      },
      large: {
        closedDisplayMode: "none",
        openedDisplayMode: "inline"
      }
    }
    return splitViewConfigs[this.state.mode]
  }

  getString(id) {
    let str = WinJS.Resources.getString(id).value
    let parameters = str.match(/{(.*?)}/g)
    if (parameters) {
      parameters.forEach(parameter => {
        let pId = parameter.substring(1, parameter.length - 1)
        if (isNaN(pId)) {
          str = str.replace(parameter, this.getString(pId))
        }
      })
    }
    return str
  }

  handleResize() {
    let prevMode = this.state.mode
    let nextMode = this.getMode()

    this.setState({ mode: nextMode })
  }

  componentWillMount() {
    this.setAppTheme(this.props.settings.theme)
    this.setAppColor(this.props.settings.primaryColor)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    keyboardJS.on("ctrl + o", this.handleOpenButtonClick.bind(this))
    keyboardJS.on("ctrl + n", this.handleNewButtonClick.bind(this))
    keyboardJS.on("ctrl + w", () => {
      this.handleTabCloseButtonClick(this.props.tabs.get("currentTab"))
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.settings.theme != nextProps.settings.theme) {
      this.setAppTheme(nextProps.settings.theme)
    }

    if ((this.props.settings.primaryColor.light != nextProps.settings.primaryColor.light)
     || (this.props.settings.primaryColor.dark != nextProps.settings.primaryColor.dark)) {
      this.setAppColor(nextProps.settings.primaryColor)
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleTabClick(id) {
    TabActions.changeCurrent({ id })
  }

  handleTabCloseButtonClick(id) {
    TabActions.closeTab({ id })
  }

  handleNewButtonClick() {
    let tab = {
      type: "new",
      name: "untitled"
    }
    TabActions.addTab({ tab })
  }

  handleOpenButtonClick() {
    let picker = new Windows.Storage.Pickers.FileOpenPicker()
    picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary
    picker.fileTypeFilter.append("*")

    let syntaxMode = "text"
    picker.pickSingleFileAsync()
     .then(file => {
       if (file) {
         let tab = {
           type: "file",
           name: file.name,
           file
         }
         TabActions.addTab({ tab })
      }
     })
  }

  handleSettingsButtonClick() {
    TabActions.changeCurrent({ id: "settings" })
  }

  handleAboutButtonClick() {
    TabActions.changeCurrent({ id: "about" })
  }

  handleTogglePaneInvoked() {
    this.setState({ paneOpened: !this.state.paneOpened })
  }

  handlePaneAfterClose() {
    this.setState({ paneOpened: false })
  }

  renderTabContent() {
    let current = this.props.tabs.get("currentTab")
    if (current == "settings")
      return <SettingsPage/>
    if (current == "about")
      return <AboutPage />
    let tab = this.props.tabs.getIn(["list", current])

    return <FilePage tab={tab} key={current} id={current}/>
  }

  handleTogglePaneInvoked() {
    this.setState({ paneOpened: !this.state.paneOpened })
  }

  handlePaneAfterClose() {
    this.state.paneOpened = false
  }

  handleKeyboardShortcutButtonClick() {
    let uri = new Windows.Foundation.Uri("https://gist.github.com/quanglam2807/adf61256af012944261b")
    return Windows.System.Launcher.launchUriAsync(uri)
  }

  render() {
    let currentTab = this.props.tabs.get("currentTab")
    let paneComponent = (
      <div className="app-leftnav">
        <div className="win-h4 app-leftnav-header">
          {this.getString("app-name")}
        </div>
        <div className="app-tab-container">
          {this.props.tabs.get("list").map((tab, i) => {
            return (
              <div
                className="win-splitviewcommand-button app-tab"
                key={i}
                style={(i == currentTab) ? { backgroundColor: this.props.settings.primaryColor.light, color: "#fff"} : null}>
                <div className="win-splitviewcommand-button-content app-tab-content" onClick={this.handleTabClick.bind(this, i)}>
                  <div
                    className="win-splitviewcommand-icon"
                    style={(tab.get("notSave") == true) ? { color: "#B71C1C" } : null}>
                    
                  </div>
                  <div className="win-splitviewcommand-label">{tab.get("name")}</div>
                </div>
                <div
                  className="win-splitviewcommand-icon app-tab-close-button"
                  onClick={this.handleTabCloseButtonClick.bind(this, i)}>
                  
                </div>
              </div>
            )
          })}
        </div>
        <ReactWinJS.ToolBar className="app-toolbar">
          <ReactWinJS.ToolBar.Button
            key="newFile"
            icon=""
            label={this.getString("new-file")}
            onClick={this.handleNewButtonClick.bind(this)}/>
          <ReactWinJS.ToolBar.Button
            key="openFile"
            icon=""
            label={this.getString("open-file")}
            onClick={this.handleOpenButtonClick.bind(this)}/>
          <ReactWinJS.ToolBar.Button
            key="settings"
            icon=""
            label={this.getString("settings")}
            onClick={this.handleSettingsButtonClick.bind(this)}/>
          <ReactWinJS.ToolBar.Button
            key="about"
            icon=""
            label={this.getString("about")}
            onClick={this.handleAboutButtonClick.bind(this)}/>
          <ReactWinJS.ToolBar.Button
            key="keyboardShortcuts"
            section="secondary"
            label={this.getString("keyboard-shortcuts")}
            onClick={this.handleKeyboardShortcutButtonClick.bind(this)}/>
        </ReactWinJS.ToolBar>
      </div>
    )

    return (
      <div className="win-type-body app-layout">
        <div className="app-menu-button win-ui-dark" style={{ backgroundColor: this.props.settings.primaryColor.light }}>
          <ReactWinJS.SplitViewPaneToggle
            aria-controls="rootSplitView"
            paneOpened={this.state.paneOpened}
            onInvoked={this.handleTogglePaneInvoked.bind(this)} />
        </div>
        <ReactWinJS.SplitView
          id="rootSplitView"
          paneComponent={paneComponent}
          contentComponent={<PassContext context={this.getChildContext()}>{this.renderTabContent()}</PassContext>}
          paneOpened={this.state.paneOpened}
          {...this.getSplitViewConfig()} />
       </div>
     )
  }
}

export default connectToStores(Layout)
