import { useState } from "react";
import { Icon } from "@iconify/react";
import { Typography } from "@/components/typography";
import StickyFooter from "@/components/layout/sticky-footer";
import { useNavigate } from "react-router";
import { addVisitor, useGetToursByDate } from "@/api/qr-scan";
import { format } from "date-fns";

type VisitorForm = {
  name: string;
  dob: string;
  phone_number: string;
  email: string;
  sex: string;
  is_special_need: string;
  tour_number: string;
};

export default function AddVisitor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone_number: "",
    email: "",
    sex: "",
    is_special_need: "",
    tour_number: "",
  });
  const today = format(new Date(), "yyyy-MM-dd");

  const { data } = useGetToursByDate(today);

  const handleChange = <K extends keyof VisitorForm>(
    field: K,
    value: VisitorForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    const payload = {
      ...formData,
      is_special_need: formData?.is_special_need === "yes" ? true : false,
    };

    const res = await addVisitor(payload);

    setTimeout(() => {
      navigate("/qr-scan/visitor-list");
    }, 1000);
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
            onClick={() => navigate("/qr-scan/scan-visitor")}
            className="cursor-pointer text-white"
          >
            <Icon icon="mdi:arrow-left" width={24} />
          </button>
          <Typography className="flex-1 text-center text-white text-lg font-semibold">
            Tambah Visitor
          </Typography>
          <div className="w-6" /> {/* spacer to balance layout */}
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 mt-8">
          <div>
            <Typography className="text-sm text-white mb-2">
              Pilih Tour Number
            </Typography>
            <select
              value={formData.tour_number}
              onChange={(e) => handleChange("tour_number", e.target.value)}
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Pilih tour number</option>
              {data?.data?.map((d: any) => (
                <option value={d?.tour_number}>{d?.tour_number}</option>
              ))}
            </select>
          </div>
          {/* Nama Lengkap */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Nama Lengkap
            </Typography>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masukan nama lengkap peserta"
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Masukan tanggal dan tahun lahir
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
                className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => !e.target.value && (e.target.type = "text")}
              />
            </div>
          </div>

          {/* Nomor HP */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Nomor HP
            </Typography>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="Masukan nomor HP"
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Alamat Email
            </Typography>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Masukan alamat email"
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Jenis Kelamin
            </Typography>
            <select
              value={formData.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          {/* Difabel */}
          <div>
            <Typography className="text-sm text-white mb-2">
              Berkebutuhan khusus? (Difabel)
            </Typography>
            <select
              value={formData.is_special_need}
              onChange={(e) => handleChange("is_special_need", e.target.value)}
              className="w-full bg-white text-[#9A9A9A] placeholder:text-gray-400 px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Pilih kebutuhan anda</option>
              <option value="yes">Ya</option>
              <option value="no">Tidak</option>
            </select>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 pb-8 mt-12">
          <button
            onClick={onSubmit}
            className="w-full bg-[#1E3A5F] hover:bg-[#274873] text-white text-base font-medium py-3 rounded-lg"
          >
            Tambah Visitor
          </button>
        </div>

        {/* Sticky Footer (if needed globally) */}
        <StickyFooter activeItem="Scan Visitor" />
      </div>
    </div>
  );
}
