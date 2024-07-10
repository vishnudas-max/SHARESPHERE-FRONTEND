import React, { useContext, useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { REACT_APP_APP_ID, REACT_APP_SERVER_SECRET } from '../../../secrets';
import { useNavigate } from 'react-router-dom';
import { CallContext } from '../../../Contexts/CallSocketProvider';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const generateRandomRoomID = () => {
    return Math.random().toString(36).substring(7); // Generate a random string
};

function VideoCall() {
    const roomID = "sharesphere"
    const videoContainerRef = useRef(null);
    const navigate = useNavigate();
    const { ws } = useContext(CallContext)
    const { username } = useParams()

    const appID = REACT_APP_APP_ID;
    const serverSecret = REACT_APP_SERVER_SECRET;

    useEffect(() => {
        if (!videoContainerRef.current) return;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "vishnu");
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
            container: videoContainerRef.current,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call
            },
            showPreJoinView: false,
            showLeaveRoomConfirmDialog: false,
            onLeaveRoom: () => {
                zp.destroy();
                navigate(-1,{ replace: true });
            }
        });

        if (ws) {
            // sending call invitations to targetUser--
            const message = {
                type: 'call_message',
                roomID: roomID,
                targetUser: username,
            };
            ws.send(JSON.stringify(message));

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Message received:', message);
            };

        }


        return () => {
            zp.destroy();
        };
    }, [appID, serverSecret, roomID, navigate]);




    const joinRoomURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID;
    console.log(joinRoomURL)
    return (
        <div
            ref={videoContainerRef}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}

export default VideoCall;
