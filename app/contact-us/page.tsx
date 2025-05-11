import { Metadata } from "next";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | YouTube Summarizer",
  description: "Get in touch with our team for support, feedback, or inquiries about our YouTube video summarization service.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Contact Us</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Can We Help You?</CardTitle>
            <CardDescription>
              We're here to answer your questions and provide assistance with our YouTube summarization service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 text-center rounded-lg border hover:shadow-md transition-shadow">
                <Mail className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <p className="text-gray-600 mb-3">Send us an email and we'll respond within 24 hours.</p>
                <a href="mailto:support@youtube-summarizer.com" className="text-blue-600 hover:underline">
                  support@youtube-summarizer.com
                </a>
              </div>
              
              <div className="flex flex-col items-center p-4 text-center rounded-lg border hover:shadow-md transition-shadow">
                <Phone className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">Call Us</h3>
                <p className="text-gray-600 mb-3">Available Monday to Friday, 9 AM to 5 PM IST.</p>
                <a href="tel:+919876543210" className="text-green-600 hover:underline">
                  +91 9876 543 210
                </a>
              </div>
              
              <div className="flex flex-col items-center p-4 text-center rounded-lg border hover:shadow-md transition-shadow">
                <MapPin className="h-8 w-8 text-red-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-3">Our office location in Bangalore, India.</p>
                <address className="text-gray-600 not-italic">
                  YouTube Summarizer<br />
                  123 Tech Park, Electronic City<br />
                  Bangalore, Karnataka 560100
                </address>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium mb-3 text-blue-800">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">How quickly will you respond to my inquiry?</h4>
                  <p className="text-gray-600">We aim to respond to all email inquiries within 24 hours during business days.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Do you offer refunds?</h4>
                  <p className="text-gray-600">Yes, please see our <Link href="/refund-and-cancellation" className="text-blue-600 hover:underline">Refund and Cancellation Policy</Link> for more details.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">How can I report a technical issue?</h4>
                  <p className="text-gray-600">Please email us with details of the issue including any error messages, and we'll help resolve it promptly.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="mailto:support@youtube-summarizer.com">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
} 