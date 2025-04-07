import { getJobs } from '@/api/apijobs';
import { useSession } from '@clerk/clerk-react';
import React from 'react';

const Job_listing = () => {
  const { session, isLoaded } = useSession();

  const fetchJobs = async () => {
    const supabaseaccesstoken = await session.getToken({
      template: 'supabase',
    });
    const data = await getJobs(supabaseaccesstoken); // pass token
    console.log(data);
  };

  React.useEffect(() => {
    if (isLoaded && session) {
      fetchJobs();
    }
  }, [isLoaded, session]);

  return (
    <div>
      Joblisting
    </div>
  );
};

export default Job_listing;

