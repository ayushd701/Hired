import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getCreatedJobs } from "@/api/apijobs";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { isLoaded, user } = useUser();

  const {
    data: dataCreatedJobs,
    loading: loadingCreatedJobs,
    error: errorCreatedJobs,
    fn: fnCreatedJobs,
  } = useFetch(getCreatedJobs, { recruiter_id: user?.id });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (!isLoaded || loadingCreatedJobs) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }
  return (
    <div>
      {dataCreatedJobs?.length ? (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCreatedJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                onJobSaved={fnCreatedJobs}
                isMyJob
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-5 p-8 bg-transparent rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-gray-600">No Jobs Posted</h2>
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
