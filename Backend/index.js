//ทำการ import  โมดูล http
const http = require('http');
const host = 'localhost';
const port = 8000;

//กำหนดค่า server
const requireListener = function (req, res) {
    res.writeHead(200);
    res.end('Hello World! This is my first server.');
}

//run server
const server = http.createServer(requireListener);
server.listen(port,host, ()=>{
    console.log(`Server is running on http://${host}:${port}`);
});