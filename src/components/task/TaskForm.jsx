import { useState, useEffect } from "react";
import { useTasks } from "../../context/TaskContext";
import { useCategories } from "../../context/CategoryContext";

export default function TaskForm({ taskToEdit, onClose }) {
  const { dispatch } = useTasks();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    categoryId: "",
  });

  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate || "",
        categoryId: taskToEdit.categoryId || "",
      });
      setSubtasks(taskToEdit.subtasks || []);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId || null,
      dueDate: form.dueDate || null,
      subtasks,
    };

    if (taskToEdit) {
      dispatch({ type: "UPDATE_TASK", payload: { ...payload, id: taskToEdit.id } });
    } else {
      dispatch({ type: "ADD_TASK", payload });
    }
    onClose();
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: newSubtask.trim(), done: false },
    ]);
    setNewSubtask("");
  };

  const toggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, done: !st.done } : st))
    );
  };

  const deleteSubtask = (id) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-emerald-400" },
    { value: "medium", label: "Medium", color: "bg-amber-400" },
    { value: "high", label: "High", color: "bg-red-500" },
  ];

  const doneCount = subtasks.filter((s) => s.done).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
          autoFocus
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Add more details..."
          rows={2}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 resize-none transition-all"
        />
      </div>

      {/* Priority - Visual selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Priority
        </label>
        <div className="flex gap-2">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, priority: opt.value }))}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                form.priority === opt.value
                  ? `${opt.color} text-white shadow-md scale-[1.02]`
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${form.priority === opt.value ? "bg-white" : opt.color}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={handleChange("status")}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={handleChange("dueDate")}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
        <select
          value={form.categoryId}
          onChange={handleChange("categoryId")}
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subtasks / Checklist */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Subtasks {subtasks.length > 0 && <span className="text-indigo-500">({doneCount}/{subtasks.length})</span>}
        </label>

        {subtasks.length > 0 && (
          <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto scrollbar-thin">
            {subtasks.map((st) => (
              <div key={st.id} className="flex items-center gap-2 group">
                <button
                  type="button"
                  onClick={() => toggleSubtask(st.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    st.done
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                  }`}
                >
                  {st.done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`text-xs flex-1 ${st.done ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}>
                  {st.text}
                </span>
                <button
                  type="button"
                  onClick={() => deleteSubtask(st.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
            placeholder="Add a subtask..."
            className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99]"
        >
          {taskToEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
