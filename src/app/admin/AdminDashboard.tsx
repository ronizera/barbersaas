"use client"

import { useState } from "react"
import {createServiceAction, deleteServiceAction, updateBookingStatusAction} from "@/src/actions/barbershop"
import { logoutAction } from "@/src/actions/auth"
import { BookingStatus } from "@/src/generated/prisma"

type Service = {
    id: string
    name: string
    price: number
    duration: number
    description: string | null
}

type Booking = {
    id: string
    date: string
    status: string
    user: {name: string; email: string}
    service: {name: string; price: number}
}

type BarberShop = {
    id: string
    name: string
    address: string
    services: Service[]
    bookings: Booking[]
}

export default function AdminDashboard({barberShop} : {barberShop: BarberShop}) {
    const [tab, setTab] = useState<"bookings" | "services">("bookings")
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleCreateService(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await createServiceAction(formData)
        if(result?.error) setError(result.error)
        else setShowForm(false)
    setLoading(false)
    }

     const statusLabel: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    COMPLETED: "Concluído",
  }

  const statusColor: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    CONFIRMED: "text-green-400 bg-green-400/10 border-green-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
    COMPLETED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  }



   return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{barberShop.name}</h1>
          <p className="text-zinc-500 text-sm">{barberShop.address}</p>
        </div>
        <button onClick={() => logoutAction()}
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
          Sair
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          {(["bookings", "services"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-zinc-100 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}>
              {t === "bookings" ? "Agendamentos" : "Serviços"}
            </button>
          ))}
        </div>

        {/* Agendamentos */}
        {tab === "bookings" && (
          <div className="space-y-3">
            {barberShop.bookings.length === 0 && (
              <p className="text-zinc-500 text-sm">Nenhum agendamento ainda.</p>
            )}
            {barberShop.bookings.map((booking) => (
              <div key={booking.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div>
                  <p className="font-medium text-sm">{booking.user.name}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {booking.service.name} •{" "}
                    {new Date(booking.date).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-md border ${statusColor[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                  <select
                    defaultValue={booking.status}
                    onChange={(e) => updateBookingStatusAction(booking.id, e.target.value as BookingStatus)}
                    className="text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-300">
                    <option value="PENDING">Pendente</option>
                    <option value="CONFIRMED">Confirmar</option>
                    <option value="CANCELLED">Cancelar</option>
                    <option value="COMPLETED">Concluir</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Serviços */}
        {tab === "services" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowForm(!showForm)}
                className="text-sm px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors">
                {showForm ? "Cancelar" : "+ Novo serviço"}
              </button>
            </div>

            {showForm && (
              <form action={handleCreateService}
                className="p-4 rounded-xl border border-zinc-700 bg-zinc-900 space-y-3">
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs text-zinc-400">Nome</label>
                    <input name="name" required placeholder="Corte simples"
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Preço (R$)</label>
                    <input name="price" type="number" step="0.01" required placeholder="35.00"
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Duração (min)</label>
                    <input name="duration" type="number" required placeholder="30"
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs text-zinc-400">Descrição <span className="text-zinc-600">(opcional)</span></label>
                    <input name="description" placeholder="Corte na tesoura ou máquina"
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-zinc-100 text-zinc-900 py-2.5 rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50">
                  {loading ? "Salvando..." : "Salvar serviço"}
                </button>
              </form>
            )}

            {barberShop.services.length === 0 && !showForm && (
              <p className="text-zinc-500 text-sm">Nenhum serviço cadastrado.</p>
            )}

            {barberShop.services.map((service) => (
              <div key={service.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {service.duration} min • R$ {Number(service.price).toFixed(2)}
                  </p>
                  {service.description && (
                    <p className="text-zinc-500 text-xs mt-0.5">{service.description}</p>
                  )}
                </div>
                <button onClick={() => deleteServiceAction(service.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}