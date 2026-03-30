import { useEffect, useRef } from "react";

export function useCamera() {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    
    const startCamera = async () => {
        try {
            if(streamRef.current) return
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            console.log("streamRef.current", streamRef.current)
            videoRef.current.srcObject = streamRef.current

        } catch (error) {
            console.error(error)
            return
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const cameraToggle = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()

            videoTrack.forEach(track => {
                track.enabled = !track.enabled
                console.log("video: ", track.enabled)
            })
        }
    
    }

    useEffect(() => {

        return () => {
            console.log("DELETE CAM")
            stopCamera()
        }
    }, [])

    return {
        videoRef,
        streamRef,
        startCamera,
        stopCamera,
        cameraToggle
    }
}
