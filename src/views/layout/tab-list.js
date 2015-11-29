import React from "react"
import ReactWinJS from "react-winjs"

import connectToStores from "alt/utils/connectToStores"

import SettingStore from "stores/setting.js"
import SettingActions from "actions/setting.js"
import TabStore from "stores/tab.js"
import TabActions from "actions/tab.js"

class TabList extends React.Component {
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

  handleTabClick(id) {
    TabActions.changeCurrent({ id })
    this.context.history.replaceState(null, "/", {})
  }

  handleTabCloseButtonClick(id) {
    TabActions.closeTab({ id })
  }

  render() {
    let currentTab = (this.context.location.pathname == "/") ? this.props.tabs.get("currentTab") : -1
    return (
      <div className="app-tab-container">
        {this.props.tabs.get("list").map((tab, i) => {
          return (
            <div
              className="win-splitviewcommand-button app-tab"
              key={i}
              style={(i == currentTab) ? { backgroundColor: this.context.settings.primaryColor.light, color: "#fff"} : null}>
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
    )
  }
}

export default connectToStores(TabList)
