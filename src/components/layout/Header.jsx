import { useTheme } from "../../context/ThemeContext";

export default function Header({ onAddTask, searchQuery, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">TaskFlow</h1>
          <p className="text-[10px] text-indigo-200 -mt-0.5 font-medium">Manage your work</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <svg className="w-4 h-4 text-white/50 group-focus-within:text-white/80 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks... ( / )"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-input"
            className="pl-9 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/30 w-64 transition-all"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <button
          onClick={onAddTask}
          className="bg-white text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>
    </header>
  );
}
