import React from 'react';
import { Metadata } from 'next';
import { CommunityFeed } from '@/components/community/community-feed';

export const metadata: Metadata = {
  title: 'Saved Questions | EduGuide Community',
  description: 'View your bookmarked questions, problems, and circulars in the EduGuide community.',
};

export default function SavedQuestionsPage() {
  return (
    <CommunityFeed
      onlySaved={true}
      feedTitle="Saved Questions & Bookmarks"
      feedSubtitle="Quickly review formulas, step-by-step problem explanations, and admission questions you have bookmarked for later revision."
    />
  );
}
