import React from "react";

// useQuery à pour rôle de charger les données et de les mettre en cache.
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  // J'intencie mon queryClient fourni par mon  <QueryClientProvider client={queryClient}> dans mon index.js
  // et qui englobe mon app.
  const queryClient = useQueryClient();

  // Destructuring
  const {
    // ensemble des (fourni par eact-query) propriétés qui vont nous permettre de connaître l’état de la requête
    isLoading,
    isSuccess,
    isError,
    error,
    // mes données stoké dans l'objet data : todos
    data: todos,

    /* useQuery a pour rôle de charger les données et de les mettre en cache :
        - 1er paramètre = clé que l'on va utiliser pour stocker nos données dans le cache ça peut être un tableau 
        ou une chaîne de caractère. 
        - 2 eme paramètre = fonction asynchrone qui exécute une requête sur mon serveur */
  } = useQuery("todos", getTodos, {
    // Permet de définir une durée de vie des données mise cache.
    staleTime: 5 * 60 * 1000,
    // Tri de mon tableau
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

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

  // Inupt New Item
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

  // content peut afficher trois états en fonctions de l'état de la requêtes isLoading, isError, isSuccess.
  let content;
  
  // Si je suis en état de chargement ou si j'ai une erreur je renvoie un message sinon je renvoie
  // mes données.
  if (isLoading) {
    content = <p>Loading ...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (isSuccess) {
    // Me renvoie les données brut le temps du test
    // content = JSON.stringify(todos);
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                // spread de mon tableau de todo que je maj par l'inverse de la valeur actuelle.
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button
            className="trash"
            onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
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
