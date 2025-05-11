import { Metadata } from "next";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | YouTube Summarizer",
  description: "Learn about our refund policy, cancellation process, and subscription management for the YouTube Summarizer service.",
};

export default function RefundAndCancellationPage() {
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
          <h1 className="text-2xl font-bold">Refund and Cancellation Policy</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Refund and Cancellation Policy</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              At YouTube Summarizer, we strive to ensure your satisfaction with our service. This policy outlines our approach to refunds and cancellations for all subscription plans.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Subscription Cancellation</h2>
            <p>
              You may cancel your subscription at any time by following these steps:
            </p>
            <ol className="list-decimal ml-6 my-3">
              <li>Log in to your YouTube Summarizer account</li>
              <li>Navigate to the Profile section</li>
              <li>Select "Subscription" from the menu</li>
              <li>Click on "Cancel Subscription"</li>
              <li>Follow the prompts to confirm cancellation</li>
            </ol>
            <p>
              Upon cancellation, you will retain access to the service until the end of your current billing period. After this period, your account will revert to the free plan with limited features.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Refund Policy</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">Free Trial</h3>
            <p>
              If your subscription plan includes a free trial period, you may cancel at any time during this period without being charged. If you do not cancel before the trial period ends, you will be automatically charged for the first billing period.
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Monthly Subscriptions</h3>
            <p>
              For monthly subscription plans, we offer a 7-day money-back guarantee from the date of initial purchase. If you are not satisfied with our service within the first 7 days, you may request a full refund by contacting our support team.
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Annual Subscriptions</h3>
            <p>
              For annual subscription plans, we offer a 14-day money-back guarantee from the date of initial purchase. If you are not satisfied with our service within the first 14 days, you may request a full refund by contacting our support team.
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Pro-rated Refunds</h3>
            <p>
              We do not offer pro-rated refunds for partial use of a subscription period after the money-back guarantee period has ended. If you cancel your subscription after the refund period, you will continue to have access to the service until the end of your current billing period.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">How to Request a Refund</h2>
            <p>
              To request a refund within the eligible period, please contact our support team through one of the following methods:
            </p>
            <ul className="list-disc ml-6 my-3">
              <li>Email: <a href="mailto:support@youtube-summarizer.com" className="text-blue-600 hover:underline">support@youtube-summarizer.com</a></li>
              <li>Contact us form: <Link href="/contact-us" className="text-blue-600 hover:underline">Contact Us</Link></li>
            </ul>
            <p>
              Please include the following information in your refund request:
            </p>
            <ul className="list-disc ml-6 my-3">
              <li>Your account email address</li>
              <li>Date of purchase</li>
              <li>Subscription plan purchased</li>
              <li>Reason for the refund request</li>
            </ul>
            <p>
              Our support team will process your refund request within 5 business days. Once approved, the refund will be issued to the original payment method and may take 5-10 business days to appear on your statement, depending on your payment provider.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Credit Balance and Refunds</h2>
            <p>
              Credits purchased individually (outside of a subscription plan) are non-refundable once added to your account. Unused credits remain in your account until used, even if your subscription is canceled.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Changes to this Policy</h2>
            <p>
              We reserve the right to modify this refund and cancellation policy at any time. Any changes will be posted on this page with an updated "Last updated" date. It is your responsibility to review this policy periodically for changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about our refund and cancellation policy, please <Link href="/contact-us" className="text-blue-600 hover:underline">contact us</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 