import React from "react"
import ReactWinJS from "react-winjs"

class AboutPage extends React.Component {
  static contextTypes = {
    getString: React.PropTypes.func,
    settings: React.PropTypes.object
  }

  openURI(uriStr) {
    let uri = new Windows.Foundation.Uri(uriStr)
    return Windows.System.Launcher.launchUriAsync(uri)
  }

  renderInfo() {
    return (
      <div>
        <div className="app-logo-container">
          <img src="/images/Square150x150.png" className="app-logo" />
        </div>
        <div className="app-info">
          <h4 className="win-h4" style={{ marginTop: 18 }}>{this.context.getString("app-name")}</h4>
          <h5 className="win-h5">0.2.0.0</h5>
          <h5 className="win-h5">Modern Lab</h5>
          <h5 className="win-h5">GPL-2.0</h5>
          <button
            className="win-button"
            onClick={this.openURI.bind(this, "https://github.com/modern-editor/modern-editor")}>
            {this.context.getString("view-on-github")}
          </button>
          <button
            className="win-button"
            onClick={this.openURI.bind(this, "ms-windows-store://pdp/?ProductId=9wzdncrcsg9k")}>
            {this.context.getString("view-on-store")}
          </button>
          <button
            className="win-button"
            onClick={this.openURI.bind(this, "https://github.com/modern-editor/modern-editor/releases")}>
            {this.context.getString("changelog")}
          </button>
          <h5 className="win-h5">made with ♥ in Vietnam & the Netherlands</h5>
        </div>
        <div className="app-feedback">
          <h5 className="win-h5">
            {this.context.getString("feedback-desc-1")}
          </h5>
          <h6 className="win-h6" style={{ marginBottom: 6 }}>
            {this.context.getString("feedback-desc-2")}
          </h6>
          <button
            className="win-button"
            onClick={this.openURI.bind(this, "mailto:support@modernlab.xyz")}>
            {this.context.getString("email-us")}
          </button>
          <button
            className="win-button"
            style={{ backgroundColor: "#333333", color: "#fff" }}
            onClick={this.openURI.bind(this, "https://github.com/modern-editor/modern-editor/issues")}>
            {this.context.getString("create-an-issue-on-github")}
          </button>
        </div>
        <div className="app-feedback" style={{ marginBottom: 12 }}>
          <h5 className="win-h5">
            {this.context.getString("love-our-app")}
          </h5>
          <button
            className="win-button"
            style={{ backgroundColor: this.context.settings.primaryColor.light, color: "#fff", marginTop: 6 }}
            onClick={this.openURI.bind(this, "ms-windows-store://review/?ProductId=9nblggh6hbmg")}>
            {this.context.getString("give-us-5-star")}
          </button>
        </div>
      </div>
    )
  }

  renderContributorList() {
    const contributors = [
    ]
    return (
      <div>
        <h5 className="win-h5">{this.context.getString("special-thanks-msg")}</h5>
        <button
          className="win-button"
          onClick={this.openURI.bind(this, "https://github.com/modern-editor/modern-editor/wiki/Translators")}>
          {this.context.getString("translators")}
        </button>
        <button
          className="win-button"
          onClick={this.openURI.bind(this, "https://github.com/modern-editor/modern-editor/graphs/contributors")}>
          {this.context.getString("developers")}
        </button>

        <h5 className="win-h5" style={{ marginTop: 16 }}>{this.context.getString("want-to-help-us")}</h5>
        <h4 className="win-h4 win-link" onClick={this.openURI.bind(this, "http://localization.modernlab.xyz")}>localization.modernlab.xyz</h4>
        <h4 className="win-h4">---</h4>
        <h4 className="win-h4 win-link" onClick={this.openURI.bind(this, "http://github.com/modern-editor/modern-editor")}>github.com/modern-editor/modern-editor</h4>
      </div>
    )
  }

  render() {
    return (
      <div className="app-about-page">
        <div className="win-h4 app-topbar">
          {this.context.getString("about")}
        </div>
        <div className="app-page-content">
          <ReactWinJS.Pivot>
            <ReactWinJS.Pivot.Item key="info" header={this.context.getString("info")}>
              {this.renderInfo()}
            </ReactWinJS.Pivot.Item>
            <ReactWinJS.Pivot.Item key="contributorList" header={this.context.getString("contributors")}>
              {this.renderContributorList()}
            </ReactWinJS.Pivot.Item>
          </ReactWinJS.Pivot>
        </div>
      </div>
    )
  }
}

export default AboutPage
