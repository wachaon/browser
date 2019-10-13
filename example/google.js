const { poling: app } = require( 'wachaon@browser' )
const log  = require( 'log' )

const options = {
    home: 'https://www.google.com/',
    // invisible: true,
    exception ( err, result ) {
        console.log( err.message )
        log( () => result.searchResult )
    }
}

app( ( ie, event, result, wait ) => {
    ie.Document.getElementsByName( 'q' )[0].value = 'wsh JScript'
    ie.Document.getElementsByName( 'btnK' )[0].click()
    result.searchResult = []

    let count = 0

    event.on( /.+/, ( url ) => {
        let colors = [ console.ansi.red, console.ansi.green, console.ansi.yellow, console.ansi.blue, console.ansi.magenta, console.ansi.cyan ]
        console.log( `%s${ url }`, colors[ count++ % colors.length ] )
    } )

    event.on( /^https:\/\/www.google.com\/search\?/, ( url ) => {
        const searchResult = Array.from( ie.Document.querySelectorAll( '.rc' ) )
        searchResult.forEach( node => {
            result.searchResult.push( Array.from( node.querySelectorAll( '.s' ) )[0].textContent + '\n' )
        } )
        // wait( 2000 )
        // ie.Quit()
        // throw new Error( 'ie.Quit()' )
    } )

}, options )
