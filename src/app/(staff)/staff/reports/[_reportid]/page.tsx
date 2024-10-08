"use client";
import StaffHeader from "@/components/header/staffheader";
import Footer from '@/components/footer/footer';
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from 'convex/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api } from '../../../../../../convex/_generated/api';
import { AlertTriangle, Clock, FileText, Shield, Trash2, UserRound, CheckCircle2Icon, UserCheck, SaveIcon } from "lucide-react"
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { on } from "events";

export default function ReportPage({ params }: { params: { _reportid: string } }) {
    const user = useUser();
    const userId = user?.user?.id;
    const [isDeleted, setIsDeleted] = useState(false)
    const removereport = useMutation(api.reports.clear);

    const handleDelete = ({_id, storageid, imagestoreid}: any) => {
    setIsDeleted(true)
      removereport({ id: _id, storageid: storageid, imagestoreid: imagestoreid });
  }

    // Fetch staff status and report regardless of condition
    const staff = useQuery(api.isstaff.getter, { userId: userId });
    const report = useQuery(api.scamreportsreviewer.getter);
    const filteredReport = report?.filter((report: any) => report._id === params._reportid);
    const accurateReport = filteredReport?.[0]
    const prooflister = useQuery(api.submitter.list, accurateReport?.proof ? { body: accurateReport.proof } : { body: "" });
    const proofurl = prooflister?.[0]?.url;    
    console.log(prooflister)
    const formatproof = prooflister?.[0]?.format;
    const Subcategory = accurateReport?.selectedSubcategory?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const Category = accurateReport?.selectedCategory?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


    const revieweredit = useMutation(api.reports.reviewerupdater);

    function revieweredits() {
      return () => {
      revieweredit({ id: accurateReport?._id, reviewer: userId, status: "Under Review" });
      };
    }

    // Handle loading and null conditions after the queries are called
    if (!staff) return <div>Loading staff data...</div>;
    if (!report) return <div>Loading report data...</div>;

    if (isDeleted) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md border-yellow-500">
              <CardContent className="pt-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Report Deleted</h2>
                <p className="text-muted-foreground">This scam report has been permanently removed.</p>
              </CardContent>
            </Card>
          </div>
        )
      }

      if (!accurateReport) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full border-red-500 max-w-md">
              <CardContent className="pt-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
                <p className="text-muted-foreground">The scam report you are looking for does not exist.</p>
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
              <div className="items-center flex gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='default' className="gap-2 font-medium">
                      <UserCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Become the Reviewer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Become the Reviewer</AlertDialogTitle>
                      <AlertDialogDescription>
                        {accurateReport.reviewer ? "This report already has a reviewer. Are you sure you want to take over?" : "Are you sure you want to become the reviewer for this report?"}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={revieweredits()}>Become Reviewer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                      <AlertDialogAction onClick={() => handleDelete({ _id: accurateReport?._id, storageid: prooflister?.[0]?.body, imagestoreid: prooflister?.[0]?._id })}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
              </div>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Date Reported:</span>
                    </div>
                    <span>{new Date(accurateReport?._creationTime).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Description:</h4>
                  <p className="text-sm text-muted-foreground">
                    {accurateReport?.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Report Extra Information</h4>
                  {
                    accurateReport && (
                      <div className="flex flex-wrap gap-5 flex-row">
                        {accurateReport.phone && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Phone:</strong> {accurateReport.phone}
                          </p>
                        )}
                        {accurateReport.email && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Email:</strong> {accurateReport.email}
                          </p>
                        )}
                        {accurateReport.websiteUrl && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Website:</strong> {accurateReport.websiteUrl}
                          </p>
                        )}
                        {accurateReport.onlinePlatform && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Online Platform:</strong> {accurateReport.onlinePlatform}
                          </p>
                        )}
                        {accurateReport.financialLoss && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Financial Loss:</strong> {accurateReport.financialLoss}
                          </p>
                        )}
                        {accurateReport.subscriptionService && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Subscription Service:</strong> {accurateReport.subscriptionService}
                          </p>
                        )}
                        {accurateReport.healthClaim && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Health Claim:</strong> {accurateReport.healthClaim}
                          </p>
                        )}
                        {accurateReport.charityName && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Charity Name:</strong> {accurateReport.charityName}
                          </p>
                        )}
                        {accurateReport.donationAmount && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Donation Amount:</strong> {accurateReport.donationAmount}
                          </p>
                        )}
                        {accurateReport.productName && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Product Name:</strong> {accurateReport.productName}
                          </p>
                        )}
                        {accurateReport.travelAgency && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Travel Agency:</strong> {accurateReport.travelAgency}
                          </p>
                        )}
                        {accurateReport.destination && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Destination:</strong> {accurateReport.destination}
                          </p>
                        )}
                        {accurateReport.proof && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Proof Provided:</strong> Yes
                          </p>
                        )}
                        {accurateReport.staffnotes && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Staff Notes:</strong> {accurateReport.staffnotes}
                          </p>
                        )}
                      </div>
                    )
                  }
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
              <Separator className="my-6" />
              <StaffReviews accurateReport={accurateReport} prooflister={prooflister} />
              <Approvalzone _id={accurateReport?._id} storageid={prooflister?.[0]?.body} imagestoreid={prooflister?.[0]?._id} />
            </CardContent>
          </Card>
        </div>
        <Footer />
        </>
      )
    }

    const Approvalzone = ({_id, storageid, imagestoreid}: any) => {
      console.log(_id, storageid)
      const removereport = useMutation(api.reports.clear);
      const handleRemoveReport = () => {
        removereport({ id: _id, storageid: storageid, imagestoreid: imagestoreid });
    };
      return (
        <div className="flex flex-col gap-4 mt-6">
          <h3 className="text-lg font-semibold">Approval Zone</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="success" className="w-full gap-2">
                  <CheckCircle2Icon className="w-4 h-4" /> <span className="hidden sm:inline">Approve Report</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Report</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this report?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Approve</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                  <AlertDialogAction onClick={handleRemoveReport}>Reject</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }
    const StaffReviews = ({ accurateReport, prooflister }: any) => {
      
      // when form is submitted, update the review notes
      const updateReviewNotes = useMutation(api.reports.update);

      onsubmit = (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const staffnotes = formData.get("reviewNotes") as string;
        updateReviewNotes({ id: accurateReport._id, staffnotes });
      }
  
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Staff Reviews</h3>
          <div className="grid gap-4 mt-3 md:grid-cols-2">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Reviewer:</span>
              </div>
              <span className="text-sm">{accurateReport?.reviewer || "No reviewer assigned."}</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Review Notes:</h4>
            <form>
              <p className="text-sm text-muted-foreground">
                <Textarea name="reviewNotes" placeholder="Add review notes...">{accurateReport?.staffnotes}</Textarea>
              </p>
              <Button type="submit" variant='default' className="mt-4 flex gap-2">
                <SaveIcon className="w-4 h-4" />
                <span className="hidden sm:block">Save Review Notes</span>
              </Button>
            </form>
          </div>
        </div>
      );
    }