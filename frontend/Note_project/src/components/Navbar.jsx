import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

const Navbar = () => {
  return (
    <header className="bg-base-100 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <h1 className="text-2xl font-bold text-primary">
            NoteForge
          </h1>

          {/* Right side button */}
          <div className="flex items-center gap-4">
            <Link 
              to="/create" 
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="size-5" />
              <span>New Note</span>
            </Link>
          </div>

        </div>

      </div>
    </header>
  )
}

export default Navbar