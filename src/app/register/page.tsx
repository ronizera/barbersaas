"use client"

import { registerAction } from "@/src/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage(){
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<"ADMIN" | "CUSTOMER">("CUSTOMER")
    const [error, setError] = useState<string | null>(null)
   

    async function handleSubmit(formData:FormData) {
        setLoading(true)
        setError(null)
        formData.append("role", role)
        const result = await registerAction(formData)
        if(result?.error){
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-zinc-950 p-4">
            <div className="w-full max-w-105 space-y-6 border border-zinc-800 p-8 rounded-2xl bg-zinc-900/50">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-zinc-100">Crie sua conta</h1>
                    <p className="text-zinc-400 text-sm mt-1">comece gerenciar sua barbearia</p>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">{error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-400">Tipo de conta</label>
                        <div className="flex gap-2">
                            {(["ADMIN", "CUSTOMER"] as const).map((r) => (
                                <button key={r} type="button" onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg text-sm border transition-all ${role === r
                                    ? "border-zinc-500 bg-zinc-800 text-zinc-100 font-medium" : "border-zinc-700 text-zinc-400"
                                }`}>
                                    {r === "ADMIN" ? "Dono de barbearia" : "Cliente"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                            <label className="text-sm text-zinc-400">Nome completo</label>
                            <input  name="name" type="text" placeholder="Gustavo" required className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                          
                    <div>
                            <label className="text-sm text-zinc-400">Email</label>
                              <input  name="email" type="email" placeholder="gustavo@gmail.com" required className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                    <div>
                            <label className="text-sm text-zinc-400">Senha</label>
                              <input  name="password" type="password" placeholder="••••••••" required className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50 mt-1">{loading? "Criando conta..." : "Criar conta"}</button>
                </form>

                <p>Já tem conta?{" "}
                    <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">Entre aqui</Link>

                </p>
            </div>

        </main>
    )
}