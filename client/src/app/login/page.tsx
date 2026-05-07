"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔧 임시 로그인 로직
    if (email === "test@test.com" && password === "1234") {
      router.push("/");
    } else {
      alert("이메일 또는 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="test@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Sign In
        </button>

        <p className="text-xs text-center text-gray-400">
          test@test.com / 1234
        </p>
      </form>
    </div>
  );
}
