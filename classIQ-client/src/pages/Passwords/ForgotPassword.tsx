import { useState } from "react";
import { forgotPassword } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      setMessage(`${res.data.message} Reset token: ${res.data.resetToken}`);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Token</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
