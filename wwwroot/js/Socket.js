let port;

function OpenPort(localAddress, localPort, remoteAddress, remotePort) {
    console.log("Opening port...");
    port = new osc.UDPPort({
        // This is the port we're listening on.
        localAddress: localAddress,
        localPort: localPort,

        // This is where sclang is listening for OSC messages.
        remoteAddress: remoteAddress,
        remotePort: remotePort,
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
    udpPort.send(data));
}