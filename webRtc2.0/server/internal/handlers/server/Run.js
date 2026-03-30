export function Run(config, error) {
    if(error) {
        console.log(`Error start: ${error}`)
        return
    }
    console.log(`Server started\nPORT: ${config.port}\nHOST: ${config.host}`)
}