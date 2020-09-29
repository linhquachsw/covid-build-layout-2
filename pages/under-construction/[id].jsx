// @flow
import React from 'react';
import { useRouter } from 'next/router';
import { type NextPage } from 'next';
import { PageLayout, type PageProps } from 'App/components/layout/pageLayout';
import { UnderConstruction } from 'App/components/under-contruction';

const MainPage: NextPage<PageProps> = () => {
  const {
    query: { id },
  } = useRouter();
  return (
    <PageLayout title="" className="bg-white flex-grow-1">
      <UnderConstruction title={`RE-${id}`} />
    </PageLayout>
  );
};

export default MainPage;
