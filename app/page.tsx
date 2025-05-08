"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, BrainCircuit, FileText, Play } from "lucide-react"
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                >
                  Summarize YouTube Videos in Seconds
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="max-w-[600px] text-gray-500 md:text-xl"
                >
                  Get concise, accurate summaries of any YouTube video with our AI-powered tool. Save time and extract key insights instantly.
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto aspect-video overflow-hidden rounded-xl border bg-gray-100 object-cover sm:w-full lg:order-last"
            >
              <div className="flex h-full items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center space-y-4 p-4 text-center"
                >
                  <Play className="h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium text-gray-500">Video Summarizer Demo</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Smart Features for Video Content
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered summarizer breaks down videos into digestible sections with timestamps,
              making it easy to understand and navigate long content.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Timestamped Sections</h3>
              <p className="text-gray-600">
                Navigate to specific parts of videos with accurate timestamps for each section of content.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-6">
                <BrainCircuit className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced AI models understand context and extract the most important information from videos.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Structured Summaries</h3>
              <p className="text-gray-600">
                Get organized summaries with clear sections, making it easy to understand complex topics.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include full access to our features.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-500 mb-4">Perfect for trying out the service</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">10 free credits</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Basic summaries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Standard support</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">Sign Up Free</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg border-2 border-blue-500 overflow-hidden relative"
            >
              <motion.div 
                initial={{ x: 100 }}
                whileInView={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg"
              >
                POPULAR
              </motion.div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Pro</h3>
                <p className="text-sm text-gray-500 mb-4">For regular content creators</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Introductory Offer</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">50 credits per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Advanced summaries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Rollover unused credits</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Enterprise</h3>
                <p className="text-sm text-gray-500 mb-4">For teams and businesses</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹4,999</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">300 credits per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Premium summaries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-600">Team collaboration</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">Contact Sales</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Ready to save time on video content?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of users who are already summarizing YouTube videos with our AI-powered tool.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-900">YouTube Summarizer</h2>
              <p className="text-sm text-gray-600 mt-1">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
