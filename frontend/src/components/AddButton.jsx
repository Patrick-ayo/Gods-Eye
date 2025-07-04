import { PlusIcon } from "@heroicons/react/24/outline";

function AddButton() {
  return (
    <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 flex justify-center items-center w-full">
      <button
        type="button"
        className="flex items-center justify-center text-white border-none bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-8 py-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 transition-all duration-200"
      >
        <PlusIcon className="w-8 h-8 text-white mr-3" />
        <span className="text-lg font-semibold">Add Button</span>
      </button>
    </div>
  );
}

export default AddButton;
