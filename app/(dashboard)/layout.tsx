"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User, History, Home, Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
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
    <main className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">YouTube Summarizer</h1>
            {/* Desktop navigation */}
            <nav className="ml-8 hidden sm:block">
              <ul className="flex space-x-4">
                <li>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/history" 
                    className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Desktop user info and buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                Welcome, {user.displayName || user.name || user.email}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                {user.credits} credits
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Mobile hamburger menu button */}
          <button 
            className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t shadow-md overflow-hidden">
            <div className="container mx-auto px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center text-sm px-3 py-3 rounded-md hover:bg-gray-100 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/history" 
                      className="flex items-center text-sm px-3 py-3 rounded-md hover:bg-gray-100 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.displayName || user.name || user.email}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {user.credits} credits
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
} 