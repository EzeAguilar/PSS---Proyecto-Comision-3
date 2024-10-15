import {Suspense} from "react";
import PatientsPage from "@/app/components/ui/patientsClientComponent";
import {Patient} from "@/app/lib/utils";
import { fetchFilteredPatients, fetchPatientPages } from "../lib/data";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchPatientPages(query);
  const patients: Patient[] = await fetchFilteredPatients(query, currentPage);
  
  return (
    <>
        <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
          <PatientsPage pacientes={patients} pages={totalPages}/>
        </Suspense>      
    </>
  );
}