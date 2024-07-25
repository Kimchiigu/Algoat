import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";

interface GoBackProps {
  href: string;
}

export default function GoBack({ href }: GoBackProps) {
  return (
    <div className="absolute top-5 left-5 z-[1000]">
      <Link href={href}>
        <button className="flex items-center px-2 rounded-md focus:outline-none font-semibold">
          <CircleArrowLeft className="mr-2" />
          Go Back
        </button>
      </Link>
    </div>
  );
}
