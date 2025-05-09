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
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setDisplayName(user.displayName || user.name || "");
    }
  }, [user, isLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateUserProfile({ displayName });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Failed to update profile" });
    } finally {
      setIsUpdating(false);
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
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Your Profile</h1>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="credits">
                <CreditCard className="h-4 w-4 mr-2" />
                Credits
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account settings and profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {message && (
                    <Alert variant={message.type === "success" ? "default" : "destructive"}>
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-2 text-sm font-medium text-gray-500">Email</div>
                    <div className="text-base font-medium">{user.email}</div>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="text-sm font-medium">
                        Display Name
                      </label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="How you want to be addressed"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
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
