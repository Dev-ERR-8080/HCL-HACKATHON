const BASE_URL = "http://localhost:8080";

// ✅ All requests include credentials: "include" so the browser sends the JWT cookie
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

// ─── Auth APIs ────────────────────────────────────────────────

export const registerUser = async ({ name, email, password }) => {
  // ✅ FIXED: was "/auth/register" — must match controller @RequestMapping("/api/auth")
  return apiFetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};

// ✅ FIXED: login no longer returns a JWT string — backend sets an HttpOnly cookie.
//    Returns the user's email so AuthContext can set display state.
export const loginUser = async ({ email, password }) => {
  await apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return email; // pass email back to AuthContext.login()
};

// ✅ ADDED: called by AuthContext.logout() to clear the server-side cookie
export const logoutUser = async () => {
  return apiFetch("/api/auth/logout", { method: "POST" });
};

export const forgotPassword = async (email) => {
  return apiFetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });
};

export const verifyOtp = async (email, otp) => {
  return apiFetch(
      `/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      { method: "POST" }
  );
};

export const resetPassword = async ({ email, otp, password }) => {
  return apiFetch(
      `/api/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
  );
};

// ─── Profile API ──────────────────────────────────────────────

// ✅ FIXED: endpoint was "/profile" — must match controller "/api/profile"
export const saveProfile = async (profileData) => {
  return apiFetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
};

export const getProfile = async () => {
  return apiFetch("/api/profile", { method: "GET" });
};

// ─── Hotels API ───────────────────────────────────────────────

// ✅ FIXED: was GET with query string — HotelController uses POST /api/hotels/search with a body
export const searchHotels = async (searchParams) => {
  return apiFetch("/api/hotels/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchParams),
  });
};

export const getHotelDetails = async (hotelId) => {
  return apiFetch(`/api/hotels/${hotelId}`, { method: "GET" });
};

// ─── Booking API ──────────────────────────────────────────────

export const checkAvailability = async ({ roomId, checkIn, checkOut }) => {
  return apiFetch(
      `/api/bookings/check?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`,
      { method: "GET" }
  );
};

// ✅ userId is NOT sent from the frontend — the gateway extracts it from the JWT cookie
export const createBooking = async ({ hotelId, roomId, checkIn, checkOut, baseAmount }) => {
  return apiFetch(
      `/api/bookings/create?hotelId=${hotelId}&roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&baseAmount=${baseAmount}`,
      { method: "POST" }
  );
};

export const getMyBookings = async () => {
  return apiFetch("/api/bookings/my", { method: "GET" });
};

export const cancelBooking = async (bookingId) => {
  return apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
};