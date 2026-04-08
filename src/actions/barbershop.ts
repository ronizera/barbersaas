"use server"

import {prisma} from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { cookies } from "next/headers"
import {redirect} from "next/navigation"
import { revalidatePath } from "next/cache"
import { BookingStatus } from "../generated/prisma"

async function getCurrentUser() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value
    return getSession(sessionId)
}

export async function createBarberShopAction(formData: FormData) {
    const user = await getCurrentUser()
    if(!user || user.role !== "ADMIN") return {error: "Nao autorizado"}

    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string

    if(!name || !address) return {error: "Nome e endereço são obrigatório"}

    const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

    const existing = await prisma.barberShop.create({
        data: {name, address, phone, slug, ownerId: user.id}
    })

    redirect("/admin")
}

export async function getBarberShopAction() {
    const user = await getCurrentUser()
    if (!user) return null

    return prisma.barberShop.findFirst({
        where: {ownerId: user.id},
        include: {
            services: true,
            bookings: {
                include: {user: true, service: true},
                orderBy: {date: "asc"}
            }
        }
    })
}

export async function createServiceAction(formData: FormData) {
    const user = await getCurrentUser()
    if(!user || user.role !== "ADMIN") return {error: "Nao autorizado"}
    const barberShop = await prisma.barberShop.findFirst({
        where: {ownerId: user.id},
    })
    if(!barberShop) return {error: "Barbearia nao encontrada"}

    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const duration = parseInt(formData.get("duration") as string)
    const description = formData.get("description") as string

    if(!name || isNaN(price) || isNaN(duration))
        return {error: "Dados inválidos"}

    await prisma.service.create({
        data: {name, price, duration, description, barberShopId: barberShop.id},
    })

    revalidatePath("/admin")
}

export async function deleteServiceAction(id: string) {
    const user = await getCurrentUser()
    if(!user || user.role !== "ADMIN") return {error: "Nao autorizado"}

    await prisma.service.delete({where: {id}})
    revalidatePath("/admin")
}

export async function updateBookingStatusAction(id: string, status: BookingStatus) {
    
    const user = await getCurrentUser()
    if(!user || user.role !== "ADMIN") return {error: "Nao autorizado"}

    await prisma.booking.update({where: {id}, data: {status}})
    revalidatePath("/admin")
}