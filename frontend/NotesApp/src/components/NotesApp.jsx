import React, { useState, useEffect } from "react";
import axios from "axios";

const colors = ["bg-[#E8BCB9]", "bg-[#AE445A]", "bg-[#4B4376]", "bg-[#CB6040]", "bg-[#FD8B51]", "bg-[#A0C878]","bg-[#626F47]","bg-[#780C28]","bg-[#16404D]","bg-[#497D74]","bg-[#734444]","bg-[#8ABFA3]","bg-[#3E7B27]"];

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/update-notes/${editing}`, { title, content });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-notes`, { title, content });
      }
      setTitle("");
      setContent("");
      setEditing(null);
      fetchNotes();
      setActiveTab("all");
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete-notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(note._id);
    setActiveTab("create");
  };

  return (
    <div className="p-6  min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-[#1B1F3B]">ExpressNote⚡</h1>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md border border-[#007BFF] transition ${activeTab === "all" ? "bg-[#007BFF] text-white" : "bg-white text-[#007BFF] "}`}
        >
          All Notes
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-md border border-[#007BFF] transition ${activeTab === "create" ? "bg-[#007BFF] text-white" : "bg-white text-[#007BFF] "}`}
        >
          {editing ? "Edit Note" : "Create Note"}
        </button>
      </div>

      {/* Create/Edit Note Form */}
      {activeTab === "create" && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
          <input
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="w-full py-2 bg-[#AE445A] text-white rounded-md hover:bg-[#CB6040] transition"
          >
            {editing ? "Update Note" : "Add Note"}
          </button>
        </div>
      )}

      {/* Display All Notes */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full max-w-5xl">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div key={note._id} className={`p-4 rounded-lg shadow-lg ${colors[index % colors.length]}`}>
                <h2 className="text-xl font-semibold text-white">{note.title}</h2>
                <p className="text-white mt-2">{note.content}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-white text-[#AE445A] px-3 py-1 rounded-md hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-white text-[#CB6040] px-3 py-1 rounded-md hover:bg-gray-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No notes available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesApp;