"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { 
  PrescriptionPad, 
  MolecularStructure,
  Syringe,
  HeartPulse,
  MedicineBottle,
  Pills
} from "@/components/BackgroundElements";

interface Medication {
  id: number;
  name: string;
  description: string;
  dosage: string;
}

export default function EditMedicationPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dosage, setDosage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    fetchMedication();
  }, [id, router]);

  const fetchMedication = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.get(`http://localhost:8000/api/reminder/medications/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const medicationData = response.data;
      setMedication(medicationData);
      setName(medicationData.name);
      setDescription(medicationData.description || "");
      setDosage(medicationData.dosage);
    } catch (error) {
      console.error("Error fetching medication:", error);
      toast.error("خطا در دریافت اطلاعات دارو");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("لطفاً نام دارو را وارد کنید");
      return;
    }
    
    if (!dosage.trim()) {
      toast.error("لطفاً دوز مصرفی را وارد کنید");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      await axios.put(
        `http://localhost:8000/api/reminder/medications/${id}/`,
        {
          name,
          description,
          dosage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("دارو با موفقیت بروزرسانی شد");
      router.push(`/reminder/medications/${id}`);
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("خطا در بروزرسانی دارو");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pharma-container flex justify-center items-center">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen pharma-container flex justify-center items-center">
        <div className="text-center pharma-card p-8 rounded-lg animate-scaleUp">
          <div className="text-6xl mb-6 text-red-500">❌</div>
          <h2 className="pharma-title mb-4">دارو یافت نشد</h2>
          <Link
            href="/reminder"
            className="pharma-button-primary inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>بازگشت به لیست داروها</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pharma-container py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-900/10 opacity-60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1 0h2v20H1V0zm0 0v2h20V0H1z" fill="%230366D6" fill-opacity=".05"/%3E%3C/svg%3E")' }}>
      </div>

      {/* Pharmaceutical Background Elements */}
      <PrescriptionPad className="top-20 left-10 text-blue-500/10 hidden lg:block" size={160} />
      <MolecularStructure className="bottom-20 right-10 text-blue-500/10 hidden lg:block" size={180} />
      <Syringe className="top-1/3 right-[15%] text-blue-600/10 hidden lg:block" size={100} />
      <HeartPulse className="bottom-1/3 left-[15%] text-blue-600/10 hidden lg:block" size={90} />
      <MedicineBottle className="top-2/3 left-[5%] text-blue-500/10 hidden lg:block" size={80} />
      <Pills className="top-20 right-[20%] text-blue-500/10 hidden lg:block" size={70} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <Link href={`/reminder/medications/${id}`}>
            <button className="pharma-button py-2 px-4 ml-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>بازگشت</span>
            </button>
          </Link>
          <h1 className="pharma-title text-2xl">ویرایش دارو</h1>
        </div>

        <div className="pharma-card p-6 rounded-lg animate-scaleUp">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                نام دارو <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pharma-input w-full"
                placeholder="مثال: آموکسی‌سیلین"
                required
              />
            </div>

            <div>
              <label htmlFor="dosage" className="block text-sm font-medium mb-2">
                دوز مصرفی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="pharma-input w-full"
                placeholder="مثال: روزی دو عدد"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                توضیحات
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="pharma-input w-full"
                placeholder="توضیحات اضافی در مورد دارو..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 space-x-reverse pt-4">
              <Link
                href={`/reminder/medications/${id}`}
                className="pharma-button-secondary"
              >
                انصراف
              </Link>
              <button
                type="submit"
                className="pharma-button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 