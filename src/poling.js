const WShell = require('WScript.Shell')
const Event = require('event')
const { isRegExp, isNumber } = require('typecheck')
const { TypeName } = require('VBScript')
const { cursorHrAbs, eraseInLine } = require('ansi')
const { SPACE } = require('text')
const anime = ['|', '/', '-', '\\']


class Navigation extends Event {
    emit(url, ...args) {
        this.forEach((callback, listener) => {
            if (isRegExp(listener) && listener.test(url) || listener === url) {
                callback.forEach(cb => cb(url, ...args))
            }
        })
    }
}
const navigation = new Navigation

const defaultOptions = {
    invisible: false,
    home: 'about:blank',
    complate() {
        this.run = false
        console.log('\nComplate! exports: %O', this.exports)
    },
    expection(error) {
        console.log('\nExpection! exports: %O', this.exports)
        throw error
    },
    exports: [],
    navigation,
    run: true
}

function browser (callback, options = {}) {
    const status = Object.assign(defaultOptions, options)
    const app = require('InternetExplorer.Application')
    app.Visible = !status.invisible
    app.Navigate(status.home)
    let url = status.home
    wait(app)
    WShell.AppActivate(app.LocationName)

    try {
        callback(app, status)

        status.document = app.Document
        status.window = app.Document.parentWindow
        navigation.emit(url, status)

        let count = 0
        while ( status.run ) {
            wait(app)
            if (url === app.LocationURL) {
                console.print(cursorHrAbs(1) + anime[count % 4] + SPACE + 'polling')
                count++
                WScript.Sleep(100)
            } else {
                console.print(cursorHrAbs(1) + eraseInLine(2))
                url = app.LocationURL
                status.document = app.Document
                status.window = app.Document.parentWindow
                navigation.emit(url, status)
            }
        }
    } catch (error) {
        status.expection(error)
    } finally {
        if(browserExist(app)) app.Quit()
    }
}

module.exports = browser

// util
function browserExist (app) {
  return app != null && TypeName(app) === 'IWebBrowser2'
}

function wait(app) {
    if (app == null) return showWait(2000)
    if (browserExist(app)) return showReadyState(app)
    if (isNumber(app)) return showWait(app)
}

function showReadyState (app) {
    const state = ["uninitialized","loading","loaded","interactive","complete"]
    let count = 0
    while (app.Busy || app.readystate < 4) {
        console.print(cursorHrAbs(1) + anime[count % 4] + SPACE + state[app.readystate])
        WScript.Sleep(100)
        count++
    }
    console.print(cursorHrAbs(1) + eraseInLine(2))
}

function showWait (num) {
    const end = new Date().getTime() + num * (Math.random() * 0.5 + 0.75)
    let count = 0
    while (new Date().getTime() < end) {
        console.print(cursorHrAbs(1) + anime[count % 4] + SPACE + 'waiting')
        WScript.Sleep(100)
        count++
    }
    console.print(cursorHrAbs(1) + eraseInLine(2))
}
