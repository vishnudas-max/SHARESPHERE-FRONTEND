import React, { createContext, useState } from 'react';

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [joinRoom, setJoinRoom] = useState(false);

    return (
        <RoomContext.Provider value={{ joinRoom, setJoinRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
