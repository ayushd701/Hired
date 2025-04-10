import { getSingleJob, updateHiringStatus } from "@/api/apijobs";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { data, useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPin } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    data: dataJob,
    loading: loadingJob,
    error: errorJob,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "Open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  React.useEffect(() => {
    if (isLoaded) {
      fnJob();
    }
  }, [isLoaded]);

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
      {dataJob?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              dataJob?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (dataJob?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{dataJob?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={dataJob?.requirements}
        className="!bg-transparent sm:text-lg"
      />
      {dataJob?.recruiter_id !== user?.id && 
      <ApplyJobDrawer job={dataJob} user={user} fetchJob= {fnJob} applied={dataJob?.applications?.some(app => app.candidate_id === user?.id)}  />
       }
    </div>
  );
};

export default Job;
