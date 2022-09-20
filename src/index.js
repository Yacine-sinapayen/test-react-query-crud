import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Ces deux hooks vont me permettre de fournir à toute mon app les données. 
import { QueryClient, QueryClientProvider } from "react-query";
// devtools react-query
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";

// J'intencie un new QueryClient() que je passe à mon provider. 
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Disponible uniquement en developpement et pas en prod */}
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
