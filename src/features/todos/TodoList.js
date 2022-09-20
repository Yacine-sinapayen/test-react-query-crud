import React from "react";
/* 
- useQuery a pour rôle de charger les données et de les mettre en cache.
- useMutation nous permet de faire nos modifications sur le serveur grâce à nos méthodes importées depuis axios. "useMutation" nous retourne une méthode "mutate" que l'on va appeler au moment du déclenchement de notre create/update/delete.
- useQueryClient et un objet qui va nous fournir tout un ensemble de méthodes pour manipuler le cache.
*/
import { useQuery, useMutation, useQueryClient } from "react-query";
// J'importe mes méthodes depuis mon api.
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  /* J'instancie mon queryClient fourni par mon  <QueryClientProvider client={queryClient}> (qui englobe l'application) dans mon index.js. */
  const queryClient = useQueryClient();

  // Destructuring
  const {
    // Ensemble des propriétés (fournis par eact-query) qui vont nous permettre de connaître l’état de la requête
    isLoading,
    isSuccess,
    isError,
    error,
    // Mes données stokées dans l'objet "data : todos"
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

  // Je créais des mutations qui vont nous permettre de : add/update/delete
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      // Invalide le cache et récupère à nouveau les données
      queryClient.invalidateQueries("todos");
    },
  });

  
  // - useMutation nous permet de faire nos modifications sur le serveur grâce à nos méthodes importées depuis axios. 
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
    // "useMutation" nous retourne une méthode "mutate" que l'on va appeler au moment du déclanchement de notre create/update/delete.
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
