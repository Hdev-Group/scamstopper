"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import Header from '../../components/header/header'
import { AlertCircle, CheckCircle, Shield, Phone, Zap, Globe, TrendingUp, Users, Mail, HandshakeIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import { motion, AnimatePresence } from "framer-motion"
import Footer from '../../components/footer/footer'

const scamSigns = {
  urgent: 'Claims of urgency (e.g., "Act now!")',
  tooGoodToBeTrue: 'Offers that seem too good to be true',
  personalInfo: 'Requests for personal or financial information',
  pressureTactics: 'Use of pressure tactics to make a quick decision',
  unverifiedSender: 'Messages from unverified or unknown senders',
  unusualPaymentMethods: 'Requests for payment via gift cards or wire transfers',
}

const stats = [
  { label: 'Reported Scams', value: '2.7M', icon: TrendingUp },
  { label: 'Money Lost', value: '£1.4T', icon: Zap },
  { label: 'People Affected', value: '5.4M', icon: Users },
  { label: 'Countries Impacted', value: '190+', icon: Globe },
]

interface ScamSigns {
  [key: string]: string
}
interface ScamCheckResult {
  detectedScams: string[]
}
interface ScamCheckToolProps {
  scamSigns: ScamSigns
  checkedSigns: Record<string, boolean>
  handleChange: (checked: boolean, key: string) => void
  handleSubmit: (event: React.FormEvent) => void
  scamCheckResult: string | null
}
interface ScamAvoidanceCardProps {
  icon: React.ElementType
  title: string
  content: string
}
interface ScamCategoryCardProps {
  icon: React.ElementType
  title: string
  content: string
}
interface StatisticsSectionProps {
  stats: { label: string, value: string, icon: React.ElementType }[]
}
interface ScamAwarenessProgressSectionProps {
  progress: number
}


export default function PageIndex() {
  const [checkedSigns, setCheckedSigns] = useState<Record<string, boolean>>({})
  const [scamCheckResult, setScamCheckResult] = useState<string | null>(null)
  const [progress, setProgress] = useState(19)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(12), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = useCallback((checked: boolean, key: string) => {
    setCheckedSigns(prev => ({ ...prev, [key]: checked }))
  }, [])

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    const detectedScams = Object.keys(checkedSigns).filter(key => checkedSigns[key])
    setScamCheckResult(detectedScams.length > 0 
      ? 'This is a red flag! You might be getting scammed.' 
      : 'Looks like you are safe!')
  }, [checkedSigns])

  return (
    <>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mt-10 lg:flex-row justify-between items-start gap-8"
        >
          <div className="flex flex-col gap-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary">
              Spread the message, <br />
              <span className="text-destructive">Let&apos;s end scams now.</span>
            </h1>
            <div className="flex flex-col gap-4 text-muted-foreground">
              <p className="text-lg sm:text-xl">
                Fraudsters, scammers, and cybercriminals are becoming increasingly smarter and more sophisticated.
              </p>
              <p className="text-base sm:text-lg">
                In <strong className="text-primary">2023</strong> alone, scams resulted in over <strong className="text-primary">£1.4 trillion</strong> in losses, with this figure expected to <strong className="text-primary">rise</strong>.
              </p>
              <p className="text-base sm:text-lg">
                More than <strong className="text-primary">5.4 million</strong> people across <strong className="text-primary">190+ countries</strong> were affected by scams in <strong className="text-primary">2023</strong>.
              </p>
              <p className="text-base sm:text-lg">
                We must <strong className="text-primary">raise awareness</strong> and <strong className="text-primary">educate</strong> people to prevent them from falling victim to scams.
              </p>
              <p className="text-base sm:text-lg">
                Join us in <strong className="text-primary">spreading the message</strong> and <strong className="text-primary">protecting</strong> others from falling victim.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href='/report-scam' className='w-full sm:w-auto'>
                <Button variant="default" size="lg" className="w-full md:w-[20rem]">Report a scam</Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Learn more</Button>
            </div>
          </div>
          <motion.img 
            src="/placeholder.svg?height=400&width=400" 
            alt="" 
            className="w-full max-w-md lg:max-w-lg xl:max-w-xl hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        <StatisticsSection stats={stats} />
        <HowToAvoidScamsSection />
        <PopularScamCategoriesSection />
        <ScamAwarenessProgressSection progress={progress} />
        <ScamCheckToolSection 
          scamSigns={scamSigns} 
          checkedSigns={checkedSigns} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          scamCheckResult={scamCheckResult} 
        />
      </main>
    </div>
    <Footer />
    </>
  )
}

