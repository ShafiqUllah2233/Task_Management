import { useState, useEffect, useCallback } from "react";
import { TaskProvider } from "./context/TaskContext";
import { CategoryProvider } from "./context/CategoryContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import KanbanBoard from "./components/board/KanbanBoard";
import TaskModal from "./components/task/TaskModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddTask = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // Esc — close modal
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      if (isInput) return;

      // N — new task
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleAddTask();
        return;
      }

      // / — focus search
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleAddTask, handleCloseModal]);

  return (
    <ThemeProvider>
      <TaskProvider>
        <CategoryProvider>
          <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30 transition-colors duration-300">
            <Header
              onAddTask={handleAddTask}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <main className="flex-1 overflow-auto">
                <KanbanBoard
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onEdit={handleEditTask}
                />
              </main>
            </div>
            <TaskModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              taskToEdit={taskToEdit}
            />
          </div>
        </CategoryProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
