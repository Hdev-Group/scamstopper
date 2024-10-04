"use client"
import Header from "@/components/header/header"
import { useUser } from "@clerk/nextjs";
import Footer from '@/components/footer/footer';

export default function SupportPage(){
    const user = useUser();
    const userinfo = user?.user
    return (
        <>
            <Header />
            <main className="container mx-auto px-4">
                <h1>Hello {userinfo?.firstName}</h1>
            </main> 
            <Footer />
        </>
    )
}