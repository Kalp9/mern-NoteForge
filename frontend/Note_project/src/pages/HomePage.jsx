import React from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Notecard from "../components/Notecard";
import NotesNotFound from "../components/NotesNotFound";

function HomePage() {
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");
        setNotes(response.data);

        setIsRateLimited(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("failed to fetch notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);
  return (
    <>
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      
      <div className = "max-w-4xl mx-auto p-4 mt-6">
        {loading && <div className = "text-center text-primary py-10">loading notes..</div>}
        {notes.length ==0 && !isRateLimited && <NotesNotFound/>}
         
         {notes.length>0 && !isRateLimited && (
          <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Notecard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
         )}
      </div>
    </>
  );
}

export default HomePage;
