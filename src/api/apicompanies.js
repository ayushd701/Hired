import { createSupabaseClientWithToken , supabaseUrl } from "@/utils/supabase";

export async function getCompanies(accessToken) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("*");

  if (companyError) {
    console.error("Error fetching companies", companyError);
    return null;
  }
  return companyData;
}

export async function addNewCompany(accessToken , _ , companyData) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const random = Math.floor(Math.random()*90000)
  const filename = `logo-${random}-${companyData.name}`

  const {error : storageError} = await supabase.storage.from("company-logo").upload(filename , companyData.logo)

  if (storageError) {
    console.error("Error uploading company logo", storageError);
    return null;
  }

  const logo_url =`${supabaseUrl}/storage/v1/object/public/company-logo//${filename}`

  const { data: addCompanyData, error: addCompanyError } = await supabase
    .from("companies")
    .insert([{name:companyData.name ,logo_url}])
    .select()

  if (addCompanyError) {
    console.error("Error adding new company", addCompanyError);
    return null;
  }
  return addCompanyData;
}

