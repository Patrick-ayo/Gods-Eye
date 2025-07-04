import "flowbite"; // required for dropdowns to work
import "./style.css";
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

function Logo() {
  return (
    <>
      <button
        id="dropdownRightEndButton"
        data-dropdown-toggle="dropdownRightEnd"
        data-dropdown-placement="right-end"
        className="bg-transparent text-gray-900 dark:text-white font-bold md:text-5xl border-none focus:outline-none rounded-2xl px-5 py-2.5 me-2 mb-2 ml-2 transition-colors duration-300 cursor-pointer hover-grey"
        type="button"
      >
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            God's Eye
          </span>
        </h1>
      </button>

      {/* Dropdown menu */}
      <div
        id="dropdownRightEnd"
        className="z-50 hidden bg-gray-100 dark:bg-gray-200 backdrop-blur-sm border border-gray-200 dark:border-gray-300 rounded-2xl shadow-2xl w-60"
      >
        <ul className="py-3 space-y-1" aria-labelledby="dropdownRightEndButton">
          <li>
            <a
              href="#"
              className="flex items-center px-6 py-4 text-gray-700 dark:text-gray-800 hover:bg-white dark:hover:bg-gray-50 hover:text-gray-900 dark:hover:text-gray-900 transition-all duration-200 rounded-lg mx-2 group text-xl"
            >
              <Cog6ToothIcon className="w-6 h-6 text-gray-500 mr-6" />
              <span className="font-semibold">Settings</span>
            </a>
          </li>

          <li className="border-t border-gray-200 dark:border-gray-300 pt-2 mt-2">
            <a
              href="#"
              className="flex items-center px-6 py-4 text-red-600 dark:text-red-700 hover:bg-red-50 dark:hover:bg-red-100 hover:text-red-800 dark:hover:text-red-800 transition-all duration-200 rounded-lg mx-2 group text-xl"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors mr-6" />
              <span className="font-bold dark:text-red-700">Logout</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="pt-1 mt-1 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700"></div>
    </>
  );
}

export default Logo;
