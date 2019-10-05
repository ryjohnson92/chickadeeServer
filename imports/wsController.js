
// Admin groups are similar to location groups except they control all data for a set
// of admins, this set of admins is dynamic, meaning that once authorized an admin used will be 
// added to this group and work from the same data as all other admin groups instead of 
// from their own personal set of data
module.exports = class OrderDirect{
    /**
     * @param {object}
     */
    constructor(WSS){
        this.server = WSS;
        let y = this.messageHander.bind(this);
        this.server.on('connection', function connection(ws,req) {
            ws.on('message', function incoming(message) {
                y(message,req,ws);
            });
        });
        console.log('\x1b[32m%s\x1b[0m','Order Direct Started');
    }
    async messageHander(wsMSG,req,ws){
        ws.removeAllListeners();
        if(wsMSG ===""+165){ /// Kiosk Init id 
            ws.ip = ip;
            this.Database.Locations.newSocket(ws);
        }  
        else if (wsMSG ===""+265){ /// Admin Init id 
            ws.ip = ip;
            //this.adminInit(ws); /// WS is passed to Kiosk object
        }
        else if (wsMSG ===""+365){ /// KDM display
            ws.ip = ip;
            ws.KDS = true;
            this.Database.Locations.newSocket(ws);
        }
        else if (wsMSG ===""+465){
            ws.ip = ip;
            ws.KDS = false;
            this.Database.Locations.newSocket(ws);
        }
    }
    /*** Creates new instance of admin interface */
    adminInit(ws){
       // this.admin.addDevice(ws);
    }
    /** Drops admin for current availbe admins */
    dropAdmin(admin){
        this.admins.splice(this.admins.indexOf(admin),1);
    }
    adminGetDevice(ip){
        let device = false;
        for(let loc in this.locations){
            device = this.locations[loc].getDevice(ip);
            if(device!== false){
                break;
            }
        }
        return device;
    }
}