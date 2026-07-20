'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { checkEligibility, getEligibleUniversities, type StudentProfile, universitiesDepartments } from '@/lib/services/eligibility-engine';

const REQUIRED_SUBJECTS = {
  'Physics': ['Physics'],
  'Chemistry': ['Chemistry'],
  'Biology': ['Biology'],
  'Math': ['Math'],
  'English': ['English'],
};

export default function EligibilityPage() {
  const [sscGPA, setSscGPA] = useState<number | ''>('');
  const [hscGPA, setHscGPA] = useState<number | ''>('');
  const [group, setGroup] = useState<'Science' | 'Commerce' | 'Humanities'>('Science');
  const [passingYear, setPassingYear] = useState<number>(2024);
  const [results, setResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    const sscVal = typeof sscGPA === 'number' ? sscGPA : 0;
    const hscVal = typeof hscGPA === 'number' ? hscGPA : 0;
    
    if (!sscVal || sscVal < 0 || sscVal > 5) {
      alert('Please enter valid SSC GPA (0-5)');
      return;
    }
    
    if (!hscVal || hscVal < 0 || hscVal > 5) {
      alert('Please enter valid HSC GPA (0-5)');
      return;
    }

    const student: StudentProfile = {
      sscGPA: sscVal,
      hscGPA: hscVal,
      group,
      passingYear,
    };

    const eligible = getEligibleUniversities(student);
    setResults(eligible);
    setSubmitted(true);
  };

  const reset = () => {
    setSscGPA('');
    setHscGPA('');
    setGroup('Science');
    setPassingYear(2024);
    setResults([]);
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="text-2xl">🎓</div>
            <span className="font-bold text-foreground">EduGuide</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/chat" className="text-muted-foreground hover:text-foreground">
              Chat
            </Link>
            <Link href="/recommendations" className="text-muted-foreground hover:text-foreground">
              Recommendations
            </Link>
            <Link href="/universities" className="text-muted-foreground hover:text-foreground">
              Universities
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!submitted ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Check Your Eligibility</h1>
              <p className="text-muted-foreground">
                Enter your HSC marks and subjects to see which programs you&apos;re eligible for
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              {/* SSC GPA Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  SSC GPA (0-5)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.01"
                  value={sscGPA}
                  onChange={(e) => setSscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Enter your SSC GPA"
                  className="bg-background border-border"
                />
              </div>

              {/* HSC GPA Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  HSC GPA (0-5)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.01"
                  value={hscGPA}
                  onChange={(e) => setHscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Enter your HSC GPA"
                  className="bg-background border-border"
                />
              </div>

              {/* Group Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  HSC Group
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as 'Science' | 'Commerce' | 'Humanities')}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                >
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities</option>
                </select>
              </div>

              {/* Passing Year */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Passing Year
                </label>
                <Input
                  type="number"
                  value={passingYear}
                  onChange={(e) => setPassingYear(parseInt(e.target.value))}
                  className="bg-background border-border"
                />
              </div>

              {/* Check Button */}
              <BorderBeamButton
                onClick={handleCheck}
                variant="primary"
                className="w-full"
                size="lg"
              >
                Check Eligibility
              </BorderBeamButton>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <button
                onClick={reset}
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-4xl font-bold text-foreground mb-2">Your Eligibility Results</h1>
              <p className="text-muted-foreground">
                Showing eligible programs for {group} group with SSC {sscGPA} & HSC {hscGPA}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((dept, idx) => (
                  <AnimatedCard key={dept.id} delay={idx * 0.1} borderBeam className="bg-card border-2 border-green-200 rounded-lg p-6 hover:border-green-500 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {dept.university} - {dept.program}
                            </h3>
                            <p className="text-sm text-muted-foreground">{dept.department}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Min GPA: </span>
                            <span className="font-medium text-foreground">{dept.minGPA}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Your Avg: </span>
                            <span className="font-medium text-accent">{(((sscGPA as number) + (hscGPA as number)) / 2).toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Seats: </span>
                            <span className="font-medium text-foreground">{dept.seats}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Fee: {dept.admissionFee} TK
                          </span>
                        </div>
                      </div>
                      <Link href={`/universities/${dept.university.toLowerCase()}`} className="ml-4">
                        <BorderBeamButton variant="secondary" size="sm">
                          View Details
                        </BorderBeamButton>
                      </Link>
                    </div>
                  </AnimatedCard>
                ))}
                <BorderBeamButton onClick={reset} variant="outline" className="w-full">
                  Check Again
                </BorderBeamButton>
              </div>
            ) : (
              <div className="bg-card border-2 border-border rounded-lg p-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No Matching Programs
                </h2>
                <p className="text-muted-foreground mb-8">
                  Based on your marks and subjects, you don&apos;t meet the requirements for the programs in our database. 
                  However, there may be other options available. Try our chat advisor for more guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <BorderBeamButton onClick={reset} variant="outline">
                    Try Different Marks
                  </BorderBeamButton>
                  <Link href="/chat">
                    <BorderBeamButton variant="primary">
                      Ask Chat Advisor
                    </BorderBeamButton>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
