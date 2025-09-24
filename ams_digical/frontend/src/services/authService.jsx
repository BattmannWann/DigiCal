const BASE_URL = "http://localhost:8000"; // Adjust for deployment

export const loginWithMicrosoft = () => {
  window.location.href = `${BASE_URL}/oauth2/login/`;
};

export const logoutUser = async () => {
  await fetch(`${BASE_URL}/logout/`, { method: "POST", credentials: "include" });
  localStorage.removeItem("user");
};
