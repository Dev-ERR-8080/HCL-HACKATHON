const BASE_URL = "http://localhost:8080";

// ─── Auth APIs ────────────────────────────────────────────────

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.text();
  if (!res.ok) throw new Error(data || "Login failed");
  return data; // JWT token
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.text();
  if (!res.ok) throw new Error(data || "Registration failed");
  return data;
};

// Step 1: Send 6-digit OTP to email
export const forgotPassword = async (email) => {
  const res = await fetch(
      `${BASE_URL}/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
      { method: "POST" }
  );
  const data = await res.text();
  if (!res.ok) throw new Error(data || "Failed to send OTP");
  return data;
};

// Step 2: Verify OTP (unlocks password fields on success)
export const verifyOtp = async (email, otp) => {
  const res = await fetch(
      `${BASE_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      { method: "POST" }
  );
  const data = await res.text();
  if (!res.ok) throw new Error(data || "Invalid OTP");
  return data;
};

// Step 3: Reset password with verified OTP
export const resetPassword = async ({ email, otp, password }) => {
  const res = await fetch(
      `${BASE_URL}/api/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
  );
  const data = await res.text();
  if (!res.ok) throw new Error(data || "Password reset failed");
  return data;
};

// ─── Profile API ──────────────────────────────────────────────

export const saveProfile = async (token, profileData) => {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to save profile");
  return data;
};

// ─── Hotels API ───────────────────────────────────────────────

export const fetchHotels = async () => {
  console.log("Hotel service not yet connected");
  return [];
};