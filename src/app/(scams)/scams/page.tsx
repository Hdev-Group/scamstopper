import Header from '../../../components/header/header'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Footer from '../../../components/footer/footer'

export default function ScamsPage() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-primary">Latest Reported Scams</h1>
                    <p className='text-sm'>Below are the most recent scam reports submitted by users.</p>
                    <div className='flex flex-row flex-wrap gap-4 mt-4'>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
    }