export function checkConfigHandler(config) {
    config.port = normalizePort(config.port)
    config.host = normalizeHost(config.host)
}

function normalizeHost(host, defaultHost = "localhost") {

    //Check if host is a null/undef
    if(host == null) {
        console.log("Host is a null/undef")
        return defaultHost
    }
    //Check if host is a number
    if(typeof host == "number") {
        console.log("Host is a number, set default host")
        return defaultHost
    }

    //Check if host is a string
    if(typeof host == "string") {
        return host
    }

    console.log("Set default host")
    return defaultHost
}

function normalizePort(port, defaultPort = 3000) {

    //Check if port is a null/undef
    if(port == null) {
        console.log(`Port is null, set default port(3000)`)

        return defaultPort
    }
    
    //Check if port is a string, next parse it
    if(typeof port == "string") {
        const parsedPort = parseInt(port, 10)
        console.log("Port parsed, write down the number of ports")
        port = isNaN(parsedPort) ? defaultPort : parsedPort
    }

    if(typeof port == "number" && port >= 0 && port <= 65536) {
        return port
    }

    console.log(`Set default port(3000)`)

    return defaultPort
}