
const { isRegExp } = require( 'typecheck' )

function poling ( callback, options ) {

    function wait ( browser ) {
        while ( browser.Busy || browser.readystate != 4 ) {
            WScript.Sleep(100)
        }
    }

    const app = require( 'InternetExplorer.Application' )
    app.Visible = !options.invisible
    app.Navigate( options.home || 'about:blank' )

    wait( app )

    const events = new Map()
    const event = {
        on ( target, fn ) {
            if ( events.has( target ) ) events.get( target ).push( fn )
            else events.set( target, [ fn ] )
        },
        emit ( url, ...params ) {
            events.forEach( ( callbacks, evaluation ) => {
                if ( ( isRegExp( evaluation ) && evaluation.test( url ) ) || String( evaluation ) === url ) callbacks.forEach( fn => fn( url, ...params ) )
            } )
        }
    }

    let result = {}

    try {
        callback( app, event, result )

        let state = ''

        while ( true ) {
            wait( app )
            let url = app.document.location.href
            if ( state === url ) {
                console.print( '.' )
                WScript.Sleep( 100 )
                continue
            }
            wait( app )
            console.print( '\n' )
            event.emit( url )
            state = url
        }
    } catch ( error ) {
        console.print( '\n' )
        app.Visible = true
        if ( options.exception ) options.exception( error, result )
        else throw error
    }
}

exports.poling = poling
