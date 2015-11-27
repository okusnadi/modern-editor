import React from "react"
import ReactWinJS from "react-winjs"
import SettingActions from "actions/setting.js"

export default class SettingsPage extends React.Component {
  static contextTypes = {
    getString: React.PropTypes.func,
    settings: React.PropTypes.object,
    history: React.PropTypes.object
  }

  constructor() {
    super()

    let displayLanguages = [{ name: WinJS.Resources.getString('default').value, tag: "" }]
    Windows.Globalization.ApplicationLanguages.manifestLanguages.forEach((tag, i) => {
      let lang = new Windows.Globalization.Language(tag)
      displayLanguages.push({
        name: lang.nativeName,
        tag: tag
      })
    })

    const syntaxThemes = ace.require("ace/ext/themelist").themes

    this.state = {
      displayLanguages, syntaxThemes
    }
  }

  getAceOptions() {
    return {
      animatedScroll: false,
      cursorStyle: ["ace", "slim", "smooth", "wide"],
      displayIndentGuides: true,
      dragDelay: 0,
      dragEnabled: true,
      enableBlockSelect: true,
      enableMultiselect: true,
      fadeFoldWidgets: false,
      firstLineNumber: 1,
      fixedWidthGutter: false,
      focusTimout: 0,
      fontFamily: ["Segoe UI"],
      fontSize: 15,
      highlightActiveLine: true,
      highlightGutterLine: true,
      highlightSelectedWord: true,
      indentedSoftWrap: true,
      mergeUndoDeltas: true,
      printMargin: 80,
      printMarginColumn: 80,
      scrollPastEnd: 0,
      scrollSpeed: 2,
      selectionStyle: ["line", "text"],
      showFoldWidgets: true,
      showGutter: true,
      showInvisibles: false,
      showLineNumbers: true,
      showPrintMargin: true,
      tooltipFollowsMouse: true
    }
  }

  getMicrosoftDesignColors() {
    let colors = [
      { // Electric
        light: "#009DCE",
        dark: "#004A64"
      },
      { // Skyline
        light: "#0498BA",
        dark: "#005776"
      },
      { // Kale
        light: "#0DBAB1",
        dark: "#036861"
      },
      { // Cyber
        light: "#19CE78",
        dark: "#186637"
      },
      { // Lime
        light: "#8AAC0D",
        dark: "#54680A"
      },
      { // Tangerine
        light: "#EA9823",
        dark: "#AD691F"
      },
      { // Tang
        light: "#CC4B19",
        dark: "#873312"
      },
      { // Coral
        light: "#E74856",
        dark: "#993344"
      },
      { // Kool-Aid
        light: "#D61D91",
        dark: "#891054"
      },
      { // Berry
        light: "#AE3CC6",
        dark: "#771E7C"
      },
      { // Cargo
        light: "#904BF2",
        dark: "#432474"
      },
    ]
    return colors
  }

  getMaterialDesignColors() {
    let colors = [
      { // Red
        light: "#f44336",
        dark: "#d32f2f"
      },
      { // Pink
        light: "#e91e63",
        dark: "#c2185b"
      },
      { // Purple
        light: "#9c27b0",
        dark: "#7b1fa2"
      },
      { // Deep Purple
        light: "#673ab7",
        dark: "#512da8"
      },
      { // Indigo
        light: "#3f51b5",
        dark: "#303f9f"
      },
      { // Blue
        light: "#2196f3",
        dark: "#1976d2"
      },
      { // light Blue
        light: "#039be5",
        dark: "#0277bd"
      },
      { // Cyan
        light: "#0097A7",
        dark: "#00838F"
      },
      { // Teal
        light: "#009688",
        dark: "#00796B"
      },
      { // Green
        light: "#43A047",
        dark: "#2E7D32"
      },
      { // Light Green
        light: "#689f38",
        dark: "#558b2f"
      },
      { // Orange
        light: "#EF6C00",
        dark: "#E65100"
      },
      { // Deep Orange
        light: "#FF5722",
        dark: "#E64A19"
      },
      { // Brown
        light: "#795548",
        dark: "#5D4037"
      },
      { // Blue Grey
        light: "#607D8B",
        dark: "#455A64"
      }
    ]
    return colors
  }

  handleColorItemClick(color) {
    SettingActions.setValue({ name: "primaryColor", value: color })
  }

  handleThemeItemClick(theme) {
    SettingActions.setValue({ name: "theme", value: theme })
  }

  handleToggleChange(name, e) {
    SettingActions.setValue({ name, value: e.currentTarget.winControl.checked })
  }

  handleAceOptionsToggleChange(name, e) {
    SettingActions.setAceOptionsValue({ name, value: e.currentTarget.winControl.checked })
  }

  handleStatusBarToggleChange(e) {
    let val = e.currentTarget.winControl.checked
    if (Windows.UI.ViewManagement.StatusBar) {
      let statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView()
      if (val == true) {
        statusBar.showAsync()
      }
      else {
        statusBar.hideAsync()
      }
    }
    SettingActions.setValue({ name: "statusBar", value: val })
  }

  handleDropdownChange(name, e) {
    SettingActions.setValue({ name, value: e.target.value })
  }

