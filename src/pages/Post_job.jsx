import React, { useEffect } from "react";
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
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { getCompanies } from "@/api/apicompanies";
import { useUser } from "@clerk/clerk-react";
import { useSession } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

const jobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a new company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const Post_job = () => {
  const { isLoaded, user } = useUser();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(jobSchema),
  });

  const {
    data: dataCompanies,
    loading: loadingCompanies,
    error: errorCompanies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }

  console.log(user);
  if (user?.unsafeMetadata?.role === "candidate") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  {State.getStatesOfCountry("IN")?.map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller name="requirements" control={control} render={({field}) => (
          <MDEditor value={field.value} onChange={field.onChange} />
        )}/>
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        <Button type="submit" variant="blue" size="lg" className="mt-2">Submit</Button>
      </form>
    </div>
  );
};

export default Post_job;
