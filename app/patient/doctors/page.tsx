'use client'

import { Button } from "@/app/components/ui/button";
import { searchDoctors, deleteDoctor, fetchAllDoctors } from "@/app/lib/data";
import { Doctor, PATH_OPTIONS } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DoctorsPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-3xl mr-44">Medicos</h1>
      </div>
    </div>
  );
}

export default DoctorsPage;