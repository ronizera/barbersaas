"use client"

import { createBarberShopAction } from "@/src/actions/barbershop"
import { useState } from "react"

export default function SetupPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await createBarberShopAction(formData)
        if(result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return(
        <main className="flex items-center justify-center min-h-screen bg-zinc-950 p-4">
            <div className="w-full max-w-120 border border-zinc-100">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-zinc-100">Configure sua barbearia</h1>
                    <p>Preencha os dados para começar</p>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-400">Nome da barbearia</label>
                        <input type="text" name="name" placeholder="Barbearia do roni" required
                        className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-400">Endereço</label>
                        <input type="text" name="address" placeholder="Rua das flores, 123" required className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-400">Telefone <span className="text-zinc-600">(Opcional)</span></label>
                        <input type="tel" name="phone" placeholder="(11) 99999-9999" className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50 mt-2">
                        {loading? "Criando..." : "Criar barbearia"}
                    </button>
                </form>
            </div>

        </main>
    )
}