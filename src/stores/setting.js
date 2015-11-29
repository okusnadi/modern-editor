import alt from "flalt.js"
import SettingActions from "actions/setting.js"

const settingsConfig = {
  theme: "light",
  primaryColor: {
    light: "#2196f3",
    dark: "#1976d2"
  },
  syntaxTheme: "monokai",
  statusBar: true,
  appLanguage: "auto",
  launchTimes: 0,
  rated: false,
  displayLanguage: "",
  fontSize: 15,
  aceOptions: {
    animatedScroll: false,
    cursorStyle: "ace",
    displayIndentGuides: true,
    dragDelay: 0,
    dragEnabled: true,
    enableBlockSelect: true,
    enableMultiselect: true,
    fadeFoldWidgets: false,
    firstLineNumber: 1,
    fixedWidthGutter: false,
    focusTimout: 0,
    fontFamily: "Courier New",
    fontSize: 15,
    highlightActiveLine: true,
    highlightGutterLine: true,
    highlightSelectedWord: true,
    hScrollBarAlwaysVisible: false,
    vScrollBarAlwaysVisible: false,
    indentedSoftWrap: true,
    mergeUndoDeltas: true,
    printMargin: 80,
    printMarginColumn: 80,
    scrollPastEnd: 0,
    scrollSpeed: 2,
    selectionStyle: "line",
    showFoldWidgets: true,
    showGutter: true,
    showInvisibles: false,
    showLineNumbers: true,
    showPrintMargin: false,
    tooltipFollowsMouse: true
  }
}


class SettingStore {
  constructor() {
    this.bindListeners({
      setValue: SettingActions.setValue,
      setAceOptionsValue: SettingActions.setAceOptionsValue
    })

    let initialState = {}
    Object.keys(settingsConfig).forEach(key => {
      initialState[key] = this.getInitialValue(key)
    })

    this.state = initialState

  }

  getInitialValue(name) {
    let localValue = Windows.Storage.ApplicationData.current.localSettings.values[name]
    if (typeof localValue === "undefined" || localValue == "default") {
      return settingsConfig[name]
    }
    try {
      return JSON.parse(localValue)
    }
    catch(err) {
       Windows.Storage.ApplicationData.current.localSettings.values.clear()
       Windows.Storage.ApplicationData.current.roamingSettings.values.clear()
       return settingsConfig[name]
    }
  }

  setValue({ name, value }) {
    let obj = {}
    obj[name] = value
    this.setState(obj)
    Windows.Storage.ApplicationData.current.localSettings.values[name] = JSON.stringify(value)
  }

  setAceOptionsValue({ name, value }) {
    let aceOptions = this.state.aceOptions
    aceOptions[name] = value
    this.setState({ aceOptions })
    Windows.Storage.ApplicationData.current.localSettings.values["aceOptions"] = JSON.stringify(aceOptions)
  }

}

export default alt.createStore(SettingStore, "SettingStore")
