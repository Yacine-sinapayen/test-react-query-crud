import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { falTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  // J'intencie mon queryClient fourni par mon  <QueryClientProvider client={queryClient}> dans mon index.js
  // et qui englobe mon app.
  const queryClient = useQueryClient();

  // destructuring
  const {
    // options fournis par react-query
    isLoading,
    isError,
    error,
    // mes données stoké dans l'objet data : todos
    data: todos,
    // 1er argu je donne un nom au cache qui est stocké
    // 2nd argu j'appel la fonction dont j'ai besoin
  } = useQuery("todos", getTodos);

  // Je creais des mutations qui vont nous permettre de : add/update/delete
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      // Invalide le cache et récupère à nouveau les données
      queryClient.invalidateQueries("todos");
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      // Invalide le cache et récupère à nouveau les données
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      // Invalide le cache et récupère à nouveau les données
      queryClient.invalidateQueries("todos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({
      userId: 1,
      title: newTodo,
      completed: false,
    });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
  // Si je suis en état de chargement ou si j'ai une erreur je renvoie un message sinon je renvoie
  // mes données.
  let content;
  if (isLoading) {
    content = <p>Loading ...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = JSON.stringify(todos);
  }

  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
