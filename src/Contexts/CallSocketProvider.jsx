import React, { createContext, useState, useEffect } from 'react';

// Create a context for WebSocket
export const CallContext = createContext();

function CallSocketProvider({ children }) {

    const [ws, setWs] = useState(null);
    const access = localStorage.getItem('access')

    useEffect(() => {

        const callsocket =new WebSocket(`ws://127.0.0.1:8000/ws/call/?token=${access}`);
        callsocket.onopen = () => {
            console.log('WebSocket connected');
        };
        callsocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // Handle incoming messages from WebSocket
            console.log('Message received:', message);

        };

        callsocket.onclose = () => {
            console.log('WebSocket disconnected');
            // Optionally, you can attempt to reconnect here if needed
        };

        // Store WebSocket instance in state
        setWs(callsocket);

        // Cleanup function to close WebSocket on unmount
        return () => {
            if (callsocket) {
                callsocket.close();
                console.log('WebSocket disconnected on unmount');
            }
        };
    }, []);

    return (
        <CallContext.Provider value={{ ws }}>
            {children}
        </CallContext.Provider>
    );
}

export default CallSocketProvider;
