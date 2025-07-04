import {
  StarIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b">
      <div className="flex items-center gap-2">
        <ArrowLeftIcon className="w-5 h-5 text-blue-500 cursor-pointer" />
        <div>
          <div className="font-semibold text-gray-800">Zoe</div>
          <div className="text-sm text-gray-500">Active 10 mins ago</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-blue-500">
        <StarIcon className="w-5 h-5 cursor-pointer" />
        <PhoneIcon className="w-5 h-5 cursor-pointer" />
        <VideoCameraIcon className="w-5 h-5 cursor-pointer" />
        <InformationCircleIcon className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}
