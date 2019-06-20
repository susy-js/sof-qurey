const extend = require('xtend')
const async = require('async')
const createRandomId = require('json-rpc-random-id')()

module.exports = SofQuery


function SofQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block 
SofQuery.prototype.getBalance =                          generateFnWithDefaultBlockFor(2, 'sof_getBalance')
SofQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'sof_getCode')
SofQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'sof_getTransactionCount')
SofQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'sof_getStorageAt')
SofQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'sof_call')
// standard
SofQuery.prototype.protocolVersion =                     generateFnFor('sof_protocolVersion')
SofQuery.prototype.syncing =                             generateFnFor('sof_syncing')
SofQuery.prototype.coinbase =                            generateFnFor('sof_coinbase')
SofQuery.prototype.mining =                              generateFnFor('sof_mining')
SofQuery.prototype.hashrate =                            generateFnFor('sof_hashrate')
SofQuery.prototype.gasPrice =                            generateFnFor('sof_gasPrice')
SofQuery.prototype.accounts =                            generateFnFor('sof_accounts')
SofQuery.prototype.blockNumber =                         generateFnFor('sof_blockNumber')
SofQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('sof_getBlockTransactionCountByHash')
SofQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('sof_getBlockTransactionCountByNumber')
SofQuery.prototype.getUncleCountByBlockHash =            generateFnFor('sof_getUncleCountByBlockHash')
SofQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('sof_getUncleCountByBlockNumber')
SofQuery.prototype.sign =                                generateFnFor('sof_sign')
SofQuery.prototype.sendTransaction =                     generateFnFor('sof_sendTransaction')
SofQuery.prototype.sendRawTransaction =                  generateFnFor('sof_sendRawTransaction')
SofQuery.prototype.estimateGas =                         generateFnFor('sof_estimateGas')
SofQuery.prototype.getBlockByHash =                      generateFnFor('sof_getBlockByHash')
SofQuery.prototype.getBlockByNumber =                    generateFnFor('sof_getBlockByNumber')
SofQuery.prototype.getTransactionByHash =                generateFnFor('sof_getTransactionByHash')
SofQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('sof_getTransactionByBlockHashAndIndex')
SofQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('sof_getTransactionByBlockNumberAndIndex')
SofQuery.prototype.getTransactionReceipt =               generateFnFor('sof_getTransactionReceipt')
SofQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('sof_getUncleByBlockHashAndIndex')
SofQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('sof_getUncleByBlockNumberAndIndex')
SofQuery.prototype.getCompilers =                        generateFnFor('sof_getCompilers')
SofQuery.prototype.compileLLL =                          generateFnFor('sof_compileLLL')
SofQuery.prototype.compilePolynomial =                     generateFnFor('sof_compilePolynomial')
SofQuery.prototype.compileSerpent =                      generateFnFor('sof_compileSerpent')
SofQuery.prototype.newFilter =                           generateFnFor('sof_newFilter')
SofQuery.prototype.newBlockFilter =                      generateFnFor('sof_newBlockFilter')
SofQuery.prototype.newPendingTransactionFilter =         generateFnFor('sof_newPendingTransactionFilter')
SofQuery.prototype.uninstallFilter =                     generateFnFor('sof_uninstallFilter')
SofQuery.prototype.getFilterChanges =                    generateFnFor('sof_getFilterChanges')
SofQuery.prototype.getFilterLogs =                       generateFnFor('sof_getFilterLogs')
SofQuery.prototype.getLogs =                             generateFnFor('sof_getLogs')
SofQuery.prototype.getWork =                             generateFnFor('sof_getWork')
SofQuery.prototype.submitWork =                          generateFnFor('sof_submitWork')
SofQuery.prototype.submitHashrate =                      generateFnFor('sof_submitHashrate')

// network level

SofQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (err || response.error) console.log('sofquery failure', opts, err || response.error)
    if (!err && response.error) err = new Error('SofQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
