export const checkAdmin = async (email) => {
  const backendPort = process.env.REACT_APP_BACKEND_PORT || 8000; // Default to 8000 if not set
  const response = await fetch(`http://localhost:${backendPort}/api/auth/check-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error checking admin access.");
  return data;
};