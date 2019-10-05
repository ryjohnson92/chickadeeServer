module.exports = class KDS{
    constructor(ws){
        this.pingInt = 5000; /// The interval for pings sent to device
        this.pingMSG = 100; /// tells websocket to stay open #continue
        this.pingResp = 204; /// Only acceptable response to ping #noContent
        this.ip = ws.ip;
        this.device = ws;
        ws.removeAllListeners();
        this.handlers = this.handlers();
        this.device.on('close',this.close.bind(this));
        this.device.on('error',()=>{
            this.close.bind(this)
        });
        this.device.on('message',this.messageHandler.bind(this));
        setInterval(this.ping.bind(this),this.pingInt);
    }
    messageHandler(msg){
        try{
            msg = JSON.parse(msg);
            let op = Object.keys(msg)[0];
            if(typeof this.handlers[op]==='function'){
                this.handlers[op](msg[op]);
            }
        }
        catch(err){
            console.log(err)
        }
    }
    /**
     * Sends 
     */
    ping(){
        this.device.send(JSON.stringify({'ping':this.pingMSG}));
    }
    /**
     * Returns the handlers on 
     * @note this should be overrided by child class
     */
    handlers(){
        return({});
    }
    /*** Triggers the parent bound onclose event */
    close(){
        if(typeof this.onClose === 'function'){
            this.onClose();
        }
    }
    /**
     * Sends the new list of orders to the KDS 
     * @param {*} orders 
     */
    update(orders,complete){
        let x = orders.map(o => o.format());
        let y = complete.map(o=>o.format());
        x = x.concat(y);
        this.device.send(JSON.stringify({
            update:x
        }));
    }
    isThis(ip){
        console.log('is this ? %s',this.ip===ip);
        return this.ip === ip;
    }
}