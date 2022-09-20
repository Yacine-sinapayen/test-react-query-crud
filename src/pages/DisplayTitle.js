import React from "react";
/* 
- useQuery a pour rôle de charger les données et de les mettres en cache.
- useMutation nous permet de faire nos modifications sur le serveur grâce à nos méthodes importées depuis axios. "useMutation" nous retourne une méthode "mutate" que l'on va appeler au moment du déclanchement de notre create/update/delete.
- useQueryClient et un objet qui va nous fournir tout un ensemble de méthode pour manipuler le cache.
*/
import { useQuery } from "react-query";
// J'importe mes méthodes depuis mon api.
import { getTodos } from "../api/todosApi";

function DisplayTitle() {
  // Destructuring
  const {
    data: todos,
  } = useQuery("todos", getTodos);

  let content;

  content = todos.map((todo) => {
    return (
      <article key={todo.id}>
        <label htmlFor={todo.id}>{todo.title}</label>
      </article>
    );
  });

  return <>{ content }</>;
}

export default DisplayTitle;
