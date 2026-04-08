"use server"

import {prisma} from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

async function getCurrentUser() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value
    return getSession(sessionId)

}

export async function getBarberShopsAction() {
    return prisma.barberShop.findMany({
        include: {services: true},
        orderBy: {createdAt: "desc"},
    })
}

export async function createBookingAction(formData: FormData) {
    const user = await getCurrentUser()
    if(!user) return {error: "Nao autenticado"}

    const serviceId = formData.get("serviceId") as string
    const barberShopId = formData.get("barberShopId") as string
    const date = formData.get("date") as string

    if(!serviceId || !barberShopId || !date)
        return {error: "Dados obrigatorios faltando"}

    const bookingDate = new Date(date)
    if(bookingDate <= new Date())
        return {error: "Nao é possivel agendar no passado"}


    const conflict = await prisma.booking.findFirst({
        where: {barberShopId, date: bookingDate, status: {not: "CANCELLED"}}
    })
    if(conflict) return {error: "Horário já ocupado"}

    await prisma.booking.create({
        data: {userId: user.id, serviceId, barberShopId, date:bookingDate}
    })

    revalidatePath("/dashboard")
}


export async function getMyBookingsAction() {
    const user = await getCurrentUser()
    if(!user) return []

    return prisma.booking.findMany({
        where: { userId: user.id},
        include: {service: true, barberShop: true},
        orderBy: {date: "asc"},

    })
}

export async function cancelBookingAction(id: string) {
    const user = await getCurrentUser()
    if(!user) return {error: "Nao autenticado"}

    const booking = await prisma.booking.findFirst({
        where: {id, userId: user.id},
    })
    if(!booking) return {error: "Agendamento nao encontrado"}

    await prisma.booking.update({
        where: {id},
        data: {status: "CANCELLED"},
    })

    revalidatePath("/dashboard")
}