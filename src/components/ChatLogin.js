import React, { useState } from "react";

function ChatLogin({ handleSubmit }) {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
    >
      <h1 className="text-2xl font-bold mb-4">Enter Your Name</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Join
        </button>
      </div>
    </form>
  );
}

export default ChatLogin;
