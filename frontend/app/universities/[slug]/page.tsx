'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Globe, BookOpen } from 'lucide-react';

interface UniversityData {
  name: string;
  logo: string;
  location: string;
  founded: number;
  students: number;
  programs: number;
  cutoff: number;
  website: string;
  description: string;
  overview: string;
  programList: string[];
  admissionProcess: string[];
  fees: { undergrad: string; postgrad: string };
  facilities: string[];
}

const universitiesData: Record<string, UniversityData> = {
  du: {
    name: 'University of Dhaka',
    logo: '🎓',
    location: 'Dhaka, Bangladesh',
    founded: 1921,
    students: 30000,
    programs: 45,
    cutoff: 80,
    website: 'https://www.du.ac.bd',
    description:
      'University of Dhaka, founded in 1921, is the oldest and most prestigious university in Bangladesh. With a strong legacy of academic excellence and research, it offers diverse programs across sciences, humanities, and social sciences.',
    overview: `The University of Dhaka has been at the forefront of education and research in Bangladesh for over a century. With multiple faculties and departments, it provides comprehensive education at undergraduate and postgraduate levels.`,
    programList: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'English Literature',
      'History',
      'Sociology',
      'Economics',
      'Philosophy',
      'Law',
      'Medicine',
    ],
    admissionProcess: [
      'Apply online through the university portal',
      'Take admission test in relevant subjects',
      'Merit-based admission',
      'Complete documentation process',
    ],
    fees: {
      undergrad: 'BDT 10,000 - 50,000 per semester',
      postgrad: 'BDT 20,000 - 100,000 per semester',
    },
    facilities: [
      'Modern library with 500,000+ books',
      'Computer labs and IT facilities',
      'Sports complex',
      'Hostel facilities',
      'Health center',
      'Cafeteria and dining',
    ],
  },
  buet: {
    name: 'Bangladesh University of Engineering and Technology',
    logo: '⚙️',
    location: 'Dhaka, Bangladesh',
    founded: 1912,
    students: 5000,
    programs: 12,
    cutoff: 85,
    website: 'https://www.buet.ac.bd',
    description:
      'BUET is the premier engineering university in Bangladesh, established in 1912. Known for producing world-class engineers and researchers.',
    overview: `BUET offers comprehensive engineering education with emphasis on research, innovation, and industry collaboration. The university maintains high academic standards and produces engineers who excel globally.`,
    programList: [
      'Civil Engineering',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Chemical Engineering',
      'Computer Science & Engineering',
      'Electronics & Telecommunication',
    ],
    admissionProcess: [
      'Write admission entrance exam',
      'Merit-based selection',
      'Interview (if required)',
      'Enrollment and registration',
    ],
    fees: {
      undergrad: 'BDT 5,000 - 30,000 per semester',
      postgrad: 'BDT 15,000 - 80,000 per semester',
    },
    facilities: [
      'State-of-the-art laboratories',
      'Engineering workshop',
      'Research centers',
      'Library with technical resources',
      'Sports and recreational facilities',
      'Student hostels',
    ],
  },
  duet: {
    name: 'Dhaka University of Engineering & Technology',
    logo: '🏗️',
    location: 'Gazipur, Bangladesh',
    founded: 1999,
    students: 4000,
    programs: 10,
    cutoff: 78,
    website: 'https://www.duet.ac.bd',
    description:
      'DUET is a leading engineering university focusing on practical engineering education and industry partnerships.',
    overview: `Founded in 1999, DUET has established itself as a premier engineering institution with a focus on practical application and student-centered learning.`,
    programList: [
      'Software Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Electronics Engineering',
    ],
    admissionProcess: [
      'Apply online',
      'Pass entrance examination',
      'Merit list publication',
      'Registration and enrollment',
    ],
    fees: {
      undergrad: 'BDT 8,000 - 40,000 per semester',
      postgrad: 'BDT 18,000 - 90,000 per semester',
    },
    facilities: [
      'Modern classrooms',
      'Computer laboratories',
      'Library',
      'Hostel facilities',
      'Sports complex',
      'Cafeteria',
    ],
  },
};

export default function UniversityDetailsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const uni = universitiesData[slug];

  const [activeTab, setActiveTab] = useState('overview');

  if (!uni) {
    return (
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/universities" className="flex items-center gap-2 hover:opacity-80">
              <ChevronLeft className="w-5 h-5" />
              Back to Universities
            </Link>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">University not found</h1>
          <Link href="/universities">
            <Button className="bg-primary hover:bg-primary/90">Browse Universities</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back navigation */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <Link href="/universities" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#FF5500] transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Universities</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-primary/10 border-b border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-6xl">{uni.logo}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{uni.name}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" /> {uni.location}
              </p>
              <p className="text-foreground mb-6">{uni.description}</p>
              <a href={uni.website} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Founded</div>
              <div className="text-2xl font-bold text-primary">{uni.founded}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Students</div>
              <div className="text-2xl font-bold text-primary">{uni.students.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Programs</div>
              <div className="text-2xl font-bold text-primary">{uni.programs}+</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">HSC Cutoff</div>
              <div className="text-2xl font-bold text-accent">{uni.cutoff}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Rank</div>
              <div className="text-2xl font-bold text-primary">Top in BD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
          {['overview', 'programs', 'admission', 'fees', 'facilities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                <p className="text-foreground leading-relaxed">{uni.overview}</p>
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Study Programs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {uni.programList.map((prog) => (
                  <div key={prog} className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">{prog}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admission' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Admission Process</h2>
              <ol className="space-y-4">
                {uni.admissionProcess.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground flex-shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-foreground">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Tuition Fees</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-secondary rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Undergraduate</p>
                  <p className="text-2xl font-bold text-primary">{uni.fees.undergrad}</p>
                </div>
                <div className="p-6 bg-secondary rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Postgraduate</p>
                  <p className="text-2xl font-bold text-primary">{uni.fees.postgrad}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Campus Facilities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {uni.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    <span className="text-foreground">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Interested in This University?</h2>
          <p className="text-muted-foreground mb-6">
            Chat with our AI advisor to learn more or check your eligibility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Ask AI Advisor
              </Button>
            </Link>
            <Link href="/eligibility">
              <Button variant="outline">Check Eligibility</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
