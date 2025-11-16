"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/form/Button";

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call your authAPI.login
      const data = await authAPI.login(form);

      // Redirect based on role
      switch (data.user.role) {
        case "super_admin":
          router.push("/dashboard/super-admin");
          break;
        case "masjid_admin":
          router.push("/dashboard/masjid-admin");
          break;
        case "public":
          router.push("/"); // Public homepage
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err) {
      // Display server error
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button type="submit" className={loading ? "opacity-50" : ""}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
