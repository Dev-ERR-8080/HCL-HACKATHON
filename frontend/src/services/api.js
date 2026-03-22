const BASE_URL = "http://localhost:8080";

const apiFetch = async (endpoint, options = {}) => {
  options.credentials = "include";
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();
  if (!res.ok) throw new Error(data?.message || data || "Request failed");
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────
export const registerUser = async ({ name, email, password }) =>
    apiFetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });

export const loginUser = async ({ email, password }) => {
  await apiFetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  return email;
};

export const logoutUser = async () => apiFetch("/api/auth/logout", { method: "POST" });

export const forgotPassword = async (email) =>
    apiFetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, { method: "POST" });

export const verifyOtp = async (email, otp) =>
    apiFetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: "POST" });

export const resetPassword = async ({ email, otp, password }) =>
    apiFetch(`/api/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&password=${encodeURIComponent(password)}`, { method: "POST" });

// ─── Profile ──────────────────────────────────────────────────
export const saveProfile = async (profileData) =>
    apiFetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileData) });

export const getProfile = async () => apiFetch("/api/profile", { method: "GET" });

// ─── Hotels ───────────────────────────────────────────────────
export const searchHotels = async (searchParams) =>
    apiFetch("/api/hotels/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(searchParams) });

export const getHotelDetails = async (hotelId) =>
    apiFetch(`/api/hotels/${hotelId}`, { method: "GET" });

// ─── Bookings ─────────────────────────────────────────────────
export const checkAvailability = async ({ roomId, checkIn, checkOut }) =>
    apiFetch(`/api/bookings/check?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`, { method: "GET" });

export const createBooking = async ({ hotelId, roomId, checkIn, checkOut, baseAmount, couponCode }) => {
  let url = `/api/bookings/create?hotelId=${hotelId}&roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&baseAmount=${baseAmount}`;
  if (couponCode) url += `&couponCode=${encodeURIComponent(couponCode)}`;
  return apiFetch(url, { method: "POST" });
};

export const getMyBookings = async () => apiFetch("/api/bookings/my", { method: "GET" });

export const cancelBooking = async (bookingId) =>
    apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });

// ─── Coupons ──────────────────────────────────────────────────
// ✅ NEW: validate coupon code against booking amount
export const validateCoupon = async (code, amount) =>
    apiFetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&amount=${amount}`, { method: "GET" });