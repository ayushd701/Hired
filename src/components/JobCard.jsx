import { useUser } from "@clerk/clerk-react";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { saveJob } from "@/api/apijobs";
import useFetch from "@/hooks/use-fetch";
import { deleteMyJobs } from "@/api/apijobs";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const { user } = useUser();

  const [saved, setSaved] = React.useState(savedInit);

  const {
    data: savedJobs,
    loading: loadingSavedJobs,
    error: errorSavedJobs,
    fn: fnSavedJobs,
  } = useFetch(saveJob, { alreadySaved: saved });

  React.useEffect(() => {
    if (savedJobs !== undefined) setSaved(savedJobs?.length > 0);
  }, [savedJobs]);

  const handleSaveJob = async () => {
    await fnSavedJobs({ user_id: user.id, job_id: job.id });
    onJobSaved();
  };


  const {
    data: deleteJob,
    loading: loadingDeleteJob,
    error: errorDeleteJob,
    fn: fnDeleteJob,
  } = useFetch(deleteMyJobs, { job_id: job.id });

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  return (
    <Card className="h-[320px] flex flex-col justify-between">
      {loadingDeleteJob && (
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      )}
      <CardHeader className="pb-2 flex justify-between items-center">
        <CardTitle className="font-bold text-base line-clamp-1 truncate">
          {job.title}
        </CardTitle>
        {isMyJob && (
          <Trash2Icon
            fill="red"
            size={18}
            className="text-red-300 cursor-pointer flex-shrink-0"
            onClick={handleDeleteJob}
          />
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1 text-sm">
        <div className="flex justify-between items-center">
          {job.company && (
            <img src={job.company.logo_url} alt="logo" className="h-4 sm:h-6" />
          )}
          <div className="flex gap-1 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        <p className="line-clamp-3">
          {job.description.substring(0, job.description.indexOf(".") + 1)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            onClick={handleSaveJob}
            variant="outline"
            className="w-15"
            disabled={loadingSavedJobs}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
