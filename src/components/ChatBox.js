import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function ChatBox({ name, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [isLeft, setIsLeft] = useState(false);

  useEffect(() => {
    socket.on("chat-message", (data) => {
      // Add the new chat message to the component state
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user-left", (name) => {
      setMessages((messages) => [
        ...messages,
        { name: "", message: `${name} has left the chat.` },
      ]);
    });

    // Send a join event to the server with the user's name
    socket.emit("join", name);

    return () => {
      socket.emit("leave", name);
      socket.disconnect();
      setIsLeft(true);
    };
  }, [name]);

  function handleSubmit(event) {
    event.preventDefault();
    const input = event.target.elements["message"];
    const message = input.value;
    if (!message) {
      return;
    }
    // Send a "chat-message" event to the server with the user's name and message

    const data = { name, message };
    socket.emit("chat-message", data);

    // setMessages((messages) => [...messages, data]);

    input.value = "";

    // Clear the input field
  }

  function handleLeave() {
    socket.emit("leave", name);
    setIsLeft(true);
    onLeave();
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Chat Box</h1>
        <p>Welcome, {name}!</p>
      </div>
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="text-2xl font-bold">{name}'s Chat</div>
        <button
          className="py-2 px-4 rounded bg-red-500 hover:bg-red-600"
          onClick={handleLeave}
        >
          Leave
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-scroll">
        {messages.map((message, index) => (
          <div className="flex items-start mb-2" key={index}>
            <div className="flex-shrink-0">
              <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center font-bold text-white">
                {message.name.substring(0, 2)}
              </span>
            </div>
            <div className="ml-3">
              <p className="font-bold">{message.name}</p>
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="bg-gray-100 p-4" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <label htmlFor="message" className="sr-only">
            Enter a message:
          </label>
          <input
            required
            id="message"
            name="message"
            type="text"
            autoComplete="off"
            placeholder="Enter a message"
            className="flex-1 border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
