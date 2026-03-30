import React, { useEffect, useState, useRef } from 'react'
import { useCamera } from "../../handler/useCamera"
import { useMicro } from '../../handler/useMicro'
import s from "./videoPage.module.css"
import { io } from "socket.io-client"
import { useWebRtc } from '../../handler/useWebRtc'

export function VideoPage() {
    
    // const [connected, setConnected] = useState(false)
    
    const socketRef = useRef(io("http://localhost:3002"))
    const socket = socketRef.current
    
    const {videoRef, startCamera, streamRef, cameraToggle} = useCamera()
    const {getOffer, setOffer, getAnswer, setAnswer, remoteVideoRef, addCandidate} = useWebRtc(socket)
    const roomId = 1 //TODO: Временное решение
    
    const [cameraStatus, setCameraStatus] = useState(false)
    
    useEffect(() => {
        const initCam = async () => {
            await startCamera()
            setCameraStatus(true)
            console.log("camera ok")
        }
        initCam()
    }, [])

    useEffect(() => {
        console.log("cam stat", cameraStatus)
        if(cameraStatus == false) return











        // if(!socket) {
        //     const socket = 
        //     setSocket(socket)
        // }
        console.log("socket", socket)
        socket.emit("join-room", 
        {
            roomId: roomId,
            id: socket.id
        })
    
        socket.on("user-joined", async function() {
            socket.emit("video-offer", 
                {
                    offer: await getOffer(),
                    roomId: roomId
                })
        })
    
        socket.on("user-offer", async function(data) {
            await setOffer(data.offer)
            console.log("Set offer");

            const answer = await getAnswer(data.offer, streamRef)
            console.log("Answer Created", answer)

            if( answer) {
                socket.emit("user-answer", answer)
            }
            else {
                console.log("answer bad");
            }
        })

        socket.on("user-set-answer", async function(answer) {
            await setAnswer(answer)
        })

        socket.on("candidate", async function(candidate) {
            await addCandidate(candidate)
        })

        return () => {
            socket.off("user-offer")
            socket.off("user-set-answer")
            socket.off("candidate")
            socket.off("user-joined")
        }

    }, [cameraStatus, streamRef.current, socket])

    const {microToggle} = useMicro(streamRef)
    const [isMuted, setIsMuted] = useState(false) 
    const [video, setVideo] = useState(false)

    const mutedHandler = () => {
        setIsMuted(!isMuted)
        microToggle()
    }

    const videoHandler = () => {
        setVideo(!video)
        cameraToggle()
    }


    return (

        <div className={s.videoPageMain}>
            <div>
                <video 
                    className={s.myVideo}
                    ref={videoRef} 
                    autoPlay
                    disablePictureInPicture
                    ></video>
                <video
                    ref={remoteVideoRef} 
                    className={s.remoteVideo}
                    disablePictureInPicture
                    autoPlay ></video>
            </div>
            {/* Блок кнопок */}
            <div className={s.buttonBlock}>
                {/* //TODO: Кнопки страшные - переделать */}
                <button 
                    onClick={mutedHandler}
                    style={{
                        backgroundColor: isMuted ? "#B5B8B1" : "#ff1827"
                    }}
                >
                        {isMuted ? "🔊" : "🔇"}</button>
                <button 
                    onClick={videoHandler}
                    style={{
                        backgroundColor: video ? "#ff1827" : "#B5B8B1"
                    }}
                >
                    {video ? "❌" : "🎥"}</button>
            </div>
        </div>
        
    )
} 