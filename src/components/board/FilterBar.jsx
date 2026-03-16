export default function FilterBar({ sortBy, onSortChange, filterPriority, onFilterPriorityChange }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sort</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "priority", label: "Priority" },
            { value: "dueDate", label: "Due Date" },
            { value: "name", label: "A-Z" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-2.5 py-1 text-[11px] font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <span className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Filter by priority */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Priority</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {[
            { value: "all", label: "All" },
            { value: "high", label: "High", dot: "bg-red-500" },
            { value: "medium", label: "Med", dot: "bg-amber-400" },
            { value: "low", label: "Low", dot: "bg-emerald-400" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterPriorityChange(opt.value)}
              className={`px-2.5 py-1 text-[11px] font-medium transition-all flex items-center gap-1 ${
                filterPriority === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
