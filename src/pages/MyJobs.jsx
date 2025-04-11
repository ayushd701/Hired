import React from "react";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";

const My_Jobs = () => {
  const { isLoaded, user } = useUser();
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate" ? "My Applications" : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? <CreatedApplications /> : <CreatedJobs />}
    </div>
  );
};

export default My_Jobs;
