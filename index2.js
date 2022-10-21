const http = require("http");
const PORT = 8080;

const server = http.createServer((req, res) => {
    
    let daate = new Date()
    let date = daate.getHours
    if(date >= 6  || date  <= 12 ){
        res.end(console.log("buenos noches"))
   
   
    }
    if(date >= 13  || date  <= 19 ){
        res.end(console.log("buenos noches"))
   
   
    }
    if(date >= 20  || date  <= 5 ){
     res.end(console.log("buenos noches"))
   
   
    }
  
});

server.listen(PORT, () => {
  console.log(`Servidor Http escuchando en el puerto http://localhost:${PORT}`);
 
 
});
