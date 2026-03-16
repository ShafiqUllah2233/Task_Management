import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTasks } from "../../context/TaskContext";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import FilterBar from "./FilterBar";
import { useState } from "react";

const STATUSES = ["todo", "in-progress", "done"];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function KanbanBoard({ searchQuery, selectedCategory, onEdit }) {
  const { tasks, dispatch } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterPriority, setFilterPriority] = useState("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === null || task.categoryId === selectedCategory;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "priority":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const getTasksByStatus = (status) =>
    sortTasks(filteredTasks.filter((t) => t.status === status));

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    let newStatus = null;

    if (STATUSES.includes(over.id)) {
      newStatus = over.id;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && currentTask.status !== newStatus) {
        dispatch({ type: "MOVE_TASK", payload: { id: taskId, status: newStatus } });
      }
    }
  };

  const handleDelete = (taskId) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  const totalTasks = filteredTasks.length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Stats + Filter bar */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500">
            <span>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{totalTasks}</span>{" "}
              {totalTasks === 1 ? "task" : "tasks"} total
            </span>
            <span className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {getTasksByStatus("done").length} completed
            </span>
          </div>
          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterPriority={filterPriority}
            onFilterPriorityChange={setFilterPriority}
          />
        </div>

        {/* Board */}
        <div className="flex gap-5 flex-1 overflow-x-auto p-6 pt-3">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
