# browser
Operate Internet Explorer with wes



## install

```
wes install wachaon@browser
```

## usage

```
const browser = require('@wachaon/browser')

browser((ie, status) => {
    const { navigation } = status

    navigation.on(/google/, (url, { window, document }) => {
        console.log('OK google! %O', document.title)
    })

}, {home: 'https://google.com/'})
```
