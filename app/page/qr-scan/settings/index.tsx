import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";
import { enqueueSnackbar } from "notistack";
import { putUser, useGetUser } from "@/api/user";

export default function Settings() {
  const user = useUser();
  const { data } = useGetUser(String(user.id));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data?.data) {
      setName(data?.data?.name);
      setEmail(data?.data?.email);
    }
  }, [data?.data]);

  const onSubmit = async () => {
    const payload = {
      id: user.id,
      name,
      email,
    };

    try {
      await putUser(payload);

      enqueueSnackbar("Success save user", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save user", { variant: "error" });
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
        {/* Sticky Header */}
        <StickyHeader />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <div className="px-6 py-6">
            <Typography className="text-xl font-bold text-center text-white">
              Settings
            </Typography>
          </div>

          {/* Profile Section */}
          <div className="flex-1 px-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300">
                <img
                  src="/images/people.webp"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Name */}
              <Typography className="text-lg font-medium text-white">
                {data?.data?.name}
              </Typography>

              {/* Input Fields */}
              <div className="w-full space-y-6">
                {/* Phone Number Field */}
                <div className="space-y-2">
                  <Typography className="text-sm text-white">Name</Typography>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white text-[#9A9A9A] px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Typography className="text-sm text-white">
                    Email Address
                  </Typography>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-[#9A9A9A] px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 mt-12">
          <button
            onClick={onSubmit}
            className="w-full bg-[#1E3A5F] hover:bg-[#274873] text-white text-base font-medium py-3 rounded-lg"
          >
            Save
          </button>
        </div>

        {/* Sticky Footer */}
        <StickyFooter activeItem="Settings" />
      </div>
    </div>
  );
}
