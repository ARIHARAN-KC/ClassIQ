import { useState } from "react";
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
  const [form, setForm] = useState({ token: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await resetPassword(form);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input name="token" placeholder="Reset Token" value={form.token} onChange={handleChange} required />
        <input name="newPassword" type="password" placeholder="New Password" value={form.newPassword} onChange={handleChange} required />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}