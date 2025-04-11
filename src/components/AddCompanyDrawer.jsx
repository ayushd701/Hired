import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apicompanies";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const companySchema = z.object({
  name: z.string().min(1, { message: "Company name is required." }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(companySchema) });

  const {
    data: dataAddCompany,
    loading: loadingAddCompany,
    error: errorAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({ ...data, logo: data.logo[0] });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) fetchCompanies();
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new company</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input placeholder="Company name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <div className="flex items-center">
            <span className="text-sm mr-1">Upload logo (PNG, JPEG)</span>
            <Input
              type="file"
              accept="image/*"
              className="flex-1 file:text-gray-500"
              {...register("logo")}
            />
          </div>
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany ? (
            <div className="flex justify-center items-center">
              <BarLoader color="#36d7b7" width="100%" className="mb-4" />
            </div>
          ) : (
            <Button variant="destructive" type="submit" size="lg">
              Add
            </Button>
          )}
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
