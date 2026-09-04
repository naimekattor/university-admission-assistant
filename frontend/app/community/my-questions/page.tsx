import React from 'react';
import { Metadata } from 'next';
import { CommunityFeed } from '@/components/community/community-feed';

export const metadata: Metadata = {
  title: 'My Questions | EduGuide Community',
  description: 'View questions you have asked in the EduGuide community.',
};

export default function MyQuestionsPage() {
  return (
    <CommunityFeed
      onlyMine={true}
      feedTitle="My Questions & Discussions"
      feedSubtitle="Track your posted problems, check for new answers, and mark helpful solutions as accepted."
    />
  );
}
