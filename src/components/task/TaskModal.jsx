import TaskForm from "./TaskForm";

export default function TaskModal({ isOpen, onClose, taskToEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slide-up border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Decorative gradient bar */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-full" />

        <div className="flex items-center justify-between mb-5 mt-1">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {taskToEdit ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {taskToEdit ? "Update the task details below" : "Fill in the details to create a task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <TaskForm taskToEdit={taskToEdit} onClose={onClose} />
      </div>
    </div>
  );
}
