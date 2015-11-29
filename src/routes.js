import React from "react"
import { Router, Route, IndexRoute } from "react-router"

import Layout from "views/layout/layout.js"

import EditorPage from "views/editor-page/editor-page.js"
import SettingsPage from "views/settings-page.js"
import AboutPage from "views/about-page.js"

export default (
  <Router>
    <Route path="/" component={Layout}>
      <IndexRoute component={EditorPage} />
      <Route path="settings" component={SettingsPage} />
      <Route path="about" component={AboutPage} />
    </Route>
  </Router>
)
