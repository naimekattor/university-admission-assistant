'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import { AnimatedCard } from '@/components/ui/animated-card';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-accent/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">📚</div>
            <span className="text-xl font-bold text-foreground">EduGuide</span>
          </div>
          <Link href="/chat">
            <Button className="bg-primary hover:bg-primary/80 text-white shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Gradient Background */}
      <section className="relative pt-40 pb-20 px-4 min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Green gradient with texture effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-green-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance drop-shadow-lg">
            Find Your Perfect University
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-12 text-balance drop-shadow-md">
            Get personalized university recommendations and guidance for Bangladesh admissions with our AI-powered advisor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <BorderBeamButton size="lg" variant="primary" className="bg-white text-green-700 border-2 border-green-500 shadow-xl">
                Start Chatting <ArrowRight className="w-5 h-5" />
              </BorderBeamButton>
            </Link>
            <Link href="/eligibility">
              <BorderBeamButton size="lg" variant="outline" className="text-white border-2 border-white hover:bg-white/20">
                Check Eligibility
              </BorderBeamButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            How EduGuide Helps You
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <AnimatedCard delay={0.1} borderBeam className="bg-white p-8 rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI Chat Advisor</h3>
              <p className="text-muted-foreground">
                Ask any question about universities, programs, and the admission process. Our AI advisor provides instant, personalized responses.
              </p>
            </AnimatedCard>

            {/* Feature 2 */}
            <AnimatedCard delay={0.2} borderBeam className="bg-white p-8 rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition shadow-md">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Eligibility Checker</h3>
              <p className="text-muted-foreground">
                Check if you meet the requirements for your desired programs. Get detailed information about cutoff marks and prerequisites.
              </p>
            </AnimatedCard>

            {/* Feature 3 */}
            <AnimatedCard delay={0.3} borderBeam className="bg-white p-8 rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized university and program recommendations based on your marks, interests, and preferences.
              </p>
            </AnimatedCard>

            {/* Feature 4 */}
            <AnimatedCard delay={0.4} borderBeam className="bg-white p-8 rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Compare Programs</h3>
              <p className="text-muted-foreground">
                Side-by-side comparison of universities and programs. Make informed decisions with detailed program information.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg border-2 border-green-200 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">6+</div>
              <p className="text-muted-foreground font-semibold">Top Universities</p>
            </div>
            <div className="p-6 bg-white rounded-lg border-2 border-green-200 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">30+</div>
              <p className="text-muted-foreground font-semibold">Study Programs</p>
            </div>
            <div className="p-6 bg-white rounded-lg border-2 border-green-200 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-muted-foreground font-semibold">AI Support</p>
            </div>
            <div className="p-6 bg-white rounded-lg border-2 border-green-200 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-muted-foreground font-semibold">Free to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-green-500 opacity-95"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Find Your University?
          </h2>
          <p className="text-lg text-white/90 mb-8 drop-shadow-md">
            Start your admission journey with EduGuide. Chat with our AI advisor today and get personalized guidance.
          </p>
          <Link href="/chat">
            <BorderBeamButton size="lg" variant="primary" className="bg-white text-green-700 border-2 border-green-500 shadow-xl">
              Start Chatting Now <ArrowRight className="w-5 h-5" />
            </BorderBeamButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">EduGuide</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered university admission guidance for Bangladesh students.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/chat" className="hover:text-primary">AI Chat</Link></li>
                <li><Link href="/eligibility" className="hover:text-primary">Eligibility</Link></li>
                <li><Link href="/recommendations" className="hover:text-primary">Recommendations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Universities</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/universities" className="hover:text-primary">Browse All</Link></li>
                <li><Link href="/universities/du" className="hover:text-primary">University of Dhaka</Link></li>
                <li><Link href="/universities/buet" className="hover:text-primary">BUET</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EduGuide. All rights reserved.</p>
            <Link href="/admin/upload" className="inline-block mt-2 text-xs text-muted-foreground/50 hover:text-primary">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
