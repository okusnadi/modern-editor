import alt from "flalt.js"
import TabActions from "actions/tab.js"
import Immutable from "immutable"
import immutable from "alt/utils/ImmutableUtil"

@immutable
class TabStore {
  constructor() {
    this.bindListeners({
      addTab: TabActions.addTab,
      closeTab: TabActions.closeTab,
      updateTab: TabActions.updateTab,
      saveFile: TabActions.saveFile,
      saveAsFile: TabActions.saveAsFile,
      changeCurrent: TabActions.changeCurrent
    })

    let snapshot = Windows.Storage.ApplicationData.current.localSettings.values["snapshot"]
    if (typeof snapshot != "undefined") {
      this.state = Immutable.fromJS(JSON.parse(snapshot).TabStore)
    }
    else {
      this.state = Immutable.Map({
        list: Immutable.List([
          Immutable.Map({
            type: "new",
            name: "untitled"
          })
        ]),
        currentTab: 0
      })
    }
  }

  addTab({ tab }) {
    if (tab.type == "file") {
      const modelist = ace.require("ace/ext/modelist")
      let { file } = tab
      let syntaxMode = modelist.getModeForPath(file.path).name
      Windows.Storage.FileIO.readTextAsync(file)
        .then(
          text => {
            return text
          },
          err => {
            return Windows.Storage.FileIO.readTextAsync(file, Windows.Storage.Streams.UnicodeEncoding.utf16BE)
          }
        )
        .then(text => {
          tab.text = text
          tab.syntaxMode = syntaxMode
          tab.fileToken = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.add(file)
          delete tab.file
          let list = this.state.get("list").push(Immutable.Map(tab))
          let currentTab = list.size - 1
          this.setState(this.state.setIn(["list"], list).setIn(["currentTab"], currentTab))
        })
      return
    }

    let list = this.state.get("list").push(Immutable.Map(tab))
    let currentTab = list.size - 1
    this.setState(this.state.setIn(["list"], list).setIn(["currentTab"], currentTab))
  }

  closeTab({ id }) {
    return new WinJS.Promise((complete, error, progress) => {
      let tab = this.state.getIn(["list", id])
      if (tab.get("notSave")) {
        let msg = new Windows.UI.Popups.MessageDialog(
          WinJS.Resources.getString("file-has-changed").value
            .replace("{filename}", tab.get("name"))
        )

        msg.commands.append(new Windows.UI.Popups.UICommand("Yes", () => {
          this.saveFile({ id })
            .then(
              (ok) => {
                complete(ok)
              },
              err => {
                error(err)
              }
            )
        }))
        msg.commands.append(new Windows.UI.Popups.UICommand("No", () => {
          complete(true)
        }))
        msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", () => {
          complete(false)
        }))

        msg.defaultCommandIndex = 0
        msg.cancelCommandIndex = 2
        msg.showAsync()
      }
      else {
        complete(true)
      }
    })
    .then(shouldContinue => {
      if (!shouldContinue) return
      let currentTab = this.state.get("currentTab")
      let list
      if (this.state.get("list").size == 1) {
        list = Immutable.List([
          Immutable.Map({
            type: "new",
            name: "untitled"
          })
        ])
        currentTab = 0
      }
      else {
        list = this.state.get("list").delete(id)
        if ((id == currentTab) || (id < currentTab)) {
          currentTab = currentTab - 1
        }
      }
      this.setState(this.state.setIn(["list"], list).setIn(["currentTab"], currentTab))
    })
  }

  updateTab({ id, tab }) {
    this.setState(this.state.setIn(["list", id], tab))
  }

  saveFile({ id }) {
    let tab = this.state.getIn(["list", id])
    if (tab.get("type") == "file") {
      let fileToken = tab.get("fileToken")
      return Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.getFileAsync(fileToken)
        .then(file => {
          return Windows.Storage.FileIO.writeTextAsync(file, tab.get("text") || "")
        })
        .then(() => {
          this.setState(this.state.setIn(["list", id, "notSave"], false))
          return true
        })
        .then(null, (err) => {
          console.log(err)
        })
    }
    return this.saveAsFile({ id })
  }

  saveAsFile({ id }) {
    let savePicker = new Windows.Storage.Pickers.FileSavePicker()
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary
    const modelist = ace.require("ace/ext/modelist")
    modelist.modes.forEach(mode => {
      let exts = mode.extensions
                  .split("|")
                  .map(ext => "." + ext.replace("^", "").replace(".", ""))
      savePicker.fileTypeChoices.insert(mode.caption, exts)
    })
    savePicker.suggestedFileName = "New Document"
    savePicker.defaultFileExtension = ".txt"
    return savePicker.pickSaveFileAsync()
      .then(file => {
        if (file) {
          let tab = this.state.getIn(["list", id])
          let fileToken = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.add(file)
          return Windows.Storage.FileIO.writeTextAsync(file, tab.get("text"))
          .then(() => {
            let list = this.state.get("list")
                        .setIn([id, "type"], "file")
                        .setIn([id, "name"], file.name)
                        .setIn([id, "notSave"], false)
                        .setIn([id, "fileToken"], fileToken)
            this.setState(this.state.setIn(["list"], list ))
            return true
          })
        }
        return false
      })
  }

  changeCurrent({ id }) {
    this.setState(this.state.setIn(["currentTab"], id))
  }
}

export default alt.createStore(TabStore, "TabStore")
