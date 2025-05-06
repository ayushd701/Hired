import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { State, City } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { getCompanies } from "@/api/apicompanies";
import { useUser } from "@clerk/clerk-react";
import { useSession } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { addNewJob } from "@/api/apijobs";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";

const jobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a new company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const Postjob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(jobSchema),
  });

  const {
    data: dataCompanies,
    loading: loadingCompanies,
    error: errorCompanies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    data: dataNewJob,
    loading: loadingNewJob,
    error: errorNewJob,
    fn: fnNewJob,
  } = useFetch(addNewJob);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  const onSubmit = (data) => {
    setFormSubmitted(true);
    fnNewJob({ ...data, recruiter_id: user.id, isOpen: true });
  };

  useEffect(() => {
    if (dataNewJob?.length > 0) navigate("/jobs");
  }, [loadingNewJob]);

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }

  console.log(user);
  if (user?.unsafeMetadata?.role === "candidate") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">
          You’re currently signed in as a <strong>candidate</strong>. Only
          recruiter accounts can post jobs.
          <br />
          To post a job, please sign up or switch to a recruiter account.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen overflow-x-hidden px-4 sm:px-6 md:px-12">
      <h1 className="gradient-title font-extrabold text-3xl sm:text-5xl text-center pb-6 sm:pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-4xl mx-auto"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {formSubmitted && errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}
  
        <Textarea placeholder="Job Description" {...register("description")} />
        {formSubmitted && errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
  
        <div className="flex flex-col sm:flex-row gap-4">
          {/* State Select */}
          <Select
            value={selectedState}
            onValueChange={(value) => {
              setSelectedState(value);
              setValue("location", "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {State.getStatesOfCountry("IN")?.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          {/* City Select */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState &&
                    City.getCitiesOfState(
                      "IN",
                      State.getStatesOfCountry("IN").find(
                        (s) => s.name === selectedState
                      )?.isoCode
                    )?.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
  
        {/* Company Select */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by company">
                    {field.value
                      ? dataCompanies?.find((c) => c.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dataCompanies?.map(({ name, id }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
  
        {formSubmitted && errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {formSubmitted && errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
  
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <MDEditor
                value={field.value}
                onChange={field.onChange}
                textareaProps={{
                  placeholder: "Requirements...",
                  name: field.name,
                }}
              />
            </div>
          )}
        />
        {formSubmitted && errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
  
        {errorNewJob && <p className="text-red-500">{errorNewJob?.message}</p>}
  
        {loadingNewJob ? (
          <div className="flex justify-center items-center">
            <BarLoader color="#36d7b7" width="100%" className="mb-4" />
          </div>
        ) : (
          <Button variant="blue" type="submit" size="lg" className="mt-2">
            Submit
          </Button>
        )}
      </form>
    </div>
  );  
};

export default Postjob;
