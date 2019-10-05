const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser');
/*** Cert  */
const privateKey  = fs.readFileSync('private.rsa', 'utf8');
const certificate = fs.readFileSync('public.crt', 'utf8');
/** ports  */
const port = 4000;
const kPort = 8000;
const credentials = {key: privateKey, cert: certificate};
const app = express();
const api = express();
/** Creates Server  */
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);
/*** socket SErver init */
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    server: httpsServer
    });
const OrderDirect = require('./z_newOrderDirect/orderDirect');
/** This is the socket server  */
//##### BUG 
new OrderDirect(wss);
/*** Then start the api server */
api.set('view engine', 'ejs');
api.set('views',path.join(__dirname,'WebPublic'));
/// Body Parser Middlewares
api.use(cookieparser('posdine'));
api.use(bodyParser.json({limit: '500mb'}));
api.engine('html', require('ejs').renderFile);
api.use(bodyParser.urlencoded({ extended: false }));
/*** api Web Server  */
const apiWebServer = https.createServer(credentials, api);
apiWebServer.listen(kPort);
api.get('/api',(req,res)=>{
    res.render('./apiWeb/index.html')
});
api.get('/api/kds',(req,res)=>{
    res.render('./KDS/index.html')
});
api.get('/api/wmo',(req,res)=>{
    res.render('./wmo/index.html')
});
