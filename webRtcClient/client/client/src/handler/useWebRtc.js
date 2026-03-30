import { useEffect, useRef } from "react"

export function useWebRtc(socket) {

    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    }

    const pcRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const remoteStreamRef = useRef(null)
    
    useEffect(() => {
        pcRef.current = new RTCPeerConnection(config)

        pcRef.current.onicecandidate = (e) => {
            console.log('ice')
            if (e.candidate && socket) {
                socket.emit('ice-candidate', e.candidate)
            }
        }

        pcRef.current.ontrack = (e) => {
            console.log('track', e.track)

            if(!remoteStreamRef.current) {
                remoteStreamRef.current = new MediaStream()
            }
            remoteStreamRef.current.addTrack(e.track)
            if(remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStreamRef.current
            }
        }

        return () => {
            if (pcRef.current) {
                pcRef.current.close()
            }
        }
    }, [socket])

    const getOffer = async () => {
        try {
            const offer = await pcRef.current.createOffer()
            console.log("Offer", offer)
            await pcRef.current.setLocalDescription(offer)
            return offer
        } catch (error) {
            console.log("Error", error)        
            return null  
        }

    }

    const setOffer = async (offer) => {
        if (!pcRef.current) return
        try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer))
            console.log("Set offer", offer)
        } catch (error) {
            console.log('Error', error)
        }
    }

    const getAnswer = async (offer, localStream) => {
        if (!pcRef.current) return
        console.log("local stream ", localStream.current);
        
        if(!localStream?.current) {
            console.log("bad local stream ", localStream.current)
            return
        }
        try {
            localStream.current.getTracks().forEach(track => {
                pcRef.current.addTrack(track, localStream.current)
            })
            
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer))
    
            const answer = await pcRef.current.createAnswer()
            await pcRef.current.setLocalDescription(answer)
    
            console.log('answer created')
    
            return answer
        } catch (error) {
            console.log('Error', error)
        }
    }

    const setAnswer = async (answer) => {
        if (!pcRef.current) return
        try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
            console.log("Answer set");
        } catch (error) {
            console.log('Error', error)
        }
    }



    const addCandidate = async (candidate) => {
        if (!pcRef.current) return
        
        try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
            console.log("candidate")
        } catch (error) {
            console.log('Error', error)
        }
    }

    return {
        addCandidate,
        getOffer,
        setOffer,
        getAnswer,
        setAnswer,
        remoteVideoRef
    }
}
