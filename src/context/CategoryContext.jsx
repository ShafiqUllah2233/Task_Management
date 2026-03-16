import { createContext, useContext, useReducer, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CategoryContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Personal", color: "bg-blue-500" },
  { id: "2", name: "Work", color: "bg-purple-500" },
  { id: "3", name: "Urgent", color: "bg-red-500" },
];

function categoryReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return action.payload;
    case "ADD_CATEGORY":
      return [
        ...state,
        { ...action.payload, id: crypto.randomUUID() },
      ];
    case "UPDATE_CATEGORY":
      return state.map((cat) =>
        cat.id === action.payload.id ? { ...cat, ...action.payload } : cat
      );
    case "DELETE_CATEGORY":
      return state.filter((cat) => cat.id !== action.payload);
    default:
      return state;
  }
}

export function CategoryProvider({ children }) {
  const [savedCategories, setSavedCategories] = useLocalStorage(
    "categories",
    DEFAULT_CATEGORIES
  );
  const [categories, dispatch] = useReducer(categoryReducer, savedCategories);

  useEffect(() => {
    setSavedCategories(categories);
  }, [categories, setSavedCategories]);

  return (
    <CategoryContext.Provider value={{ categories, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategories must be used within CategoryProvider");
  return context;
}
