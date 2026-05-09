import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-base-100 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            NoteForge
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <span className="hidden max-w-40 truncate text-sm text-base-content/70 sm:inline">
                {user.name}
              </span>
            )}
            <Link to="/create" className="btn btn-primary flex items-center gap-2">
              <Plus className="size-5" />
              <span className="hidden sm:inline">New Note</span>
            </Link>
            <button className="btn btn-ghost btn-square" onClick={handleLogout} title="Logout">
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
