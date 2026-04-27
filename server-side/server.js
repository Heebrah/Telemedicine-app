const http = require('http')

const server = http.createServer((request, response) =>{
  // response.statusCode = 200;
  // response.setHeader('Content-Type', 'text/plain')
  // response.end('Hello, web Development Class!!');

  if(request.url === '/'){
    response.writeHead(200, {"content-type" :'text/plain'})
    response.end('Welcome to the landing page')
  }
  else if(request.url === '/about'){
    response.writeHead(200, {"content-type" :'text/plain'})
    response.end('This is the about page')
  }
  else{
    response.writeHead(404, {"content-type" :'text/plain'})
    response.end('Page not found')
  }

})

const PORT = 4500;

server.listen(PORT, ()=>{
  console.log(`server is running http://localhost:${PORT}`)
})