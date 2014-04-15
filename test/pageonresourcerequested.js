var http = require('http');
var phantom = require('../node-phantom');
var assert=require('assert');

var server=http.createServer(function(request,response){
    response.end('<html><head></head><body><h1>Hello World</h1></body></html>');
}).listen();

describe('Phantom Page',function(){
	this.timeout(5000);
	it('should be able to set ',function(done){
		var url = 'http://localhost:'+server.address().port+'/';
		phantom.create(errOr(function(ph){
			ph.createPage(errOr(function(page){
                var phantomSide = false,
                    nodeSide = false;

                page.onConsoleMessage = function(){
                    phantomSide = true;
                };

				page.setOnResourceRequested(function(){
                    page.javaScriptConsoleMessageSent('phantom');
                },function(){
                    nodeSide = true;
                });

				page.open(url, errOr(function(status){
					assert.equal(status,'success');
                    assert.equal(nodeSide,true);
                    assert.equal(phantomSide,true);
                    done();
				}));
			}));
		}));
	});

	function errOr(fn) {
		return function(err, res) {
			assert.ifError(err);
			fn(res);
		};
	}
});