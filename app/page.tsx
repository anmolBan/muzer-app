"use client"

import { Radio, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        {/* <Redirect/> */}
        <Navbar/>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2 max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500">
                      Let Your Fans Choose the Beat
                    </span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl text-sm">
                    Muzer: Where creators and fans collaborate on the perfect playlist for every stream.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button onClick={() => {
                    router.push("/dashboard");
                  }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold">
                    Get Started
                  </Button>
                  {/* <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0">
                    Learn More
                  </Button> */}
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Key Features
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                  <Users className="h-12 w-12 text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-400">Fan-Driven Playlists</h3>
                  <p className="text-sm text-gray-300 text-center">
                    Let your audience collaborate on your stream&apos;s soundtrack in real-time.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                  <Zap className="h-12 w-12 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-400">Live Interaction</h3>
                  <p className="text-sm text-gray-300 text-center">
                    Engage with your audience through music choices and create unforgettable streams.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-orange-500/20 hover:border-orange-500/50 transition-colors">
                  <Radio className="h-12 w-12 text-orange-400" />
                  <h3 className="text-xl font-bold text-orange-400">Seamless Integration</h3>
                  <p className="text-sm text-gray-300 text-center">
                    Works with your favorite streaming platforms and music services.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2 max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Ready to revolutionize your streams?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                    Join FanTune today and create unforgettable, interactive music experiences.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input 
                      className="max-w-lg flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                      placeholder="Enter your email" 
                      type="email" 
                    />
                    <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold">
                      Sign Up
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full py-6 bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/50">
          <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-xs text-gray-400">© 2024 FanTune. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-blue-400 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-blue-400 transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
