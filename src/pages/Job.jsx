import { getSingleJob } from "@/api/apijobs";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { data, useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useSession } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPin } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    data: dataJob,
    loading: loadingJob,
    error: errorJob,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { session } = useSession();

  React.useEffect(() => {
    if (isLoaded && session) {
      fnJob();
    }
  }, [isLoaded, session]);

  console.log(dataJob);

  if (!isLoaded || loadingJob) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl  pb-3">
          {dataJob?.title}
        </h1>
        <img
          src={dataJob?.company?.logo_url}
          alt="Company logo"
          className="h-12"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPin />
          {dataJob?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {dataJob?.applications?.length} applicants
        </div>
        <div className="flex gap-2">
          {dataJob?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{dataJob?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown source={dataJob?.requirements} className="!bg-transparent sm:text-lg"/>
    </div>
  );
};

export default Job;
