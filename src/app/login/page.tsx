"use client";

import { loginAction } from "@/src/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-950 p-4">
      <div className="w-full max-w-[420] space-y-6 border border-zinc-800 p-8 rounded-2xl bg-zinc-900/50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-100">
            Bem-vindo de volta
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Entre em sua conta para continuar
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-zinc-400">E-mail</label>
            <input
              name="email"
              type="email"
              placeholder="joao@email.com"
              required
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-400">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:bg-white transition-color disabled:opacity-50 mt-1">{loading ? "Entrando..." : "Entrar"}</button>
        </form>

        <p className="text-center text-sm text-zinc-500"> Não tem conta?{" "}
          <Link href="/register" className="text-zinc-300 hover:text-white transition-colors">
            Cadastre-se
          </Link></p>
      </div>
    </main>
  );
}
