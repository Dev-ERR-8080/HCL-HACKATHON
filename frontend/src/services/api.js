export const loginUser = async (credentials) => {
  console.log("Mock login for", credentials);
  return { id: 1, name: "Test User" };
};

export const registerUser = async (data) => {
  console.log("Mock register for", data);
  return { id: 1, name: data.name };
};

export const fetchHotels = async () => {
  console.log("Mock fetch hotels");
  return [];
};
