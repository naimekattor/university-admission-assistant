import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchQuestionBySlug } from '@/lib/community-service';
import { QuestionDetailView } from '@/components/community/question-detail-view';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchQuestionBySlug(slug);
  if (!data || !data.question) {
    return {
      title: 'Question | EduGuide Community',
    };
  }
  return {
    title: `${data.question.title} | EduGuide Community`,
    description: data.question.content
      ? data.question.content.substring(0, 160)
      : 'Student discussion and problem solving on EduGuide.',
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchQuestionBySlug(slug);

  if (!data || !data.question) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <QuestionDetailView initialData={data} />
    </div>
  );
}
