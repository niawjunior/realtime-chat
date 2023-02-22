import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
import ChatBox from "./components/ChatBox";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    newSocket.on("connect", () => {
      console.log("connect");
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      if (err.message === "xhr poll error") {
        setSocket(null);
      }
    });

    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="flex items-center h-screen">
      <div className="flex justify-center w-full">
        {socket ? <ChatBox socket={socket} /> : <div>Not Connected</div>}
      </div>
    </div>
  );
}

export default App;
