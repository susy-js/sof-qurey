like susyweb but for minimalists


```js
var provider = { sendAsync: function(params, cb){/* ... */} }
var query = new SofQuery(provider)

query.getBalance(address, cb)
```