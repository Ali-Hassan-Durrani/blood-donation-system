import { api } from "./api";

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function register(data: {
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  city: string;
}) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}