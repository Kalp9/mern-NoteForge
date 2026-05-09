import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start a secure NoteForge workspace in less than a minute."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="input input-bordered w-full"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

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
            autoComplete="new-password"
            className="input input-bordered w-full"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
          <UserPlus className="size-5" />
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link className="link link-primary font-medium" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
