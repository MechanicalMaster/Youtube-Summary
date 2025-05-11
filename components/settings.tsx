"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import { UserSettings } from "@/lib/supabase";
import { useTheme } from "next-themes";
import { Trash2, Download, ArrowUpRight, Lightbulb, Bug, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export function Settings() {
  const { user, updateSettings } = useAuth();
  const { setTheme } = useTheme();
  
  // State for form submissions
  const [featureRequest, setFeatureRequest] = useState("");
  const [bugReport, setBugReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Get user settings or use defaults
  const settings = user?.settings || {
    mode: "system",
    default_action: "concise_summary",
    search_language: "English"
  };
  
  // Handle settings changes
  const handleModeChange = async (value: string) => {
    if (!user) return;
    
    // Update theme in the UI immediately
    setTheme(value);
    
    // Update settings in the database
    await updateSettings({ mode: value as "dark" | "system" | "light" });
  };
  
  const handleDefaultActionChange = async (value: string) => {
    if (!user) return;
    await updateSettings({ 
      default_action: value as "open_reader" | "concise_summary" | "detailed_summary" 
    });
  };
  
  const handleSearchLanguageChange = async (value: string) => {
    if (!user) return;
    await updateSettings({ search_language: value });
  };
  
  // Handle form submissions
  const handleFeatureRequestSubmit = () => {
    if (!featureRequest.trim()) return;
    
    setIsSubmitting(true);
    
    // Log the feature request (in a real implementation, this would send to a backend service)
    console.log("Feature request submitted:", featureRequest);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFeatureRequest("");
      
      // Reset success message after a delay
      setTimeout(() => setFormSubmitted(false), 3000);
    }, 1000);
  };
  
  const handleBugReportSubmit = () => {
    if (!bugReport.trim()) return;
    
    setIsSubmitting(true);
    
    // Log the bug report (in a real implementation, this would send to a backend service)
    console.log("Bug report submitted:", bugReport);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setBugReport("");
      
      // Reset success message after a delay
      setTimeout(() => setFormSubmitted(false), 3000);
    }, 1000);
  };
  
  // Handle data export
  const handleExportData = () => {
    console.log("Export data requested - this would generate a markdown file of the user's summaries");
    // This would call the exportSummaries action in a real implementation
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    console.log("Account deletion requested - this would call the deleteAccount action");
    // This would call the deleteAccount action in a real implementation
  };
  
  if (!user) {
    return <div>Please log in to access settings</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize how the app looks and behaves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Theme Mode</Label>
              <Select
                value={settings.mode}
                onValueChange={handleModeChange}
              >
                <SelectTrigger id="mode" className="w-full">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-action">Default Action</Label>
              <Select
                value={settings.default_action}
                onValueChange={handleDefaultActionChange}
              >
                <SelectTrigger id="default-action" className="w-full">
                  <SelectValue placeholder="Select default action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open_reader">Open Reader</SelectItem>
                  <SelectItem value="concise_summary">Concise Summary</SelectItem>
                  <SelectItem value="detailed_summary">Detailed Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search-language">Search Language</Label>
            <Select
              value={settings.search_language}
              onValueChange={handleSearchLanguageChange}
            >
              <SelectTrigger id="search-language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export your data or upgrade your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleExportData}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Summaries
            </Button>
            
            <Button className="w-full">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade to Plus
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Help & Feedback</CardTitle>
          <CardDescription>Request features, report bugs, or get help</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Feature Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request a Feature</DialogTitle>
                  <DialogDescription>
                    Let us know what features you'd like to see added to the app.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Describe the feature you'd like to see..."
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  {formSubmitted ? (
                    <div className="text-green-600">Thanks for your feedback!</div>
                  ) : (
                    <Button 
                      type="submit" 
                      onClick={handleFeatureRequestSubmit}
                      disabled={isSubmitting || !featureRequest.trim()}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Bug className="mr-2 h-4 w-4" />
                  Report a Bug
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Report a Bug</DialogTitle>
                  <DialogDescription>
                    Let us know about any issues you've encountered.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Describe the bug and how to reproduce it..."
                    value={bugReport}
                    onChange={(e) => setBugReport(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  {formSubmitted ? (
                    <div className="text-green-600">Thanks for your report!</div>
                  ) : (
                    <Button 
                      type="submit" 
                      onClick={handleBugReportSubmit}
                      disabled={isSubmitting || !bugReport.trim()}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Frequently Asked Questions</DialogTitle>
                  <DialogDescription>
                    Find answers to common questions about the app.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h3 className="text-sm font-medium">How do credits work?</h3>
                    <p className="text-sm text-muted-foreground">
                      You get 10 credits by default. Each summary costs 1 credit. You can get more credits by upgrading to Plus.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium">Can I summarize any YouTube video?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, as long as the video has captions or transcripts available.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium">How can I delete my account?</h3>
                    <p className="text-sm text-muted-foreground">
                      You can delete your account from the Account section in the settings page.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
} 