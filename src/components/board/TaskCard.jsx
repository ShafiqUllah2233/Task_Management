import { useCategories } from "../../context/CategoryContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRIORITY_CONFIG = {
  high: {
    bg: "bg-gradient-to-r from-red-500 to-rose-500",
    text: "text-white",
    label: "High",
  },
  medium: {
    bg: "bg-gradient-to-r from-amber-400 to-yellow-400",
    text: "text-amber-900",
    label: "Medium",
  },
  low: {
    bg: "bg-gradient-to-r from-emerald-400 to-green-400",
    text: "text-emerald-900",
    label: "Low",
  },
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const { categories } = useCategories();
  const category = categories.find((c) => c.id === task.categoryId);
  const priority = PRIORITY_CONFIG[task.priority];
  const subtasks = task.subtasks || [];
  const doneSubtasks = subtasks.filter((s) => s.done).length;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 group ${
        isDragging
          ? "opacity-40 shadow-2xl scale-105 rotate-2"
          : "shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 hover:-translate-y-0.5"
      }`}
    >
      {/* Priority indicator bar */}
      <div className={`h-1 w-12 rounded-full ${priority.bg} mb-3`} />

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="text-gray-400 hover:text-indigo-600 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtask progress */}
      {subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Subtasks
            </span>
            <span className="font-medium">{doneSubtasks}/{subtasks.length}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneSubtasks / subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priority.bg} ${priority.text} shadow-sm`}>
          {priority.label}
        </span>

        {category && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${category.color}`} />
            {category.name}
          </span>
        )}

        {task.dueDate && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            isOverdue
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}