function StatisticsSection({ stats }: StatisticsSectionProps) {
  return (
    <motion.section 
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-primary">Scam Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {<stat.icon className="h-5 w-5 text-primary" />}
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.section>
  )
}

function HowToAvoidScamsSection() {
  return (
    <motion.section 
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-primary">How to Avoid Scams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScamAvoidanceCard 
          icon={Mail} 
          title="Check Links & Emails"
          content="Always verify the sender's email address and hover over links before clicking. Look for subtle misspellings or unusual domains. If unsure, contact the supposed sender through a known, official channel."
        />
        <ScamAvoidanceCard 
          icon={Shield} 
          title="Protect Personal Information"
          content="Be cautious about sharing personal or financial information online or over the phone. Legitimate organizations won't ask for sensitive details via unsecured methods. Use strong, unique passwords for all accounts and enable two-factor authentication when possible."
        />
        <ScamAvoidanceCard 
          icon={Phone} 
          title="Be Wary of Unsolicited Contact"
          content="Be skeptical of unexpected calls, emails, or messages, especially those creating a sense of urgency. Scammers often impersonate trusted entities. If in doubt, hang up and call the organization directly using a number from their official website."
        />
      </div>
    </motion.section>
  )
}

function ScamAvoidanceCard({ icon: Icon, title, content }: ScamAvoidanceCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}

function PopularScamCategoriesSection() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-primary flex flex-row items-center gap-3">
        <TrendingUp className='h-5 w-5 text-primary' />
        Recently added scams
      </h2>
      <div className='flex flex-col md:flex-row justify-between gap-6'>
        <ScamCard 
          icon={Shield} 
          title="Steam Scams"
          content="Scammers are targeting Steam users with fake giveaways, fake staff, phishing links, and malware-infected downloads. Always verify the legitimacy of offers and avoid sharing personal information or clicking on suspicious links."
        />
      </div>
      <div className='items-center flex justify-center gap-4 mt-6'>
        <Link href='/scams' className='text-primary hover:underline'>
          <Button variant='default' size="lg" className="w-full sm:w-auto">View More Scam Categories</Button>
        </Link>
      </div>
    </motion.section>
  )
}

function ScamCard({ icon: Icon, title, content }: ScamCategoryCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}

function ScamAwarenessProgressSection({ progress }: ScamAwarenessProgressSectionProps) {
  return (
    <motion.section 
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-primary">Scam Awareness Progress</h2>
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Global Scam Awareness</CardTitle>
          <CardDescription>Our goal is to reach 100% awareness worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-sm text-muted-foreground">Current progress: {progress}%</p>
        </CardContent>
      </Card>
    </motion.section>
  )
}

function ScamCheckToolSection({ scamSigns, checkedSigns, handleChange, handleSubmit, scamCheckResult }: ScamCheckToolProps) {
  return (
    <motion.section 
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-primary">Scam Check Tool</h2>
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Check for Scam Signs</CardTitle>
          <CardDescription>Select any signs you've noticed in a suspicious communication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {Object.entries(scamSigns).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={checkedSigns[key] || false}
                  onCheckedChange={(checked) => handleChange(checked as boolean, key)}
                />
                <label
                  htmlFor={key}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
            <Button type="submit" className="mt-4">
              Check for Scam
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <AnimatePresence>
            {scamCheckResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded-md flex items-center gap-2 w-full ${
                  scamCheckResult.includes('red flag') ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'
                }`}
              >
                {scamCheckResult.includes('red flag') ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                <span>{scamCheckResult}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.section>
  )
}