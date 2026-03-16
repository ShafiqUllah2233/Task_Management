import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
      </svg>
    ),
    headerGradient: "from-slate-500 to-slate-600",
    dropBg: "bg-slate-100 dark:bg-slate-500/10",
    dropBorder: "border-slate-300 dark:border-slate-600",
  },
  "in-progress": {
    label: "In Progress",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    headerGradient: "from-blue-500 to-cyan-500",
    dropBg: "bg-blue-50 dark:bg-blue-500/10",
    dropBorder: "border-blue-300 dark:border-blue-600",
  },
  done: {
    label: "Done",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    headerGradient: "from-emerald-500 to-green-500",
    dropBg: "bg-emerald-50 dark:bg-emerald-500/10",
    dropBorder: "border-emerald-300 dark:border-emerald-600",
  },
};

export default function KanbanColumn({ status, tasks, onEdit, onDelete }) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-1 min-w-[300px] flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${config.headerGradient} flex items-center justify-center text-white shadow-sm`}>
            {config.icon}
          </div>
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">{config.label}</h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold bg-gradient-to-r ${config.headerGradient} text-white shadow-sm`}>
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl p-3 space-y-2.5 transition-all duration-300 min-h-[200px] scrollbar-thin overflow-y-auto ${
          isOver
            ? `${config.dropBg} border-2 border-dashed ${config.dropBorder} shadow-inner scale-[1.01]`
            : "bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60"
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-300 dark:text-gray-600">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xs font-medium">No tasks here</p>
            <p className="text-[10px] mt-0.5">Drop tasks to add them</p>
          </div>
        )}
      </div>
    </div>
  );
}
