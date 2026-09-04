import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community & Student Q&A | EduGuide Bangladesh',
  description:
    'Ask admission circular questions, Higher Mathematics calculus problems, Physics, Chemistry, and get step-by-step solutions from seniors, educators, and peers.',
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
