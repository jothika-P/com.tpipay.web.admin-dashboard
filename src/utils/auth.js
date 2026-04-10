export const auth = {
  isLoggedIn: () => !!localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role"),
};