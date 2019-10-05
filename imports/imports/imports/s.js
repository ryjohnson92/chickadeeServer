/**
 * This is the parent class of web socket interactions 
 * @example 
 */
module.exports = class wsBase{
    constructor(ws){
        this.pingInt = 5000; /// The interval for pings sent to device
        this.pingMSG = 100; /// tells websocket to stay open #continue
        this.pingResp = 204; /// Only acceptable response to ping #noContent
        this.ip = ws.ip;
        this.device = ws;
        /** It is good to remove all listeners before building this class 
         * since the device could come pre loaded with listeners which could
         * cause conflict with the ones needed here; 
         */
        ws.removeAllListeners();
        /**
         * This should be an object with associated functions for the ws to act on
         * @example 
         * {
         *      function1:()=>{
         *          Do some stuff;
         *          this.device.send() // Payload should be JSON or String
         *      }
         * }
         * @type function || object 
         */
        this.handlers = this.handlers();
        this.device.on('close',this.close.bind(this));
        this.device.on('error',()=>{
            this.close.bind(this)
        });
        this.device.on('message',this.__messageHandler__.bind(this));
        /**
         * This is used to ping and respond to the devices requests 
         */
        setInterval(this.ping.bind(this),this.pingInt);
    }
    /**
     * This is dundered to prevent overrides, please dont 
     * Otherwise this method is used to handle all messages that are incoming into the ws 
     * based on what handlers you allow it to work upon
     * see this.handlers
     * @param {*} msg 
     */
    __messageHandler__(msg){
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
     * Sends a ping message to the device 
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
    /**
     * This is just for validation that this ws is sourced from this 
     * device ; 
     * @param {*} ip 
     */
    isThis(ip){
        console.log('is this ? %s',this.ip===ip);
        return this.ip === ip;
    }
}