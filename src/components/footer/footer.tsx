import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, AlertTriangle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-grey-900 dark:border-black text-muted-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ScamStopper</h3>
            <p className="text-sm">Empowering users to identify, report, and prevent scams.</p>
            <Link href="/report-scam">
                <Button variant="destructive" className="w-full mt-5">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report a Scam
                </Button>
            </Link>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/resources" className="hover:underline">Scam Prevention Resources</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <p className="text-sm mb-2">Subscribe to our newsletter for updates:</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit" className="w-full">Subscribe</Button>
            </form>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-muted-foreground/20 text-center text-sm">
          © {new Date().getFullYear()} ScamStopper. All rights reserved.
        </div>
      </div>
    </footer>
  )
}