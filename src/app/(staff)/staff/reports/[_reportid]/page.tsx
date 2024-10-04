"use client";
import StaffHeader from "@/components/header/staffheader";
import Footer from '@/components/footer/footer';
import { useUser } from "@clerk/nextjs";
import { useQuery } from 'convex/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api } from '../../../../../../convex/_generated/api';
import { AlertTriangle, Clock, FileText, Shield, Trash2, UserRound, CheckCircle2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { useState } from 'react'

export default function ReportPage({ params }: { params: { _reportid: string } }) {
    const user = useUser();
    const userId = user?.user?.id;
    const [isDeleted, setIsDeleted] = useState(false)

    const handleDelete = () => {
    setIsDeleted(true)
  }
    // Fetch staff status and report regardless of condition
    const staff = useQuery(api.isstaff.getter, { userId: userId });
    const report = useQuery(api.scamreportsreviewer.getter);
    const filteredReport = report?.filter((report: any) => report._id === params._reportid);
    const accurateReport = filteredReport?.[0]
    const prooflister = useQuery(api.submitter.list, accurateReport?.proof ? { body: accurateReport.proof } : { body: "" });
    const proofurl = prooflister?.[0]?.url;    
    const formatproof = prooflister?.[0]?.format;
    const Subcategory = accurateReport?.selectedSubcategory?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const Category = accurateReport?.selectedCategory?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Handle loading and null conditions after the queries are called
    if (!staff) return <div>Loading staff data...</div>;
    if (!report) return <div>Loading report data...</div>;

    if (isDeleted) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Report Deleted</h2>
                <p className="text-muted-foreground">This scam report has been permanently removed.</p>
              </CardContent>
            </Card>
          </div>
        )
      }
      return (
        <>
                <StaffHeader />
        <div className="container md:mx-auto flex items-center justify-center w-full h-auto px-4 py-8">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Scam Report Viewer</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2 font-medium">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete Report</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the scam report
                      and remove the data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Report ID:</span>
                  </div>
                  <span className="font-semibold">{params._reportid}</span>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Category:</span>
                  </div>
                  <Badge variant="default" className="py-1 w-auto">{Category}</Badge>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Subcategory:</span>
                  </div>
                  <Badge variant="outline" className="py-1 w-auto">{Subcategory}</Badge>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Report Details</h3>
                <ScamReportOverview report={accurateReport} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Date Reported:</span>
                    </div>
                    <span>{new Date(accurateReport?._creationTime).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Severity:</span>
                    </div>
                    <Badge variant="destructive">High</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Description:</h4>
                  <p className="text-sm text-muted-foreground">
                    {accurateReport?.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Proof:</h4>
                  <div className="text-sm text-muted-foreground">
                    {formatproof && formatproof === 'image' ? (
                      <img
                        src={proofurl}
                        className="rounded-lg w-[50%] h-auto"
                        alt="Proof image"
                      />
                    ) : formatproof && formatproof === 'video' ? (
                      <video
                        controls
                        src={proofurl}
                        className="rounded-lg w-full h-auto"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <p>No proof provided.</p>
                    )}
                  </div>
                </div>
              </div>
              <Approvalzone />
            </CardContent>
          </Card>
        </div>
        <Footer />
        </>
      )
    }

    const Approvalzone = () => {
      return (
        <div className="flex flex-col gap-4 mt-6">
          <h3 className="text-lg font-semibold">Approval Zone</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="success" className="w-full gap-2">
              <CheckCircle2Icon className="w-4 h-4" /> <span className="hidden sm:inline">Approve Report</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Reject Report</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Report</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this report?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Reject</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }

    const ScamReportOverview = ({ report }: any) => {
      return (
        <div className="flex flex-col gap-0.5 pb-3">
          <p className="text-xs dark:text-gray-500">Report overview</p>
          <p className="text-wrap text-sm">
            This scam is a{" "}
            {report.selectedSubcategory
              ? report.selectedSubcategory
              : report.customCategory}{" "}
            based scam, {" "}
            {report.phone && `Phone number used: ${report.phone}. `} 
            {report.email && `Email used: ${report.email}. `} 
            {report.financialLoss && `Financial loss is estimated at £${report.financialLoss}. `} 
            {report.websiteUrl && `the website URL is ${report.websiteUrl}. `} 
            {report.onlinePlatform && `Platform used ${report.onlinePlatform}. `} 
            {report.productName && `Product name: ${report.productName}. `} 
            {report.healthClaim && `Health claim: ${report.healthClaim}. `} 
            {report.loanType && `Loan type: ${report.loanType}. `} 
            {report.lenderName && `Lender name: ${report.lenderName}. `} 
            {report.subscriptionService && `Subscription service: ${report.subscriptionService}. `} 
            {report.hiddenFees && `Hidden fees: ${report.hiddenFees}. `} 
            {report.destination && `Destination: ${report.destination}. `} 
            {report.travelAgency && `Travel agency: ${report.travelAgency}. `} 
            {report.charityName && `Charity name: ${report.charityName}. `} 
            {report.donationAmount && `Donation amount: ${report.donationAmount}. `} 
            {report.status && `Its current review status is ${report.status}. `} 
            {report.reviewer && `Reviewed by: ${report.reviewer}. `} 
            {report.lastupdated && `This report was last updated on ${new Date(report.lastupdated).toLocaleDateString()}.`}
          </p>
        </div>
      );
    };
    