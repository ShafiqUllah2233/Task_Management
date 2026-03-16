import { useState } from "react";
import { useCategories } from "../../context/CategoryContext";

const COLOR_OPTIONS = [
  { value: "bg-blue-500", ring: "ring-blue-400" },
  { value: "bg-purple-500", ring: "ring-purple-400" },
  { value: "bg-red-500", ring: "ring-red-400" },
  { value: "bg-green-500", ring: "ring-green-400" },
  { value: "bg-yellow-500", ring: "ring-yellow-400" },
  { value: "bg-pink-500", ring: "ring-pink-400" },
  { value: "bg-indigo-500", ring: "ring-indigo-400" },
  { value: "bg-teal-500", ring: "ring-teal-400" },
];

export default function Sidebar({ selectedCategory, onSelectCategory }) {
  const { categories, dispatch } = useCategories();
  const [newCatName, setNewCatName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [showForm, setShowForm] = useState(false);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    dispatch({
      type: "ADD_CATEGORY",
      payload: { name: newCatName.trim(), color: selectedColor },
    });
    setNewCatName("");
    setSelectedColor(COLOR_OPTIONS[0].value);
    setShowForm(false);
  };

  return (
    <aside className="w-64 bg-slate-900 p-5 flex flex-col shrink-0 shadow-xl">
      {/* Stats Section */}
      <div className="mb-6 p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/5">
        <p className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider mb-1">Projects</p>
        <p className="text-2xl font-bold text-white">{categories.length}</p>
      </div>

      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
        Categories
      </h2>

      <button
        onClick={() => onSelectCategory(null)}
        className={`text-left px-3 py-2.5 rounded-xl text-sm mb-1 transition-all duration-200 flex items-center gap-2.5 ${
          selectedCategory === null
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        All Tasks
      </button>

      <div className="space-y-0.5 mt-1">
        {categories.map((cat, index) => (
          <div key={cat.id} className="flex items-center group animate-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
            <button
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color} ring-2 ring-offset-1 ring-offset-slate-900 ${
                selectedCategory === cat.id ? "ring-white/30" : "ring-transparent"
              }`} />
              {cat.name}
            </button>
            <button
              onClick={() => dispatch({ type: "DELETE_CATEGORY", payload: cat.id })}
              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-1.5 transition-all duration-200 hover:bg-red-500/10 rounded-lg mr-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleAddCategory} className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 space-y-3 animate-slide-up">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map(({ value, ring }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedColor(value)}
                className={`w-6 h-6 rounded-full ${value} transition-all duration-200 hover:scale-110 ${
                  selectedColor === value ? `ring-2 ring-offset-2 ring-offset-slate-900 ${ring} scale-110` : ""
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 text-sm text-white bg-indigo-600 hover:bg-indigo-500 font-medium py-1.5 rounded-lg transition-colors">
              Add
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 py-1.5 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 text-sm text-slate-500 hover:text-indigo-400 flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-all duration-200 group"
        >
          <span className="w-5 h-5 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Add Category
        </button>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mt-auto pt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Shortcuts</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">N</kbd>
            <span>New task</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">/</kbd>
            <span>Search</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">Esc</kbd>
            <span>Close modal</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-3">TaskFlow v1.1</p>
      </div>
    </aside>
  );
}
