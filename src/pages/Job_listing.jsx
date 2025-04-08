import { getJobs } from "@/api/apijobs";
import { useSession } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import JobCard from "@/components/JobCard";
import { getCompanies } from "@/api/apicompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Job_listing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setsearchQuery] = useState("");

  const { isLoaded } = useUser();

  const { session } = useSession();
  const {
    data: dataJobs,
    loading: loadingJobs,
    error: errorJobs,
    fn: fnJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const {
    data: dataCompanies,
    loading: loadingCompanies,
    error: errorCompanies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded && session) {
      fnJobs();
    }
  }, [isLoaded, session, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded && session) {
      fnCompanies();
    }
  }, [isLoaded, session]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formdata = new FormData(e.target);
    const query = formdata.get("search-query");
    if(query !== "") {
      setsearchQuery(query);
    }
  }

  if (dataJobs?.length !== 0 && dataJobs !== undefined) {
    console.log("dataJobs", dataJobs);
  }

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
        Latest Jobs
      </h1>

      <form onSubmit={handleSearch} className="h-14 flex w-full gap-4 items-center mb-3">
        <Input type="text" placeholder="Search by job title..." name="search-query" className="h-full flex-1 px-4 text-md"/>
        <Button type="submit" variant="blue" className="h-full sm:w-28 ">Search</Button>
      </form>

      {loadingJobs && (
        <div className="flex justify-center items-center h-screen">
          <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
        </div>
      )}

      {loadingJobs === false && (
        <div>
          {dataJobs?.length ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataJobs.map((job) => {
                return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />;
              })}
            </div>
          ) : (
            <div>No jobs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Job_listing;
