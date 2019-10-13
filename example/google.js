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

    event.on( /^https:\/\/www.google.com\/search\?/, ( url ) => {
        const searchResult = Array.from( ie.Document.querySelectorAll( '.rc' ) )
        searchResult.forEach( node => {
            result.searchResult.push( Array.from( node.querySelectorAll( '.s' ) )[0].textContent + '\n' )
        } )
        log( () => wait )
        wait( 3000 )
        ie.Quit()
        throw new Error( 'ie.Quit()' )
    } )

}, options )
