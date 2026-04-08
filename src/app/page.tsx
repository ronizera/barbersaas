import { cookies } from "next/headers"
import { getSession } from "@/src/lib/session"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  const user = await getSession(sessionId)

  if (!user) redirect("/login")

  if (user.role === "ADMIN") redirect("/admin")

  redirect("/dashboard")
}