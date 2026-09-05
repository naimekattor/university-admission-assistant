import React from 'react';
import { HomepageView } from '@/components/homepage/homepage-view';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/lib/homepage-types';

export default async function Homepage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const isPreview = searchParams?.preview === 'true';

  return (
    <HomepageView
      initialConfig={DEFAULT_HOMEPAGE_CONFIG}
      isPreview={isPreview}
    />
  );
}
