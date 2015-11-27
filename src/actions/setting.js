import alt from "flalt.js"

class SettingActions {
  setValue({ name, value }) {
    return { name, value }
  }

  setAceOptionsValue({ name, value }) {
    return { name, value }
  }
}

export default alt.createActions(SettingActions)
