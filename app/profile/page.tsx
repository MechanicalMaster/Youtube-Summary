"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, User, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateUserProfile, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setDisplayName(user.displayName || user.name || "");
    }
  }, [user, isLoading, router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateUserProfile({ displayName });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="credits" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" /> Credits
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {message && (
                    <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Your email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="text-sm font-medium">
                        Display Name
                      </label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="How you want to be known"
                      />
                    </div>
                    
                    <Button type="submit">
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="credits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Credits</CardTitle>
                  <CardDescription>
                    View and manage your credits for summarizing videos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
                    <h3 className="text-3xl font-bold text-blue-700 mb-2">{user.credits}</h3>
                    <p className="text-blue-600">Available Credits</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Credit Usage</h4>
                    <div className="bg-white border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Each video summary</span>
                        <span className="text-sm font-medium">1 credit</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min(100, (user.credits / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/#pricing">Get More Credits</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
