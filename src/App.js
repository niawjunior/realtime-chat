import React, { useState } from "react";
import io from "socket.io-client";

import "./App.css";
import ChatBox from "./components/ChatBox";
const socket = io("http://localhost:3000");

function App() {
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!name) {
      alert("Please enter your name");
      return;
    }

    // Send a "join" message to the server with the user's name
    socket.emit("join", name);

    // Update the component state to indicate that the user has joined the chat
    setIsJoined(true);
  }

  function handleOnLeave() {
    setIsJoined(false);
  }

  return (
    <div className="flex items-center h-screen">
      <div className="flex justify-center min-w-full">
        {isJoined ? (
          <ChatBox name={name} onLeave={handleOnLeave} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
          >
            <h1 className="text-2xl font-bold mb-4">Enter Your Name</h1>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Join
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
