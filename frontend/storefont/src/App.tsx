import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { routerRoot } from "./routers";
import './App.css'

function App() {
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: undefined,
    },
  },
});

  return (
   <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerRoot} />
    </QueryClientProvider>
  )
}

export default App
