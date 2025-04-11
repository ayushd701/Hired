import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import App_layout from "./layout/App_layout";
import {
  Job,
  Job_listing,
  LandingPage,
  My_Jobs,
  Onboarding,
  Post_job,
  Saved_jobs,
} from "./pages/index.js";
import Protected_route from "./components/Protected_route";

const router = createBrowserRouter([
  {
    element: <App_layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: 
          <Protected_route>
            <Onboarding />
          </Protected_route>,
      },
      {
        path: "/jobs",
        element: 
          <Protected_route>
            <Job_listing />
          </Protected_route>,
      },
      {
        path: "/job/:id",
        element: 
          <Protected_route>
            <Job />
          </Protected_route>,
      },
      {
        path: "/post-job",
        element: 
          <Protected_route>
            <Post_job />
          </Protected_route>,
      },
      {
        path: "/saved-jobs",
        element: 
          <Protected_route>
            <Saved_jobs />
          </Protected_route>,
      },
      {
        path: "/my-jobs",
        element: 
          <Protected_route>
            <My_Jobs />
          </Protected_route>,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
