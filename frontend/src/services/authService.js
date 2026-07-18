import API from "./api";

// Register
export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);

    // Remove old cached data from previous user
    localStorage.removeItem("selectedDocument");
    localStorage.removeItem("documents");
    localStorage.removeItem("dashboardStats");
    localStorage.removeItem("user");
  }

  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("selectedDocument");
  localStorage.removeItem("documents");
  localStorage.removeItem("dashboardStats");
  localStorage.removeItem("user");
};

// Get Token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check Login
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};