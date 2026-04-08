"use server"

import bcrypt from "bcrypt"
import {prisma} from "@/src/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "@/src/lib/session"


export async function registerAction(formData: FormData) {
    
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if(!name || !email || !password)
        return{error: "Dados obrigatorios faltando"}

    const existing = await prisma.user.findUnique({where: {email} })
    if(existing) return {error: "Email já cadastrado"}

    const passwordHash = await bcrypt.hash(password, 10)

    const role = formData.get("role") as "ADMIN" | "CUSTOMER"

    await prisma.user.create({
        data: {name, email, passwordHash, role}
    })

    redirect("/login")
}


export async function loginAction(formData: FormData) {

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password)
        return {error: "Email e senha sao obrigatorios"}

    const user = await prisma.user.findUnique({where: {email} })

    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return{error: "Email ou senha invalidos"}

    const sessionId = await createSession(user.id)
    const cookieStore = await cookies()

    cookieStore.set("sessionId", sessionId, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
    })

    if (user.role === "ADMIN") {
        redirect("/admin")
    } else {
        redirect("/dashboard")
    }
    
}

export async function logoutAction() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if(sessionId) await deleteSession(sessionId)

    cookieStore.set("sessionId", "", {path: "/", maxAge: 0})
    redirect("/login")
}