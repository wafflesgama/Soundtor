var port;
var osc = require("osc");

function OpenPort(localAddress, localPort, remoteAddress, remotePort) {
    console.log("Opening port address 3 " + localAddress + " port " + remotePort);
    port = new osc.UDPPort({
        // This is the port we're listening on.
        localAddress: "127.0.0.1",
        localPort: 57120,

        // This is where sclang is listening for OSC messages.
        remoteAddress: "127.0.0.1",
        remotePort: 9001,
        metadata: true
    });

    // Open the socket.
    port.open();
}

function ClosePort() {
    console.log("Closing port...");
    port.close();
}

function SendData(data) {
    console.log("JS Sending data");
    //var result = udpPort.send(data);
    //console.log("Result: " + result);
    try {

            var port2 = new osc.UDPPort({
                // This is the port we're listening on.
                localAddress: '127.0.0.1',
                localPort: 57120,

                // This is where sclang is listening for OSC messages.
                remoteAddress: '127.0.0.1',
                remotePort: 9001,
                metadata: true
            });

        // Open the socket.
        port2.open();
        }
        catch (e) {
        // declarações para manipular quaisquer exceções
        console.log(e);
        }

        var msg = {
            address: "teste",
            args: [
                {
                    type: "f",
                    value: 1
                },
                {
                    type: "f",
                    value: 0
                }
            ]
        };
        console.log("port is below: ");
        console.log("port: " + port2);
        console.log("Sending message", msg.address, msg.args, "to", port2.options.remoteAddress + ":" + port2.options.remotePort);
        port2.send(msg);
    }
