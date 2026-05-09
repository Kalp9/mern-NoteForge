import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      await login(formData);
      toast.success("Welcome back");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue building your private note library."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="input input-bordered w-full"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
          <LogIn className="size-5" />
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        New to NoteForge?{" "}
        <Link className="link link-primary font-medium" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
