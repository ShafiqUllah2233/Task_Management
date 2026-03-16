import { createContext, useContext, useReducer, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TaskContext = createContext();

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return action.payload;
    case "ADD_TASK":
      return [
        ...state,
        {
          ...action.payload,
          id: crypto.randomUUID(),
          subtasks: action.payload.subtasks || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload, updatedAt: new Date().toISOString() }
          : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload);
    case "MOVE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.status, updatedAt: new Date().toISOString() }
          : task
      );
    case "ADD_SUBTASK":
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: [
                ...(task.subtasks || []),
                { id: crypto.randomUUID(), text: action.payload.text, done: false },
              ],
              updatedAt: new Date().toISOString(),
            }
          : task
      );
    case "TOGGLE_SUBTASK":
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: (task.subtasks || []).map((st) =>
                st.id === action.payload.subtaskId ? { ...st, done: !st.done } : st
              ),
              updatedAt: new Date().toISOString(),
            }
          : task
      );
    case "DELETE_SUBTASK":
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: (task.subtasks || []).filter((st) => st.id !== action.payload.subtaskId),
              updatedAt: new Date().toISOString(),
            }
          : task
      );
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [savedTasks, setSavedTasks] = useLocalStorage("tasks", []);
  const [tasks, dispatch] = useReducer(taskReducer, savedTasks);

  useEffect(() => {
    setSavedTasks(tasks);
  }, [tasks, setSavedTasks]);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
}
