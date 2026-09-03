'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Star, MapPin } from 'lucide-react';

const universities = [
  {
    id: 1,
    name: 'University of Dhaka',
    shortName: 'DU',
    location: 'Dhaka',
    logo: '🎓',
    ranking: 1,
    match: 95,
    reason: 'Strong programs in Science and Humanities. Excellent faculty.',
    programs: ['Physics', 'English Literature', 'Sociology'],
  },
  {
    id: 2,
    name: 'BUET',
    shortName: 'BUET',
    location: 'Dhaka',
    logo: '⚙️',
    ranking: 2,
    match: 90,
    reason: 'Top engineering programs. High employability rate.',
    programs: ['Computer Science', 'Electrical Engineering', 'Civil Engineering'],
  },
  {
    id: 3,
    name: 'DUET',
    shortName: 'DUET',
    location: 'Gazipur',
    logo: '🏗️',
    ranking: 3,
    match: 85,
    reason: 'Good engineering programs with practical focus.',
    programs: ['Software Engineering', 'Mechanical Engineering'],
  },
  {
    id: 4,
    name: 'Medical University of Bangladesh',
    shortName: 'MUB',
    location: 'Dhaka',
    logo: '⚕️',
    ranking: 4,
    match: 88,
    reason: 'Premier medical institution. High quality curriculum.',
    programs: ['Medicine', 'Nursing', 'Health Sciences'],
  },
  {
    id: 5,
    name: 'JUST',
    shortName: 'JUST',
    location: 'Jessore',
    logo: '🔬',
    ranking: 5,
    match: 80,
    reason: 'Strong science programs. Good campus life.',
    programs: ['Chemistry', 'Physics', 'Environmental Science'],
  },
];

export default function RecommendationsPage() {
  const [hscMarks, setHscMarks] = useState<number | ''>('');
  const [preferences, setPreferences] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleGetRecommendations = () => {
    const marks = typeof hscMarks === 'number' ? hscMarks : 0;
    if (!marks || marks < 0 || marks > 100) {
      alert('Please enter valid HSC marks');
      return;
    }

    // Simple matching algorithm
    const matchPercentage = Math.min((marks / 100) * 100, 100);
    const filtered = universities
      .map((uni: any) => ({
        ...uni,
        match: Math.round(matchPercentage * (0.7 + Math.random() * 0.3)),
      }))
      .sort((a: any, b: any) => b.match - a.match);

    setResults(filtered);
    setSubmitted(true);
  };

  const reset = () => {
    setHscMarks('');
    setPreferences('');
    setResults([]);
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!submitted ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Get Personalized Recommendations</h1>
              <p className="text-muted-foreground">
                Tell us about your academic performance and preferences to get tailored university recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Your Information</h2>

                <div className="space-y-6">
                  {/* HSC Marks */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      HSC Total Marks
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={hscMarks}
                      onChange={(e) => setHscMarks(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="Enter your HSC marks"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Study Interests
                    </label>
                    <textarea
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="E.g., Engineering, Medicine, Business, Arts"
                      rows={4}
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    onClick={handleGetRecommendations}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    Get Recommendations
                  </Button>
                </div>
              </div>

              {/* Info Box */}
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                  <p className="text-sm text-muted-foreground">
                    We analyze your marks and interests to match you with universities that align with your academic profile and career goals.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Featured Universities</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {universities.slice(0, 5).map((uni) => {
                      const isImage = uni.logo && (uni.logo.startsWith('http') || uni.logo.startsWith('/'));
                      return (
                        <li key={uni.id} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex items-center justify-center overflow-hidden shrink-0">
                            {isImage ? (
                              <img src={uni.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <span>{uni.logo || '🏛️'}</span>
                            )}
                          </span>
                          <span>{uni.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={reset}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Recommended Universities</h1>
              <p className="text-muted-foreground">
                Based on your marks, these universities are the best match for you
              </p>
            </div>

            <div className="grid gap-6">
              {results.map((uni) => (
                <div
                  key={uni.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
                >
                  <div className="flex items-start gap-6">
                    {/* University Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                              {uni.logo && (uni.logo.startsWith('http') || uni.logo.startsWith('/')) ? (
                                <img
                                  src={uni.logo}
                                  alt={uni.name}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                                    }
                                  }}
                                />
                              ) : null}
                              <span className={`${uni.logo && (uni.logo.startsWith('http') || uni.logo.startsWith('/')) ? 'hidden' : 'block'} text-3xl`}>
                                {uni.logo || '🏛️'}
                              </span>
                            </span>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {uni.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {uni.location}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-primary text-primary" />
                            <span className="text-lg font-semibold text-foreground">
                              {uni.ranking}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Top University</p>
                        </div>
                      </div>

                      {/* Match Percentage */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Match Score</span>
                          <span className="text-sm font-semibold text-primary">{uni.match}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${uni.match}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Reason */}
                      <p className="text-sm text-muted-foreground mb-4">{uni.reason}</p>

                      {/* Programs */}
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Popular Programs:</p>
                        <div className="flex flex-wrap gap-2">
                          {uni.programs.map((prog: string) => (
                            <span
                              key={prog}
                              className="text-xs bg-secondary text-foreground px-3 py-1 rounded-full"
                            >
                              {prog}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      <Link href={`/universities/${uni.shortName.toLowerCase()}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={reset} variant="outline">
                Get Different Recommendations
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
