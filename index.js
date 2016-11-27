'use strist';
var http = require('http');
var fs = require('fs');
var config = require('./config/main');
var appServer, appPath, contents, fileExt, filePath, contentType;
appServer = http.createServer(function(request, response) {
    console.log(request.url);
    var appPath = request.url.split('/').filter(function(item) {
        return item.trim() !== '';
    });
    response.fileExt = (request.url.lastIndexOf('.')!==-1) ? request.url.substr(request.url.lastIndexOf('.')) : '';
    if(appPath.length == 1) {
        filePath = './' + config.app.staticPrefix + '/' + appPath[0] + '.html';
    }
    else{
        filePath = '.' + request.url + (('' === response.fileExt) ? '/index.html' : '');
    }
    try{
        fs.readFile(filePath, function(error,contents) {
            if(null !== error) {
                response.writeHeader(404, {'Content-Type': 'text/plain'});
                response.end('Page "' + request.url + '" Not found');
            }
            contentType = ('' === response.fileExt) ? 'text/html' : (((response.fileExt == '.png') || (response.fileExt == '.jpg') || (response.fileExt == '.gif')) ? ('image/' + response.fileExt.substr(1)): 'text/' + response.fileExt.substr(1));
            response.writeHeader(200, {'Content-Type': contentType});
            response.end(contents);
        });
    }
    catch(err){
        console.dir(err);
        response.writeHeader(500, {'Content-Type': 'text/plain'});
        response.end('An error occured during page processing, please try again later..')
    }
});
appServer.listen(config.server.port, config.server.host);
