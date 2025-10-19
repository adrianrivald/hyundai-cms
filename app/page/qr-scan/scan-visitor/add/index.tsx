import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Typography } from "@/components/typography";
import StickyFooter from "@/components/layout/sticky-footer";
import { useLocation, useNavigate } from "react-router";
import {
  addVisitor,
  getParticipant,
  updateVisitor,
  useGetParticipant,
  useGetToursByDate,
} from "@/api/qr-scan";
import { format } from "date-fns";
import type { AddVisitor } from "../_functions/models/scan-visitor";

type VisitorForm = {
  name: string;
  dob: string;
  phone_number: string;
  email: string;
  sex: string;
  is_special_need: string;
  tour_number: string;
};

interface AddVisitorProps {
  id?: string;
}

export default function AddVisitor({ id }: AddVisitorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isUpdatePage = pathname.includes("/qr-scan/visitor-list/update");
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone_number: "",
    email: "",
    sex: "",
    is_special_need: "",
    tour_number: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VisitorForm, string>>
  >({});
  const today = format(new Date(), "yyyy-MM-dd");

  const { data } = useGetToursByDate(today);

  const handleChange = <K extends keyof VisitorForm>(
    field: K,
    value: VisitorForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof VisitorForm, string>> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value)
        newErrors[key as keyof VisitorForm] = "This field is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchVisitorList = async () => {
      await getParticipant(String(id)).then((res) => {
        const data = res.data;
        setVisitorId(data?.id);
        setFormData({
          name: data?.name,
          dob: data?.dob,
          phone_number: data?.phone_number,
          email: data?.email,
          sex: data?.sex,
          is_special_need: data?.is_special_need ? "yes" : "no",
          tour_number: data?.tour?.tour_number,
        });
      });
    };
    if (id) {
      fetchVisitorList();
    }
  }, [id]);

  const onSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      is_special_need: formData?.is_special_need === "yes" ? true : false,
    };

    try {
      if (id) {
        await updateVisitor({
          ...payload,
          id: Number(visitorId),
        });
      } else {
        await addVisitor(payload);
      }

      setTimeout(() => {
        navigate("/qr-scan/visitor-list", { state: { updated: true } });
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div
        className="relative w-full max-w-[768px] flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #153263, #00102B)",
        }}
      >
        {/* Header */}
        <div className="flex items-center px-6 pt-6 pb-4">
          <button
            onClick={() =>
              navigate(
                isUpdatePage ? "/qr-scan/visitor-list" : "/qr-scan/scan-visitor"
              )
            }
            className="cursor-pointer text-white"
          >
            <Icon icon="mdi:arrow-left" width={24} />
          </button>
          <Typography className="flex-1 text-center text-white text-lg font-semibold">
            {isUpdatePage ? "Detail Visitor" : "Add Visitor"}
          </Typography>
          <div className="w-6" /> {/* spacer to balance layout */}
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 mt-8">
          {/* Pilih Tour */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Group Name
            </Typography>
            <select
              value={formData.tour_number}
              onChange={(e) => handleChange("tour_number", e.target.value)}
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.tour_number ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">Choose Group</option>
              {data?.data?.map((d: any) => (
                <option value={d?.tour_number}>{d?.name}</option>
              ))}
            </select>
            {errors.tour_number && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.tour_number}
              </Typography>
            )}
          </div>

          {/* Nama Lengkap */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Full Name
            </Typography>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter full name"
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.name && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.name}
              </Typography>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Enter Date of Birth
            </Typography>
            <div className="relative">
              <Icon
                icon="mdi:calendar"
                width={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                placeholder="mm/dd/yyyy"
                className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 pl-10 pr-4 py-3 rounded-lg border ${
                  errors.dob ? "border-red-500" : "border-white/10"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => !e.target.value && (e.target.type = "text")}
              />
            </div>
            {errors.dob && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.dob}
              </Typography>
            )}
          </div>

          {/* Nomor HP */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Phone Number
            </Typography>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="Enter phone number"
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.phone_number ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.phone_number && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.phone_number}
              </Typography>
            )}
          </div>

          {/* Email */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Email Address
            </Typography>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.email}
              </Typography>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <Typography className="text-sm text-white mb-2">Gender</Typography>
            <select
              value={formData.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.sex ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">Choose gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.sex}
              </Typography>
            )}
          </div>

          {/* Difabel */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Special Needs
            </Typography>
            <select
              value={formData.is_special_need}
              onChange={(e) => handleChange("is_special_need", e.target.value)}
              className={`w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border ${
                errors.is_special_need ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">Choose special needs</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.is_special_need && (
              <Typography className="text-xs text-red-500 mt-1">
                {errors.is_special_need}
              </Typography>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 pb-8 mt-12">
          <button
            onClick={onSubmit}
            className="w-full bg-[#1E3A5F] hover:bg-[#274873] text-white text-base font-medium py-3 rounded-lg"
          >
            {isUpdatePage ? "Save" : "Add Visitor"}
          </button>
        </div>

        {/* Sticky Footer */}
        <StickyFooter activeItem="Scan Visitor" />
      </div>
    </div>
  );
}
