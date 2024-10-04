"use client"

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import StaffHeader from "@/components/header/staffheader";
import { useQuery } from "convex/react";
import { api } from '../../../../../convex/_generated/api';
import Footer from "@/components/footer/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
interface Report {
    _id: string;
    lastupdated: string | null;
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    status: "pending" | "reviewed" | "resolved" | null;
  }
  
  export default function StaffReportScams() {
    const user = useUser();
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState("");
  
    if (!user) return null;
  
    const userId = user?.user?.id;

  
    const staff = useQuery(api.isstaff.getter, { userId });
    const reports = useQuery(api.scamreportsreviewer.getter);

    if (!staff) return null;
    function handleReview(id: string) {
    }
  
    function handleSort(column: string) {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    }
  
    const sortedReports = reports?.slice().sort((a, b) => {
      if (!sortColumn) return 0;
  
      const aValue = a[sortColumn as keyof Report] ?? '';
      const bValue = b[sortColumn as keyof Report] ?? '';
  
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    const filteredReports = sortedReports?.filter((report) =>
      report.selectedCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.selectedSubcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-background to-secondary">
      <StaffHeader />
      <main className="container min-h-screen  mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Scam Reports Review</h1>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search ID's, categories or subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <button className="flex items-center" onClick={() => handleSort('lastupdated')}>
                    Date
                    {sortColumn === 'lastupdated' ? (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    ) : <ChevronsUpDown className="ml-2 h-4 w-4" />}
                  </button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>
                  <button className="flex items-center" onClick={() => handleSort('status')}>
                    Status
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    ) : <ChevronsUpDown className="ml-2 h-4 w-4" />}
                  </button>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports?.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className="font-medium">{report._id}</TableCell>
                  <TableCell>{report.lastupdated ? new Date(report.lastupdated).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{report.selectedCategory || "N/A"}</TableCell>
                  <TableCell>{report.selectedSubcategory || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      report.status === 'pending' ? 'destructive' : 
                      report.status === 'reviewed' ? 'warning' : 
                      report.status === 'resolved' ? 'success' : 
                      'secondary'
                    }>
                      {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'No Status'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link href={`/staff/reports/${report._id}`}>
                            <DropdownMenuItem>View</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
}