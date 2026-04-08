"use client"

import { useState } from "react"
import { createBookingAction, cancelBookingAction } from "@/src/actions/booking"
import { logoutAction } from "@/src/actions/auth"

type Service = { id: string; name: string; price: number; duration: number }
type BarberShop = { id: string; name: string; address: string; services: Service[] }
type Booking = {
  id: string
  date: string
  status: string
  service: { name: string; price: number }
  barberShop: { name: string }
}

export default function CustomerDashboard({
  barberShops,
  bookings,
}: {
  barberShops: BarberShop[]
  bookings: Booking[]
}) {
  const [tab, setTab] = useState<"booking" | "mybookings">("booking")
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleBooking(formData: FormData) {
    if (!selectedShop || !selectedService) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    formData.append("serviceId", selectedService.id)
    formData.append("barberShopId", selectedShop.id)
    const result = await createBookingAction(formData)
    if (result?.error) setError(result.error)
    else {
      setSuccess(true)
      setSelectedService(null)
    }
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
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Agendar horário</h1>
        <button onClick={() => logoutAction()}
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
          Sair
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          {(["booking", "mybookings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-zinc-100 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}>
              {t === "booking" ? "Nova reserva" : "Meus agendamentos"}
            </button>
          ))}
        </div>

        {/* Nova reserva */}
        {tab === "booking" && (
          <div className="space-y-6">
            {/* Escolher barbearia */}
            <div>
              <p className="text-sm text-zinc-400 mb-3">Escolha a barbearia</p>
              <div className="space-y-2">
                {barberShops.length === 0 && (
                  <p className="text-zinc-500 text-sm">Nenhuma barbearia disponível.</p>
                )}
                {barberShops.map((shop) => (
                  <button key={shop.id} onClick={() => {
                    setSelectedShop(shop)
                    setSelectedService(null)
                  }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedShop?.id === shop.id
                        ? "border-zinc-500 bg-zinc-800"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    }`}>
                    <p className="font-medium text-sm">{shop.name}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{shop.address}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Escolher serviço */}
            {selectedShop && (
              <div>
                <p className="text-sm text-zinc-400 mb-3">Escolha o serviço</p>
                <div className="space-y-2">
                  {selectedShop.services.map((service) => (
                    <button key={service.id} onClick={() => setSelectedService(service)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedService?.id === service.id
                          ? "border-zinc-500 bg-zinc-800"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-zinc-300 text-sm font-medium">
                          R$ {Number(service.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-zinc-400 text-xs mt-0.5">{service.duration} min</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Escolher data */}
            {selectedService && (
              <form action={handleBooking} className="space-y-4">
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                {success && (
                  <p className="text-green-400 text-sm">Agendamento realizado com sucesso!</p>
                )}
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">Data e horário</label>
                  <input name="date" type="datetime-local" required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50">
                  {loading ? "Agendando..." : `Agendar — ${selectedService.name}`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Meus agendamentos */}
        {tab === "mybookings" && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <p className="text-zinc-500 text-sm">Nenhum agendamento ainda.</p>
            )}
            {bookings.map((booking) => (
              <div key={booking.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div>
                  <p className="font-medium text-sm">{booking.service.name}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {booking.barberShop.name} •{" "}
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
                  {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
                    <button onClick={() => cancelBookingAction(booking.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}