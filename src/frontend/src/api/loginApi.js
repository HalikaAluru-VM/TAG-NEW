export const login = async (username, password) => {
  const response = await fetch(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error logging in.");
  return data;
};