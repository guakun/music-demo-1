var http = require('http')
var fs = require('fs')
var url = require('url')
var qiniu = require('qiniu')
var port = process.argv[2]


if (!port) {
  console.log('请指定端口号好不好?\nnode server.js 8888 这样不会嘛?')
}

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /*************上面的不用看 **************/
  console.log('瓜坤说: 含查询字符串的路径\n' + pathWithQuery)

  if (path === '/uptoken') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.removeHeader('Date')

    var config = fs.readFileSync('./qiniu_config.json')
    config = JSON.parse(config)

    let {accessKey, secretKey} = config
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var options = {
      scope: 'music-demo-1'
    }
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)

    response.write(`{
      "uptoken": "${uploadToken}"
    }`)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end()
  }

  /***** 代码结束, 下面不要看 *****/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请在空中转体 720 度然后用电饭煲打开 http://localhost:' + port)