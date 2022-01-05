 
 var numclick=0;
  var osc = require("osc");
  var udpPort;

 document.getElementById("testButton").addEventListener("click", () => {
    if (numclick === 0) {
       
        udpPort = new osc.UDPPort({
            // This is the port we're listening on.
            localAddress: "127.0.0.1",
            localPort: 57120,
            
            // This is where sclang is listening for OSC messages.
            remoteAddress: "127.0.0.1",
            remotePort: 9001,
            metadata: true
        }); 

        console.log("new UDPPORT "+ udpPort);
        
        // Open the socket.
        udpPort.open();
        console.log("open UDPPORT");
    } else {
        var msg = {
            address: "/teste1",
            args: [
                {
                    type: "f",
                    value: Math.random()
                },
                {
                    type: "f",
                    value: Math.random()
                }
            ]
        };
        console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
        udpPort.send(msg);
        console.log("sent");
    }
    numclick++;
    });