  handleDisplayLanguageDropdownChange(e) {
    Windows.Globalization.ApplicationLanguages.primaryLanguageOverride = e.target.value
    SettingActions.setValue({ name: "displayLanguage", value: e.target.value })
  }

  renderGeneralTab() {
    let aceOptions = this.getAceOptions()
    return (
      <div>
        {Object.keys(aceOptions).map((key, i) => {
          let stringKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
          if (typeof aceOptions[key] == "boolean") {
            return (
              <div>
                <h5 className="win-h5" style={(i > 0) ? { marginTop: 6 } : null}>
                  {this.context.getString(stringKey)}
                </h5>
                <ReactWinJS.ToggleSwitch
                  checked={this.context.settings.aceOptions[key]}
                  onChange={this.handleAceOptionsToggleChange.bind(this, key)}/>
              </div>
            )
          }
          return null
        })}
      </div>
    )
  }

  renderPersonalizationTab() {
    let materialDesignColors = this.getMaterialDesignColors()
    let microsoftDesignColors = this.getMicrosoftDesignColors()
    return (
      <div>
        <h5 className="win-h5" style={{ marginTop: 6, marginBottom: 6 }}>
          {this.context.getString("theme")}
        </h5>
        <div>
          {["light", "dark"].map(theme => {
            let itemClassName = "app-color-item"
            if (this.context.settings.theme == theme) {
              itemClassName += " active"
            }
            return (
              <div className={itemClassName}
                   style={{ backgroundColor: (theme == "light") ? "#ffffff" : "#000000" }}
                   key={theme}
                   onClick={this.handleThemeItemClick.bind(this, theme)}/>
            )
          })}
        </div>
        <h5 className="win-h5" style={{ marginTop: 12 }}>
          {this.context.getString("primary-color")}
        </h5>
        <div>
          <h6 className="win-h6" style={{ marginBottom: 6 }}>Material Design Pack</h6>
          {materialDesignColors.map((color, i) => {
            let itemClassName = "app-color-item"
            if ((this.context.settings.primaryColor.light == color.light)
              && (this.context.settings.primaryColor.dark == color.dark)) {
                itemClassName += " active"
              }
            return (
              <div className={itemClassName}
                   style={{ backgroundColor: color.light }}
                   key={i}
                   onClick={this.handleColorItemClick.bind(this, color)}/>
            )
          })}
        </div>
        <div style={{ marginTop: 6 }}>
          <h6 className="win-h6" style={{ marginBottom: 6 }}>Microsoft Design Pack</h6>
          {microsoftDesignColors.map((color, i) => {
            let itemClassName = "app-color-item"
            if ((this.context.settings.primaryColor.light == color.light)
              && (this.context.settings.primaryColor.dark == color.dark)) {
                itemClassName += " active"
              }
            return (
              <div className={itemClassName}
                   style={{ backgroundColor: color.light }}
                   key={i}
                   onClick={this.handleColorItemClick.bind(this, color)}/>
            )
          })}
        </div>
        <h5 className="win-h5" style={{ marginTop: 12 }}>
          {this.context.getString("syntax-theme")}
        </h5>
        <select
          className="win-dropdown"
          value={this.context.settings.syntaxTheme}
          onChange={this.handleDropdownChange.bind(this, "syntaxTheme")}>
          <optgroup label={this.context.getString("dark")}>
            {this.state.syntaxThemes.map(theme => {
              if (!theme.isDark) return null
              return (
                <option value={theme.name} key={theme.name}>
                  {theme.caption})
                </option>
              )
            })}
          </optgroup>
          <optgroup label={this.context.getString("light")}>
          {this.state.syntaxThemes.map(theme => {
            if (theme.isDark) return null
            return (
              <option value={theme.name} key={theme.name}>
                {theme.caption}
              </option>
            )
          })}
          </optgroup>
        </select>
        <h5 className="win-h5" style={{ marginTop: 12 }}>
          {this.context.getString("display-language")}
        </h5>
        <select
          className="win-dropdown"
          value={this.context.settings.displayLanguage}
          onChange={this.handleDisplayLanguageDropdownChange.bind(this)}>
          {this.state.displayLanguages.map(language => {
            return <option value={language.tag} key={language.tag}>{language.name}</option>
          })}
        </select>
        {(Windows.UI.ViewManagement.StatusBar) ? (
          <div>
            <h5 className="win-h5" style={{ marginTop: 6 }}>
              {this.context.getString("status-bar")}
            </h5>
            <ReactWinJS.ToggleSwitch
              checked={this.context.settings.statusBar}
              onChange={this.handleStatusBarToggleChange.bind(this)}/>
          </div>
        ): null}
      </div>
    )
  }

  render() {
    return (
      <div className="app-settings-page">
        <div className="win-h4 app-topbar">
          {this.context.getString("settings")}
        </div>
        <div className="app-page-content">
          <ReactWinJS.Pivot>
            <ReactWinJS.Pivot.Item key="personalizationTab" header={this.context.getString("personalization")}>
              {this.renderPersonalizationTab()}
            </ReactWinJS.Pivot.Item>
            <ReactWinJS.Pivot.Item key="generalTab" header={this.context.getString("general")}>
              {this.renderGeneralTab()}
            </ReactWinJS.Pivot.Item>
          </ReactWinJS.Pivot>
        </div>
      </div>
    )
  }
}
