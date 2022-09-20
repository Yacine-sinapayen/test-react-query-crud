import TodoList from "./features/todos/TodoList";
import DisplayTitle from "./pages/DisplayTitle";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/todolist" element={<TodoList />} />
      <Route path="todolist/displaytodo" element={<DisplayTitle />} />
    </Routes>
  );
}

export default App;
