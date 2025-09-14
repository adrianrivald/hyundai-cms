import { Typography } from "@/components/typography";
import useUser from "@/hooks/use-user";

interface StickyHeaderProps {
  userName?: string;
  userImage?: string;
}

export default function StickyHeader({
  userImage = "/images/people.webp",
}: StickyHeaderProps) {
  const user = useUser();
  return (
    <div className="sticky z-20 top-0 left-0 right-0 flex justify-between px-7 py-3 gap-2 bg-opacity-50 backdrop-blur-md bg-[#153263]">
      <div className="flex flex-row justify-between items-center w-full">
        <img
          src="/images/logo-hyundai.webp"
          height={23}
          width={51}
          className="object-contain"
        />
        <div className="flex flex-row gap-3 items-center">
          <Typography className="text-sm font-bold text-white">
            {user?.name}
          </Typography>
          <img
            src={userImage}
            height={27}
            width={27}
            className="object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
