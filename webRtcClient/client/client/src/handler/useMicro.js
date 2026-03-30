export function useMicro(stream) {

    const microToggle = () => {
        console.log(stream.current)
        if (stream.current) {
            const audioTrack = stream.current.getAudioTracks()

            audioTrack.forEach(track => {
                track.enabled = !track.enabled
                console.log("micro: ", track.enabled)
            })
        }
    }

    return {
        microToggle
    }
}