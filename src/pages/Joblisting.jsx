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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { State , City } from "country-state-city";

const Joblisting = () => {
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setsearchQuery] = useState("");

  const { isLoaded } = useUser();

  const { session } = useSession();
  const {
    data: dataJobs,
    loading: loadingJobs,
    error: errorJobs,
    fn: fnJobs,
  } = useFetch(getJobs, { location: city, company_id, searchQuery });

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
  }, [isLoaded, session, city, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded && session) {
      fnCompanies();
    }
  }, [isLoaded, session]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formdata = new FormData(e.target);
    const query = formdata.get("search-query");
    if (query !== "") {
      setsearchQuery(query);
    }
  };

  const clearFilters = () => {
    setCompany_id("");
    setStateCode("");
    setCity("");
    setsearchQuery("");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil((dataJobs?.length || 0) / itemsPerPage);

  const paginatedJobs = dataJobs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

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

      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-4 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search by job title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" variant="blue" className="h-full sm:w-28 ">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="w-full sm:w-[30%]">
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              {dataCompanies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[15%]">
          <Select
            value={stateCode}
            onValueChange={(code) => {
              setStateCode(code);
              setCity("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              {State.getStatesOfCountry("IN")?.map(({ isoCode, name }) => (
                <SelectItem key={isoCode} value={isoCode}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {stateCode && (
          <div className="w-full sm:w-[15%]">
            <Select value={city} onValueChange={(val) => setCity(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                {City.getCitiesOfState("IN", stateCode)?.map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={clearFilters}
          variant="destructive"
          className="w-full sm:w-[30%]"
        >
          Clear filters
        </Button>
      </div>

      {loadingJobs && (
        <div className="flex justify-center items-center h-screen">
          <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
        </div>
      )}

      {loadingJobs === false && (
        <div>
          {paginatedJobs?.length ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedJobs.map((job) => {
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedInit={job?.saved?.length > 0}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-5 p-8 bg-transparent rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-gray-600">
                No Jobs Found
              </h2>
              <p className="text-gray-500 mt-2">
                Try changing your filters or check back later.
              </p>
            </div>
          )}
        </div>
      )}

      <Pagination className="mt-8 justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => goToPage(index + 1)}
                isActive={currentPage === index + 1}
                href="#"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Joblisting;
