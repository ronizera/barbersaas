import { getBarberShopsAction, getMyBookingsAction } from "@/src/actions/booking";
import CustomerDashboard from "./CustomerDashboard"

export default async function DashboardPage() {
    const [barberShops, bookings] = await Promise.all([
        getBarberShopsAction(),
        getMyBookingsAction(),
    ])

    return <CustomerDashboard barberShops={barberShops} bookings={bookings} />
}