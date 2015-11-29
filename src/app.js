"use strict"

import React from "react"
import ReactDOM from "react-dom"
import Alt from "flalt.js"
import AppRoutes from "routes.js"

WinJS.Application.onactivated = args => {
  ReactDOM.render(AppRoutes, document.getElementById("app"))
}

WinJS.Application.oncheckpoint = () => {
  Windows.Storage.ApplicationData.current.localSettings.values["snapshot"] = Alt.takeSnapshot("TabStore")
}

WinJS.Application.start()
