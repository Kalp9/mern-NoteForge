import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!email || !otp) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      toast.error("Both password fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new password for your NoteForge account."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label" htmlFor="newPassword">
            <span className="label-text">New password</span>
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            className="input input-bordered w-full"
            placeholder="Create a new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="confirmPassword">
            <span className="label-text">Confirm password</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input input-bordered w-full"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
          <KeyRound className="size-5" />
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        Need another OTP?{" "}
        <Link className="link link-primary font-medium" to="/forgot-password">
          Request again
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
