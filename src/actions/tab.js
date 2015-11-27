import alt from "flalt.js"

class TabActions {
  addTab({ tab }) {
    return { tab }
  }

  closeTab({ id }) {
    return { id }
  }

  updateTab({ id, tab }) {
    return { id, tab }
  }

  saveFile({ id }) {
    return { id }
  }

  saveAsFile({ id }) {
    return { id }
  }

  changeCurrent({ id }) {
    return { id }
  }
}

export default alt.createActions(TabActions)
