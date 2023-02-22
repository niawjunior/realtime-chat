import React, { useState, useEffect } from "react";
import classNames from "classnames";
import ChatLogin from "./ChatLogin";

function ChatBox({ socket }) {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    function handleChatMessage(data) {
      console.log("chat-message");
      setMessages((prevMessages) => [...prevMessages, data]);
    }

    function handleUserJoined(data) {
      console.log(`user-joined ${data.name} ${data.id}`);
      console.log("get all messages");

      setMessages(data.messages);
      setIsJoined(true);
    }

    function handleUpdateMessages(data) {
      setMessages(data);
    }

    function handleRejectUser(data) {
      alert("There is already a user with this name");
    }

    socket.on("user-joined", handleUserJoined);
    socket.on("chat-message", handleChatMessage);
    socket.on("update-messages", handleUpdateMessages);
    socket.on("user-reject", handleRejectUser);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("chat-message", handleChatMessage);
      socket.off("update-messages", handleUpdateMessages);
      socket.off("user-reject", handleRejectUser);
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const input = event.target.elements["message"];
    const message = input.value;
    if (!message) {
      return;
    }
    // Send a "chat-message" event to the server with the user's name and message

    const data = { id, name, message };
    socket.emit("chat-message", data);
    input.value = "";

    // Clear the input field
  }

  function handleLeave() {
    console.log("leave");
    socket.emit("leave", { id, name });
    setIsJoined(false);
  }

  function handleSubmitUserName(event) {
    setName(event.target[0]?.value);
    setId(event.target[0]?.value);
    event.preventDefault();
    if (!event.target[0]?.value) {
      alert("Please enter your name");
      return;
    }

    console.log("handleSubmitUserName");
    // Send a "join" message to the server with the user's name
    socket.emit("join", {
      id: event.target[0]?.value,
      name: event.target[0]?.value,
    });
    // Update the component state to indicate that the user has joined the chat
  }
  return !isJoined ? (
    <div className="min-w-full flex justify-center">
      <ChatLogin handleSubmit={handleSubmitUserName} />
    </div>
  ) : (
    <div className="flex flex-col h-screen w-full">
      <div className="flex bg-gray-800 text-white p-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chat Box</h1>
          <p>Welcome, {name}!</p>
        </div>
        <button
          className=" py-2 px-4 rounded bg-red-500 hover:bg-red-600"
          onClick={handleLeave}
        >
          Leave
        </button>
      </div>

      <div className="flex-1 py-4 px-10 overflow-y-scroll">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={classNames("flex", "mb-2", "message-bg", {
              "items-center": id !== message.id,
              "right-message": id === message.id,
            })}
          >
            <div className="flex-shrink-0">
              <span className="message-name h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center font-bold text-white">
                {message?.name?.substring(0, 2)}
              </span>
            </div>
            <div className="ml-3 message-text">
              <p>{message?.message}</p>
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
