import { createSupabaseClientWithToken } from "@/utils/supabase";

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
