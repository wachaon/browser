const app = require( 'wachaon@browser' )

const options = {
    home: 'https://www.google.com/?hl=ja'
}

app( ( ie, event, result ) => {
    ie.Document.getElementByName( 'q' ).value = 'wachaon'
    ie.Document.getElementByName( 'btnK' ).click()

    //event.on( )//, ( url ) => )

}, options )

/*
<input
class="gLFyf gsfi"
maxlength="2048"
name="q"
type="text"
jsaction="paste:puy29d"
aria-autocomplete="both"
aria-haspopup="false"
autocapitalize="off"
autocomplete="off"
autocorrect="off"
role="combobox"
spellcheck="false"
title="検索"
value=""
aria-label="検索"
data-ved="0ahUKEwiItPzZ8ZflAhUHvZQKHaFMBKsQ39UDCAQ"/>
*/