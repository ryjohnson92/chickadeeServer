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
const Kiosk = express();
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

let server = new OrderDirect(wss);
/*** Then start the kiosk server */
Kiosk.set('view engine', 'ejs');
Kiosk.set('views',path.join(__dirname,'WebPublic'));
/// Body Parser Middlewares
Kiosk.use(cookieparser('posdine'));
Kiosk.use(bodyParser.json({limit: '500mb'}));
Kiosk.engine('html', require('ejs').renderFile);
Kiosk.use(bodyParser.urlencoded({ extended: false }));
/*** Kiosk Web Server  */
const kioskWebServer = https.createServer(credentials, Kiosk);
kioskWebServer.listen(kPort);
Kiosk.get('/kiosk',(req,res)=>{
    res.render('./KioskWeb/index.html')
});
Kiosk.get('/kiosk/kds',(req,res)=>{
    res.render('./KDS/index.html')
});
Kiosk.get('/kiosk/wmo',(req,res)=>{
    res.render('./wmo/index.html')
});
