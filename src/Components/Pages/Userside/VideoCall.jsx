import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { REACT_APP_APP_ID, REACT_APP_SERVER_SECRET } from '../../../secrets';
import { useNavigate } from 'react-router-dom';

function VideoCall() {
    const roomID = "sharesphere";
    const videoContainerRef = useRef(null);
    const navigate = useNavigate()

    const appID = REACT_APP_APP_ID;
    const serverSecret = REACT_APP_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "vishnu");

    // Create instance object from Kit Token.
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
        // onUserLeave: (users) => {
        //     // End the call when other participants leave
        //     if (users.length === 0) {
        //         zp.leaveRoom(); // Leave the room
        //         alert('The other participant has left the call.');
        //     }
        // }
        onLeaveRoom: () => {
            navigate('/home/message/');
        }


    });


    return (
        <div
            ref={videoContainerRef}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}

export default VideoCall;
