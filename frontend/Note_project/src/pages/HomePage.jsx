import React from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Notecard from "../components/Notecard";
import NotesNotFound from "../components/NotesNotFound";
import { fetchNotes } from "../services/noteService";

function HomePage() {
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await fetchNotes();
        setNotes(notes);

        setIsRateLimited(false);
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
    loadNotes();
  }, []);
  return (
    <>
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      
      <div className = "max-w-4xl mx-auto p-4 mt-6">
        {loading && <div className = "text-center text-primary py-10">Loading notes...</div>}
        {notes.length === 0 && !loading && !isRateLimited && <NotesNotFound/>}
         
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
