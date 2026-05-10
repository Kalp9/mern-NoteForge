import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";
import { verifyPasswordResetOtp } from "../services/authService";

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.email.trim() || !formData.otp.trim()) {
      toast.error("Email and OTP are required");
      return;
    }

    if (!/^\d{6}$/.test(formData.otp.trim())) {
      toast.error("OTP must be a 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      await verifyPasswordResetOtp({
        email: formData.email,
        otp: formData.otp,
      });

      toast.success("OTP verified");
      navigate("/reset-password", {
        state: {
          email: formData.email.trim().toLowerCase(),
          otp: formData.otp.trim(),
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email."
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
          <label className="label" htmlFor="otp">
            <span className="label-text">OTP</span>
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="input input-bordered w-full tracking-widest"
            maxLength={6}
            placeholder="123456"
            value={formData.otp}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
          <ShieldCheck className="size-5" />
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        Need a new code?{" "}
        <Link className="link link-primary font-medium" to="/forgot-password">
          Request again
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyOTPPage;
