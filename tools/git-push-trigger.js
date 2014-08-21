var http = require('http');
var exec = require('child_process').exec;

function do_update() {
	var child = exec("./git-post-update.sh", function(err, stdout, stderr) {
		if (err !== null)
			console.log("exec error: " + err);
		console.log("stdout: " + stdout);
		console.log("stderr: " + stderr);
		console.log("finish");
	});
}

function http_server(req, res) {
	console.log("request: " + req.method);
	if (req.method == "POST") {
		var data = "";
		req.on("data", function(chunk){data+=chunk});
		req.on("end", function(){ console.log(data); do_update() });
		req.on("error", function(e){ console.log(e) });
	}
	res.writeHeader(200);
	res.end();
}

http.createServer(http_server).listen(38193, "127.0.0.1");
console.log("listening...");
