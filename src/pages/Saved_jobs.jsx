import React, { useEffect } from "react";
import { getSavedJobs } from "@/api/apijobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";


const Saved_jobs = () => {
  const { isLoaded, user } = useUser();
  const {
    data: savedData,
    loading: loadingSaved,
    error: errorSaved,
    fn: fnSaved,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSaved();
    }
  }, [isLoaded]);

  if (savedData?.length > 0) {
    console.log(savedData);
  }

  if (!isLoaded || loadingSaved) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>
      {loadingSaved === false && (
        <div>
          {savedData?.length ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedData.map((saved) => {
                return (
                  <JobCard
                    key={saved.id}
                    job={saved.job}
                    savedInit={true}
                    onJobSaved={fnSaved}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-5 p-8 bg-transparent rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-gray-600">
                No Saved Jobs Found
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Saved_jobs;
