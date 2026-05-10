import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";
import { requestPasswordResetOtp } from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestPasswordResetOtp(email);
      toast.success(response.message || "If the email exists, an OTP has been sent");
      navigate("/verify-otp", { state: { email: email.trim().toLowerCase() } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not request OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your account email and we will send a short-lived OTP."
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
          <Mail className="size-5" />
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        Remembered your password?{" "}
        <Link className="link link-primary font-medium" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
