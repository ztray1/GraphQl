import "@babel/polyfill/noConflict.js";
import server from "./server.js"; 

server.start({port:process.env.PORT||4000},()=>{
    console.log("the server is up!");
})