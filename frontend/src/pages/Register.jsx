import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import ErrorBanner from "../components/ErrorBanner";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      // Registration succeeded — sign the user straight in.
      await login({ email: form.email, password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Turn interview anxiety into interview confidence."
      subtitle="Upload your CV, pick an interviewer, and get instant, structured feedback."
    >
      <h2 className="text-2xl font-display font-semibold text-navy-950">Create your account</h2>
      <p className="mt-1 text-sm text-ink-600">
        Already have one?{" "}
        <Link to="/login" className="text-accent-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ErrorBanner message={error} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-900 mb-1.5">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-900 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-900 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
