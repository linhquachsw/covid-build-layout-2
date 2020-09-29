import { PageLayout } from 'App/components/layout/pageLayout';
import { useRouter } from 'next/router';

const PatientReport = () => {
  const {
    query: { userId },
  } = useRouter();
  return (
    <PageLayout>
      <h1>PatientReport of userId: {userId} </h1>
    </PageLayout>
  );
};

export default PatientReport;
