'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Users, Calendar, ExternalLink, Search } from 'lucide-react';

const universities = [
  {
    id: 1,
    name: 'University of Dhaka',
    shortName: 'du',
    location: 'Dhaka',
    logo: '🎓',
    ranking: 1,
    founded: 1921,
    students: 30000,
    programs: 45,
    description: 'The oldest and most prestigious university in Bangladesh, founded in 1921.',
    admission: 'merit',
    cutoff: 80,
  },
  {
    id: 2,
    name: 'BUET',
    shortName: 'buet',
    location: 'Dhaka',
    logo: '⚙️',
    ranking: 2,
    founded: 1912,
    students: 5000,
    programs: 12,
    description: 'Premier engineering university offering world-class engineering education.',
    admission: 'merit',
    cutoff: 85,
  },
  {
    id: 3,
    name: 'DUET',
    shortName: 'duet',
    location: 'Gazipur',
    logo: '🏗️',
    ranking: 3,
    founded: 1999,
    students: 4000,
    programs: 10,
    description: 'Leading engineering university with modern facilities and industry partnerships.',
    admission: 'merit',
    cutoff: 78,
  },
  {
    id: 4,
    name: 'Medical University of Bangladesh',
    shortName: 'mub',
    location: 'Dhaka',
    logo: '⚕️',
    ranking: 4,
    founded: 1998,
    students: 2000,
    programs: 5,
    description: 'Premier medical institution with state-of-the-art facilities and research centers.',
    admission: 'merit',
    cutoff: 90,
  },
  {
    id: 5,
    name: 'JUST',
    shortName: 'just',
    location: 'Jessore',
    logo: '🔬',
    ranking: 5,
    founded: 2001,
    students: 8000,
    programs: 20,
    description: 'Science and technology focused university with emphasis on practical learning.',
    admission: 'merit',
    cutoff: 70,
  },
  {
    id: 6,
    name: 'Independent University Bangladesh',
    shortName: 'iub',
    location: 'Dhaka',
    logo: '📚',
    ranking: 10,
    founded: 1993,
    students: 3500,
    programs: 30,
    description: 'Private university offering diverse programs with modern curriculum.',
    admission: 'merit',
    cutoff: 65,
  },
];

export default function UniversitiesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  const filtered = universities.filter((uni: any) =>
    uni.name.toLowerCase().includes(search.toLowerCase()) ||
    uni.shortName.toLowerCase().includes(search.toLowerCase())
  );

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
            <Link href="/eligibility" className="text-muted-foreground hover:text-foreground">
              Eligibility
            </Link>
            <Link href="/recommendations" className="text-muted-foreground hover:text-foreground">
              Recommendations
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Universities in Bangladesh</h1>
          <p className="text-muted-foreground">
            Explore {universities.length}+ universities and their programs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filtered.length} of {universities.length} universities
        </p>

        {/* Universities Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((uni) => (
              <Link key={uni.id} href={`/universities/${uni.shortName}`}>
                <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{uni.logo}</div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">Rank #{uni.ranking}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{uni.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" /> {uni.location}
                  </p>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {uni.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Founded
                      </span>
                      <span className="font-medium text-foreground">{uni.founded}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> Students
                      </span>
                      <span className="font-medium text-foreground">{uni.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Programs</span>
                      <span className="font-medium text-foreground">{uni.programs}+</span>
                    </div>
                  </div>

                  {/* Cutoff Badge */}
                  <div className="mb-4 p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">HSC Cutoff Marks</p>
                    <p className="text-lg font-bold text-primary">{uni.cutoff}</p>
                  </div>

                  {/* Learn More */}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                    Learn More
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No universities found matching your search</p>
            <Button
              onClick={() => setSearch('')}
              variant="outline"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
