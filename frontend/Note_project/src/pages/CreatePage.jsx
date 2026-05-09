import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import { createNote } from "../services/noteService";

function CreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("all fields are required");
      return;
    }
    setIsLoading(true);
    try {
        await createNote({ title, content });
        toast.success("Note created successfully");
        navigate('/');

    } catch (error) {
      console.error("error creating note", error);
      toast.error("Failed to create note");
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Note Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter note title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Note Content</span>
                  </label>
                  <textarea
                    placeholder="Enter note content"
                    className="textarea textarea-bordered"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isloading}
                  >
                    {isloading ? "creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
