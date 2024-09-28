"use client"
import { useUser } from '@clerk/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { useMutation, useQuery } from "convex/react";

export default function StaffReportsPage() {
    const { user } = useUser()

    const userId = user?.id;
    const isstaff = useQuery(api.isstaff.get, { userId: userId || '' })

    if (!userId || isstaff !== 'staff') {
        window.location.href = '/report-scam'
        return <div>Not authorized</div>
    }

    return (
        <div>
            <h1>Staff Reports</h1>
        </div>
    )
}
