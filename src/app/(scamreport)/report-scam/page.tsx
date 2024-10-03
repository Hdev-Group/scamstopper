'use client'

import { useEffect, useState } from 'react'
import Header from '../../../components/header/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useMutation, useQuery } from "convex/react";
import { api } from '../../../../convex/_generated/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Footer from '../../../components/footer/footer'

const scamCategories = [
    {
      id: 'financial',
      name: 'Financial Scams',
      subcategories: [
        { id: 'investment', name: 'Investment Fraud', description: 'False promises of high returns with little or no risk'},
        { id: 'ponzi', name: 'Ponzi Schemes', description: 'Fraudulent investing scams promising high rates of return with little risk' },
        { id: 'credit_card', name: 'Credit Card Fraud', description: 'Unauthorized use of a credit or debit card to fraudulently obtain money or property' },
      ]
    },
    {
      id: 'identity',
      name: 'Identity Theft',
      subcategories: [
        { id: 'phishing', name: 'Phishing', description: 'Attempts to obtain sensitive information by disguising as a trustworthy entity' },
        { id: 'social_engineering', name: 'Social Engineering', description: 'Manipulating people into giving up confidential information' },
        { id: 'data_breach', name: 'Data Breach', description: 'Theft of sensitive personal information from a data system' },
      ]
    },
    {
      id: 'account',
      name: 'Account Takeovers',
      subcategories: [
        { id: 'bank', name: 'Bank Account Takeover', description: 'Unauthorized access to a bank account' },
        { id: 'email', name: 'Email Account Takeover', description: 'Unauthorized access to an email account' },
        { id: 'social_media', name: 'Social Media Account Takeover', description: 'Unauthorized access to a social media account' },
        { id: 'gaming', name: 'Gaming Account Takeover', description: 'Unauthorized access to an online gaming account' },
      ]
    },
    {
      id: 'online',
      name: 'Online Scams',
      subcategories: [
        { id: 'romance', name: 'Romance Scam', description: 'Fraudsters create fake profiles to trick victims into a relationship and eventually ask for money' },
        { id: 'tech_support', name: 'Tech Support Scam', description: 'Scammers pose as tech support to gain access to your devices or personal information' },
        { id: 'online_shopping', name: 'Online Shopping Fraud', description: 'Fake online stores or non-delivery of paid goods' },
        { id: 'email', name: 'Email Scam', description: 'Fraudulent emails to trick recipients into revealing personal information' },
        { id: 'social_media', name: 'Social Media Scam', description: 'Scams on social media platforms' },
        { id: 'crypto', name: 'Cryptocurrency Scam', description: 'Fraudulent schemes involving cryptocurrency' },
        { id: 'games', name: 'Online Gaming Scam', description: 'Scams related to online gaming' },
        { id: 'auction', name: 'Online Auction Fraud', description: 'Fraud in online bidding or auction platforms' },
        { id: 'fake_websites', name: 'Fake Websites', description: 'Scammers create look-alike websites to steal personal or financial information' },
        { id: 'subscription_trap', name: 'Subscription Trap', description: 'Tricking users into recurring payments through fake subscriptions' },
      ]
    },
    {
      id: 'charity',
      name: 'Charity Scams',
      subcategories: [
        { id: 'disaster', name: 'Disaster Relief Scams', description: 'Fake charities that claim to provide aid for disaster relief' },
        { id: 'fake_charities', name: 'Fake Charity Scams', description: 'Scammers pretend to be from real or fictional charities asking for donations' },
      ]
    },
    {
      id: 'health',
      name: 'Health Scams',
      subcategories: [
        { id: 'miracle_cures', name: 'Miracle Cure Scams', description: 'Promising cures or treatments for serious medical conditions' },
        { id: 'healthcare_fraud', name: 'Healthcare Fraud', description: 'Fraudulent claims involving medical services, supplies, or insurance' },
      ]
    },
    {
      id: 'loan',
      name: 'Loan Scams',
      subcategories: [
        { id: 'payday_loan', name: 'Payday Loan Scam', description: 'Fraudulent payday loan offers or high-interest loans with unfair terms' },
        { id: 'student_loan', name: 'Student Loan Scam', description: 'Fraudulent offers to help reduce or eliminate student loan debt' },
      ]
    },
    {
      id: 'telecom',
      name: 'Telecom Scams',
      subcategories: [
        { id: 'phone_spoofing', name: 'Phone Spoofing', description: 'Scammers disguise their caller ID to appear as a trusted source' },
        { id: 'robocall', name: 'Robocall Scam', description: 'Automated calls that trick people into giving up personal information' },
      ]
    },
    {
      id: 'subscription',
      name: 'Subscription Scams',
      subcategories: [
        { id: 'free_trial', name: 'Free Trial Scam', description: 'Offering "free" trials that later charge hidden fees' },
        { id: 'subscription_trap', name: 'Subscription Trap', description: 'Tricking users into subscribing to a service with hidden recurring payments' },
      ]
    },
    {
      id: 'travel',
      name: 'Travel Scams',
      subcategories: [
        { id: 'vacation', name: 'Vacation Scam', description: 'Offering fake vacations or travel packages to steal money' },
        { id: 'timeshare', name: 'Timeshare Scam', description: 'Fraudulent timeshare resale offers' },
      ]
    },
    {
        id: 'other',
        name: 'Other Scams',
        subcategories: [
          { id: 'employment', name: 'Employment Scams', description: 'False promises of employment or business opportunities' },
          { id: 'lottery', name: 'Lottery or Prize Scams', description: 'False claims of lottery winnings or prizes requiring upfront fees' },
          { id: 'custom', name: 'Other (Please specify)', description: 'A scam category not listed above' },
        ]
      }
  ];
  

  export default function ReportScam() {
    const user = useUser()

    useEffect(() => {
      const photovidproof = document.getElementById('photovidproof') as HTMLInputElement | null;

      photovidproof?.addEventListener('change', (e) => {
        // check if the photo or video is under 5MB

        const previewContainer = document.getElementById('previewContainer');
        if (!previewContainer) return;
        
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }
      
        const reader = new FileReader();
        reader.onloadend = () => {
          // Clear previous preview
          previewContainer.innerHTML = '';
      
          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.className = 'w-full h-auto';
            previewContainer.appendChild(img);
          } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = reader.result as string;
            video.controls = true;
            video.className = 'w-full h-auto';
            previewContainer.appendChild(video);
          }
      
          // Make the preview visible
          previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
    }, []);

    const addscamform = useMutation(api.submitter.addScamForm)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubcategory, setSelectedSubcategory] = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [description, setDescription] = useState('')
    const [phone, setPhone] = useState('')
    const [impersonate, setImpersonate] = useState('')
    const [email, setEmail] = useState('')
    const [financialLoss, setFinancialLoss] = useState('')
    const [investmentType, setInvestmentType] = useState('')
    const [accountType, setAccountType] = useState('')
    const [accessDate, setAccessDate] = useState('')
    const [websiteUrl, setWebsiteUrl] = useState('')
    const [onlinePlatform, setOnlinePlatform] = useState('')
    const [charityName, setCharityName] = useState('')
    const [donationAmount, setDonationAmount] = useState('')
    const [productName, setProductName] = useState('')
    const [healthClaim, setHealthClaim] = useState('')
    const [loanType, setLoanType] = useState('')
    const [lenderName, setLenderName] = useState('')
    const [subscriptionService, setSubscriptionService] = useState('')
    const [hiddenFees, setHiddenFees] = useState('')
    const [destination, setDestination] = useState('')
    const [travelAgency, setTravelAgency] = useState('')
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const generateUploadUrl = useMutation(api.submitter.generateUploadUrl);
    const sendImage = useMutation(api.submitter.sendImage)

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const photovidproof = document.getElementById('photovidproof') as HTMLInputElement | null;
    
      try {
      if (!selectedImage) {
        alert('Please upload a photo or video proof.');
        return;
      }

      const postUrl = await generateUploadUrl();
      
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });
      
      // Step 3: Extract storageId from the response
      const { storageId } = await result.json();
      
      // Optional: Handle the selectedImage cleanup
      setSelectedImage(null);
      if (photovidproof) {
        photovidproof.innerHTML = '';
      }
    
      // Step 4: Prepare form data
      const author = user.user?.firstName || 'unknown';
      await sendImage({ storageId, author });
      
      const userdetails = [{
        email: user?.user?.emailAddresses[0]?.emailAddress,
        firstName: user?.user?.firstName,
        lastName: user?.user?.lastName,
        id: user?.user?.id
      }];

      const storageinfo = storageId
    
      const formData = {
        selectedCategory,
        selectedSubcategory,
        customCategory,
        description,
        phone,
        impersonate,
        email,
        financialLoss,
        investmentType,
        accountType,
        accessDate,
        websiteUrl,
        onlinePlatform,
        charityName,
        donationAmount,
        productName,
        healthClaim,
        loanType,
        lenderName,
        subscriptionService,
        hiddenFees,
        destination,
        travelAgency,
        proof: storageinfo, // Use the storageId retrieved from the response
        status: 'pending',
        reviewer: null,
        userdetails
      };
    
      // Step 5: Call addscamform after successfully getting storageId
      await addscamform(formData).then(() => {
        alert('Scam report submitted successfully.');
        // Reset all state values
        setSelectedCategory('');
        setSelectedSubcategory('');
        setCustomCategory('');
        setDescription('');
        setPhone('');
        setImpersonate('');
        setEmail('');
        setFinancialLoss('');
        setInvestmentType('');
        setAccountType('');
        setAccessDate('');
        setWebsiteUrl('');
        setOnlinePlatform('');
        setCharityName('');
        setDonationAmount('');
        setProductName('');
        setHealthClaim('');
        setLoanType('');
        setLenderName('');
        setSubscriptionService('');
        setHiddenFees('');
        setDestination('');
        setSelectedImage(null);
        setTravelAgency('');
      });
      } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the scam report. Please try again later.');
      }
    }
  
    const [search, setSearch] = useState('')
  
    const filteredscamcats = scamCategories.filter((category) => {
      return category.name.toLowerCase().includes(search.toLowerCase())
    })
  
    return (
      <>
              <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <section className="flex flex-col mt-10 lg:flex-row justify-between items-start gap-8">
              <div className="w-full max-w-2xl">
                {user.user && <p className='text-md text-muted-foreground mb-0.5'>Hello {user.user.firstName},</p>}
                <h1 className="text-3xl font-bold mb-6">Report a Scam</h1>
                <p className="text-lg text-muted-foreground mb-6">Help us protect others by reporting scams you have encountered. Your report will be reviewed by our team and may be shared with relevant authorities.</p>
    
                <Input placeholder='Filter Categories' className='mb-4' value={search} onChange={(e) => setSearch(e.target.value)} />
    
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredscamcats.map((category) => (
                      <AccordionItem value={category.id} key={category.id}>
                        <AccordionTrigger>{category.name}</AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup value={selectedSubcategory} onValueChange={(value) => {
                            setSelectedCategory(category.id)
                            setSelectedSubcategory(value)
                          }}>
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="flex items-start space-x-2 mb-2">
                                <RadioGroupItem value={subcategory.id} required id={subcategory.id} />
                                <div>
                                  <Label htmlFor={subcategory.id} className="font-medium">{subcategory.name}</Label>
                                  <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
    
                  {selectedSubcategory === 'custom' && (
                    <div>
                      <Label htmlFor="custom-category">Custom Category</Label>
                      <Input id="custom-category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Enter custom scam category" />
                    </div>
                  )}
    
                  {selectedCategory === 'telecom' && (
                    <>
                      <div>
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input id="phone_number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                      </div>
                      <div>
                        <Label htmlFor="impersonate">Who was this attempting to impersonate</Label>
                        <Input id="impersonate" value={impersonate} onChange={(e) => setImpersonate(e.target.value)} placeholder="Enter a company or person that the scammer was impersonating" />
                      </div>
                    </>
                  )}
    
                  {selectedCategory === 'identity' && (
                    <>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" />
                      </div>
                      <div>
                        <Label htmlFor="weblinks">Links to Websites</Label>
                        <Textarea id="weblinks" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="Enter links to websites along with how the fraud was committed" />
                      </div>
                    </>
                  )}
    
                  {selectedSubcategory === 'gaming' && (
                    <div>
                      <Label htmlFor="weblinks">Have you signed into any websites that they have sent you?</Label>
                      <Input id="weblinks" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="You may have been sent a link to a website that looks like the real one. Please provide the link here." />
                    </div>
                  )}
    
                  {selectedCategory === 'financial' && (
                    <>
                      <div>
                        <Label htmlFor="financial_loss">Amount of Financial Loss</Label>
                        <Input id="financial_loss" value={financialLoss} onChange={(e) => setFinancialLoss(e.target.value)} placeholder="Enter the total amount lost" />
                      </div>
                      <div>
                        <Label htmlFor="investment_type">Type of Investment</Label>
                        <Input id="investment_type" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} placeholder="What type of investment was it? e.g. Stock, Crypto, etc." />
                      </div>
                    </>
                  )}
    
                  {selectedCategory === 'account' && (
                    <>
                      <div>
                        <Label htmlFor="account_type">Account Type</Label>
                        <Input id="account_type" value={accountType} onChange={(e) => setAccountType(e.target.value)} placeholder="Was it a Bank, Social Media, or Email account?" />
                      </div>
                      <div>
                        <Label htmlFor="access_date">Date of Unauthorized Access</Label>
                        <Input id="access_date" value={accessDate} onChange={(e) => setAccessDate(e.target.value)} placeholder="When was the unauthorized access?" />
                      </div>
                    </>
                  )}
    
                  {selectedCategory === 'online' && (
                    <>
                      <div>
                        <Label htmlFor="website_url">Website URL</Label>
                        <Input id="website_url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="Enter the website URL where the scam occurred" />
                      </div>
                      <div>
                        <Label htmlFor="online_platform">Online Platform</Label>
                        <Input id="online_platform" value={onlinePlatform} onChange={(e) => setOnlinePlatform(e.target.value)} placeholder="Enter the online platform (e.g., Amazon, eBay, Facebook Marketplace)" />
                      </div>
                    </>
                  )}
    
                  {selectedCategory === 'charity' && (
                    <>
                      <div>
                        <Label htmlFor="charity_name">Charity Name</Label>
                        <Input id="charity_name" value={charityName} onChange={(e) => setCharityName(e.target.value)} placeholder="Enter the charity's name" />
                      </div>
                      <div>
                        <Label htmlFor="donation_amount">Donation Amount</Label>
                        <Input id="donation_amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="Enter the donation amount" />
                      </div>
                    </>
                  )}
                  {selectedCategory === 'health' && (
                  <>
                    <div>
                      <Label htmlFor="product_name">Product Name</Label>
                      <Input id="product_name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter the name of the product or service" />
                    </div>
                    <div>
                      <Label htmlFor="health_claim">Health Claim</Label>
                      <Input id="health_claim" value={healthClaim} onChange={(e) => setHealthClaim(e.target.value)} placeholder="What was the fraudulent health claim?" />
                    </div>
                  </>
                )}

                {selectedCategory === 'loan' && (
                  <>
                    <div>
                      <Label htmlFor="loan_type">Loan Type</Label>
                      <Input id="loan_type" value={loanType} onChange={(e) => setLoanType(e.target.value)} placeholder="What type of loan was it? e.g., Payday, Student Loan" />
                    </div>
                    <div>
                      <Label htmlFor="lender_name">Lender Name</Label>
                      <Input id="lender_name" value={lenderName} onChange={(e) => setLenderName(e.target.value)} placeholder="Enter the name of the fake lender" />
                    </div>
                  </>
                )}

                {selectedCategory === 'subscription' && (
                  <>
                    <div>
                      <Label htmlFor="subscription_service">Subscription Service</Label>
                      <Input id="subscription_service" value={subscriptionService} onChange={(e) => setSubscriptionService(e.target.value)} placeholder="Enter the subscription service name" />
                    </div>
                    <div>
                      <Label htmlFor="hidden_fees">Hidden Fees</Label>
                      <Input id="hidden_fees" value={hiddenFees} onChange={(e) => setHiddenFees(e.target.value)} placeholder="Describe any hidden fees involved" />
                    </div>
                  </>
                )}

                {selectedCategory === 'travel' && (
                  <>
                    <div>
                      <Label htmlFor="destination">Travel Destination</Label>
                      <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter the fake travel destination" />
                    </div>
                    <div>
                      <Label htmlFor="travel_agency">Travel Agency Name</Label>
                      <Input id="travel_agency" value={travelAgency} onChange={(e) => setTravelAgency(e.target.value)} placeholder="Enter the fake travel agency" />
                    </div>
                  </>
                )}
  
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide a brief description of the scam" />
                </div>
                {
                  user.user ? null : <div className='text-sm text-neutral-300'>You must be signed in to report a scam. <Link href='/sign-in'>Sign in</Link></div>
                }
                <div className='flex flex-col gap-4'>
                  <Label htmlFor="photo_proof">Photo / Video Proof</Label>
                  <Input type='file' id='photovidproof' onChange={(event) => setSelectedImage(event.target.files![0])} accept='image/png, image/jpeg, video/*'  />
                  {/* lets have a preview of the photo here */}
                  <div id='previewContainer' className='w-full h-auto' style={{ display: 'none' }}></div>
                </div>
                  <div className='flex flex-col gap-4'>
                  <Label className='text-xs text-neutral-300'>{user.user && (user.user.firstName)} By submitting this report, you agree to share the information with our fraud prevention team and relevant authorities after this process we will then post this on the website with information anonymized.</Label>
                  <Button type="submit" className="w-full">Submit Report</Button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      </>
    )
  }