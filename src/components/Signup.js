import React, { useState } from "react";
import AuthCard from "./AuthCard";
import GaneshMascot from "./GaneshMascot";
import { supabase } from "../supabaseClient";
import { ReactComponent as GoogleIcon } from "../assets/google.svg";

function formatPhoneInput(value) {
  value = value.replace(/[^\d+]/g, "");
  if (!value.startsWith("+91")) {
    value = "+91" + value.replace(/^\+?91?/, "");
  }
  value = "+91" + value.slice(3).replace(/\D/g, "").slice(0, 10);
  return value;
}
function isPhoneNumber(input) {
  return /^\+91\d{10}$/.test(input);
}

export default function Signup() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleIdentifierChange = (e) => {
    let value = e.target.value.trim();
    if (/^\d|^\+/.test(value)) {
      value = formatPhoneInput(value);
    }
    setIdentifier(value);
    setIsPhone(isPhoneNumber(value));
    setIsOtpSent(false);
    setOtp("");
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: identifier,
      password,
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Signup successful! Please check your email for verification link.");
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: identifier });
    setLoading(false);
    if (error) alert(error.message);
    else setIsOtpSent(true);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: identifier,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Signup successful! You can now login with your phone number.");
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8E1] via-[#FFE0B2] to-[#FFD700] overflow-hidden px-2">
      {/* Background flowers */}
      <img
        src="/flower-top-left.svg"
        alt=""
        className="absolute top-0 left-0 w-32 opacity-60 z-0 pointer-events-none select-none"
        aria-hidden="true"
      />
      <img
        src="/flower-bottom-right.svg"
        alt=""
        className="absolute bottom-0 right-0 w-40 opacity-60 z-0 pointer-events-none select-none"
        aria-hidden="true"
      />
      {/* Main Content */}
      <GaneshMascot />
      <h1
        className="text-4xl font-extrabold mb-8 tracking-wider text-center z-10"
        style={{
          color: "#E65100",
          fontWeight: 900,
          letterSpacing: "0.08em",
          fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
          textShadow: "0 2px 12px #fff8e1, 0 4px 24px #e65100",
          animation: "popIn 1.2s cubic-bezier(0.4,0,0.2,1) both"
        }}
      >
        TEAM MAHODARA
      </h1>
      {/* Add this to your global CSS or inside a <style> tag:
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.7) translateY(-30px);}
        60% { opacity: 1; transform: scale(1.1) translateY(8px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      */}
      <AuthCard>
        <form
          className="w-full"
          onSubmit={isPhone ? (isOtpSent ? verifyOtp : sendOtp) : handleEmailSignup}
        >
          <input
            type="text"
            placeholder="Email or Phone Number"
            className="block w-full mb-4 px-4 py-3 rounded-xl bg-[#FFF8E1] text-[#E65100] placeholder-[#FFA500] border-2 border-yellow-400 focus:ring-2 focus:ring-[#FFA500] text-lg transition-all duration-300"
            value={identifier}
            onChange={handleIdentifierChange}
            required
          />
          {isPhone ? (
            isOtpSent ? (
              <input
                type="text"
                placeholder="Enter OTP"
                className="block w-full mb-4 px-4 py-3 rounded-xl bg-[#FFF8E1] text-[#E65100] placeholder-[#FFA500] border-2 border-yellow-400 focus:ring-2 focus:ring-[#FFA500] text-lg transition-all duration-300"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            ) : null
          ) : (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="block w-full mb-4 px-4 py-3 rounded-xl bg-[#FFF8E1] text-[#E65100] placeholder-[#FFA500] border-2 border-yellow-400 focus:ring-2 focus:ring-[#FFA500] text-lg transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#E65100] text-lg focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full mb-4 py-3 rounded-xl bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-[#2D0900] font-bold text-lg shadow-lg hover:from-[#FFD700] hover:to-[#FFA500] transition-transform duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isPhone
              ? isOtpSent
                ? "Verify OTP"
                : "Send OTP"
              : "Sign Up"}
          </button>
        </form>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full mb-2 py-3 rounded-xl bg-white text-[#2D0900] font-bold text-lg shadow-lg flex items-center justify-center hover:bg-[#FFD700] transition-transform duration-300 hover:scale-105"
        >
          <GoogleIcon className="w-6 h-6 mr-2" />
          Sign up with Google
        </button>
        <div className="text-center mt-4">
          <a
            href="/login"
            className="text-[#E65100] font-semibold underline text-base"
          >
            Already have an account? Login
          </a>
        </div>
      </AuthCard>
    </div>
  );
}
