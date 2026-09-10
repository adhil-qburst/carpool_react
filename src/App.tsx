import { StrictMode } from "react";
import "./App.css";
import router from "@core/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { setRedirectHandler } from "@core/auth/authRedirect";

setRedirectHandler((to) => {
  void router.navigate(to);
});

const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
