import { getBarberShopAction } from "@/src/actions/barbershop";
import {redirect} from "next/navigation"
import AdminDashboard from "./AdminDashboard"

export default async function AdminPage() {
    const barberShop = await getBarberShopAction()

    if(!barberShop) redirect("/admin/setup")

        return <AdminDashboard barberShop={barberShop} />
}
