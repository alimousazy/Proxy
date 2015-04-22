let http = require('http')
let request = require('request')
let fs   = require('fs')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme + argv.host + ':' + port
let outputStream = argv.log ? fs.createWriteStream(argv.log) : process.stdout


http.createServer((req, res) => {
    let options = {
        headers: req.headers,
        url: `${destinationUrl}${req.url}`
    }
    outputStream.write('\n\n\n' + JSON.stringify(req.headers))
    req.pipe(outputStream)
    let downstreamResponse = req.pipe(request(options))
    outputStream.write(JSON.stringify(downstreamResponse.headers))
    downstreamResponse.pipe(outputStream)
    downstreamResponse.pipe(res)
}).listen(8001)



