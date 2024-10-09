import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate, faMicrophoneSlash, faPhoneVolume, faMobile } from "@fortawesome/free-solid-svg-icons";
import Peer from "peerjs";
import { io } from "socket.io-client";

export default function Home() {
    let socket = io("http://localhost:8080/", { transport: ["polling"] });

    let [freinds, setfreinds] = useState([]);
    let remotererf = useRef(null);
    let videoRef = useRef(null);
    let videstreamref = useRef(null);
    let muteref = useRef(null);
    let frontref = useRef(null);
    let [isonline, setisonline] = useState(false);
    let [peer, setpeer] = useState(null);
    let [ismuted, setismutedd] = useState(true);
    let [call, setcall] = useState(null);
    let [idd, setiddd] = useState('');
    let s;
    let op = {
        audio: true,
        video: {
            facingMode: "user"
        }
    }

    function isOnline() {
        if (navigator.onLine) {
            setisonline(true);
        } else {
            setisonline(false);
            alert("Check Your Internet Connection!");
        }
    }

    async function stopstream() {
        try {
            if (s) {
                s.getTracks().forEach((track) => track.stop());
            }
            s = await navigator.mediaDevices.getUserMedia(op);
            videoRef.current.srcObject = s;
            videoRef.current.autoplay = true;
        } catch (er) {
            console.log(er);
        }
    }

    function backCam() {
        op.video.facingMode = "environment";
        stopstream();
    }

    function frontcam() {
        op.video.facingMode = "user";
        stopstream();
    }

    useEffect(() => {
        let peerInstance = new Peer();
        peerInstance.on('open', (id) => {
            socket.emit("peerId", id);
            setpeer(peerInstance); // Set peer instance only after it's successfully initialized
        });
        console.log(peerInstance)

        // Update friends list when peerId is received
        socket.on("peerId", ({ peerId, id }) => {
            setiddd(peerId);
            setfreinds(prevFriends => {
                return prevFriends.map(friend => {
                    if (friend.socketId === id) {
                        return { ...friend, peerId: peerId, online: true };
                    }
                    return friend;
                });
            });
        });

        // Handle incoming call requests
        socket.on("recivecall", ({ callerId, calleeId, name }) => {
            if (peerInstance.id === calleeId) {
                let accept = window.confirm(`You have an incoming call from ${name}. Do you want to accept?`);
                if (accept) {
                    socket.emit('callAccepted', { callerId, calleeId });
                } else {
                    alert("Call rejected!");
                }
            }
        });

        // Call handling logic, move outside of `recivecall` to avoid multiple listeners
        peerInstance.on('call', (incomingCall) => {
            if (videoRef.current && videoRef.current.srcObject) {
                incomingCall.answer(videoRef.current.srcObject); // Answer the call with the local stream
                incomingCall.on('stream', (remoteStream) => {
                    if (remotererf.current) {
                        remotererf.current.srcObject = remoteStream;
                        remotererf.current.autoplay = true;
                    }
                });
                setcall(incomingCall);
            }
        });

        // Fetch friends list
        fetch("http://localhost:8080/dost")
            .then((res) => res.json())
            .then((data) => {
                const myId = JSON.parse(window.localStorage.getItem("Data"))._id;
                setfreinds(data.filter((friend) => friend._id !== myId));
            });

        // Set up local video stream
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(op).then((stream) => {
                s = stream;
                videoRef.current.srcObject = stream;
                videoRef.current.autoplay = true;
                videstreamref.current = stream;
            }).catch((err) => {
                console.log("Error accessing media devices.", err);
            });
        } else {
            alert("Your browser doesn't support media streaming!");
        }

        isOnline();

    }, []);

    // Hang up logic
    let hangUp = () => {
        if (call) {
            call.close();
            setcall(null);
            alert(`You have ended the call!`);
            window.location.reload(true);
        } else {
            alert("There is no call to hang up.");
        }
    };

    // Call a friend
    const calll = useCallback((friendId, name) => {
        if (!peer || !peer.id) {
            alert("Peer connection is not ready yet.");
            console.log("Error: Peer not initialized.");
            return;
        }

        if (!friendId) {
            alert("Friend's peer ID is missing Try again .");
            console.log("Error: Friend's peer ID is undefined.");
            return;
        }
        console.log(friendId);
        socket.emit("reqCall", { callerId: peer.id, calleeId: friendId, name: name });

        if (peer && videoRef.current && videoRef.current.srcObject) {
            let localStream = videoRef.current.srcObject;
            let newCall = peer.call(friendId, localStream);
            newCall.on("stream", (remoteStream) => {
                if (remotererf.current) {
                    remotererf.current.srcObject = remoteStream;
                    remotererf.current.autoplay = true;
                }
            });
            setcall(newCall);
        } else {
            console.log("Error: Peer not initialized or video stream unavailable.");
            alert("Check your internet connection!");
        }
    }, [peer]);

    // Mute/unmute audio
    function mute() {
        if (videstreamref.current) {
            let audioTrack = videstreamref.current.getAudioTracks();
            audioTrack.forEach((track) => {
                track.enabled = !track.enabled;
                muteref.current.style.background = track.enabled ? "none" : "red";
            });
            setismutedd(audioTrack[0].enabled);
        }
    }

    return (
        <>
            <div className="d-flex">
                <div style={{ height: "90vh", width: "25%" }} className="mx-3 my-3 mb-3 border">
                    <h5 className="mx-3 my-3 text-center">Friends</h5>
                    <hr />
                    {freinds.map((el) => {
                        return (
                            <div key={el._id}>
                                <p className="mx-2 my-3 text-center">{el.username}</p>
                                <button className="text-center d-flex mx-auto btn btn-primary" onClick={() => calll(idd, el.username)}>Call</button>
                                {!el.peerId ? (
                                    <p className="text-center text-success my-2">Online</p>
                                ) : (
                                    <p className="text-center text-danger my-2">Offline</p>
                                )}
                                <hr />
                            </div>
                        );
                    })}
                </div>
                <div style={{ height: "110vh", width: "100%" }} className="border mx-3">
                    <video ref={remotererf} className="border d-flex mx-auto my-3" width={"300px"} height={"350px"}></video>
                    <div className="d-flex" style={{ justifyContent: 'center' }}>
                        <video ref={videoRef} className="border" width={"150px"} height={"190px"}></video>
                    </div>
                    <div style={{ justifyContent: "space-around" }} className="my-3 text-center d-flex">
                        <FontAwesomeIcon ref={muteref} onClick={mute} style={{ fontSize: '30px' }} icon={faMicrophoneSlash} />
                        <FontAwesomeIcon onClick={frontcam} style={{ fontSize: '30px' }} icon={faCameraRotate} />
                        <FontAwesomeIcon ref={frontref} onClick={backCam} style={{ fontSize: '30px' }} icon={faMobile} />
                        <FontAwesomeIcon onClick={hangUp} style={{ fontSize: '26px' }} className="text-danger" icon={faPhoneVolume} />
                    </div>
                </div>
            </div>
        </>
    );
}
