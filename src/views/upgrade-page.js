import React from "react"
import ReactWinJS from "react-winjs"
import IAPUtils from "utils/iap.js"

class UpgradePage extends React.Component {
  static contextTypes = {
    settings: React.PropTypes.object,
    getString: React.PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      price: "",
      isPro: IAPUtils.isPro()
    }
  }

  componentDidMount() {
    Windows.ApplicationModel.Store.CurrentApp.loadListingInformationAsync("premium")
      .then(info => {
        if (info && info.productListings
            && info.productListings.premium && info.productListings.premium.formattedPrice) {
          let price = info.productListings.premium.formattedPrice
          this.setState({ price })
        }
      }, err => {})
  }

  handleBuyNowButtonClick() {
    return Windows.ApplicationModel.Store.CurrentApp.requestProductPurchaseAsync("premium")
      .then(() => {
        this.setState({ isPro: IAPUtils.isPro() })
      }, err => { })
  }

  handleRedeemCodeButtonClick() {
    let uri = new Windows.Foundation.Uri("https://account.microsoft.com/billing/redeem")
    return Windows.System.Launcher.launchUriAsync(uri)
  }

  handleFreeUpgradeButtonClick() {
    return Windows.ApplicationModel.Store.CurrentApp.getAppReceiptAsync()
      .then(
        txt => {
          let xmlDoc = new Windows.Data.Xml.Dom.XmlDocument()
          xmlDoc.loadXml(txt)
          let purchaseDate = new Date(xmlDoc.getElementsByTagName("AppReceipt")[0].attributes.getNamedItem("PurchaseDate").value)
          let pivotDate = new Date("2015-03-29T03:00:00Z")
          if (purchaseDate <= pivotDate) {
            return Windows.ApplicationModel.Store.CurrentApp.requestProductPurchaseAsync("free.upgrade")
                .then(() => {
                  this.setState({ isPro: IAPUtils.isPro() })
                }, err => {})
          }
          else {
            let title = this.context.getString("oops")
            let content = this.context.getString("not-qualified-for-free-upgrade")
            let msg = new Windows.UI.Popups.MessageDialog(content, title)
            return msg.showAsync()
          }
        },
        err => {
          let title = this.context.getString("connect-problem")
          let content = this.context.getString("check-connect")
          let msg = new Windows.UI.Popups.MessageDialog(content, title)
          return msg.showAsync()
        }
      )
  }

  render() {
    let pivotDate = new Date("2015-03-29T03:00:00Z")
    let datefmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter("shortdate")
    return (
      <Animation name="enterPage" className="app-upgrade-page">
        <img src="/images/PRO.png" className="app-logo" />
        <h3 className="win-h3">Modern Translate <b>PRO</b></h3>
        <h4 className="win-h4" style={{ marginTop: 12 }}>{this.context.getString("personalization")}</h4>
        <h6 className="win-h6">{this.context.getString("personalization-intro")}</h6>
        <h4 className="win-h4" style={{ marginTop: 12 }}>{this.context.getString("no-ads")}</h4>
        <h6 className="win-h6">{this.context.getString("no-ads-intro")}</h6>

        {(this.state.isPro) ? (
          <button
            className="win-button"
            disabled={true}
            style={{ marginTop: 24 }}>
            {this.context.getString("unlocked")}
          </button>
        ) : (
          <div>
            <h6 className="win-h6" style={{ marginTop: 24 }}>{this.state.price}</h6>
            <button
              className="win-button"
              style={{ backgroundColor: this.context.settings.primaryColor.light, color: "#fff", marginTop: 6 }}
              onClick={this.handleBuyNowButtonClick.bind(this)}>
              {this.context.getString("buy-now")}
            </button>
            <br/>
            <button
              className="win-button"
              style={{ marginTop: 6, marginBottom: 12 }}
              onClick={this.handleRedeemCodeButtonClick.bind(this)}>
              {this.context.getString("redeem-code")}
            </button>

            <h6 className="win-h6" style={{ marginTop: 24 }}>{this.context.getString("free-upgrade-msg").replace("{1}", datefmt.format(pivotDate))}</h6>
            <button
              className="win-button"
              style={{ marginTop: 6, marginBottom: 12 }}
              onClick={this.handleFreeUpgradeButtonClick.bind(this)}>
              {this.context.getString("free-upgrade-btn")}
            </button>
          </div>
        ) }
      </Animation>
    )
  }
}

export default UpgradePage
