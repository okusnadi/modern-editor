"use strict"

import React from "react"
import ReactDOM from "react-dom"
import Alt from "flalt.js"
import App from "views/layout/layout.js"

WinJS.Application.onactivated = args => {
  ReactDOM.render(<App/>, document.getElementById("app"))
}

WinJS.Application.oncheckpoint = () => {
  Windows.Storage.ApplicationData.current.localSettings.values["snapshot"] = Alt.takeSnapshot("TabStore")
}

WinJS.Application.start()
