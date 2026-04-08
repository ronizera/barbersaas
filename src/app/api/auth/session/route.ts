import { prisma } from "@/src/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) return NextResponse.json(null)

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: { barberShops: true }, // ← faltava isso
      },
    },
  })

  if (!session || session.expiresAt < new Date()) return NextResponse.json(null)

  return NextResponse.json({
    role: session.user.role,
    hasBarberShop: session.user.barberShops.length > 0, // ← typo corrigido
  })
}