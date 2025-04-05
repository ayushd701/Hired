import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/theme_provider";
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
        element: <Onboarding />,
      },
      {
        path: "/jobs",
        element: <Job_listing />,
      },
      {
        path: "/job/:id",
        element: <Job />,
      },
      {
        path: "/post-job",
        element: <Post_job />,
      },
      {
        path: "/saved-jobs",
        element: <Saved_jobs />,
      },
      {
        path: "/my-jobs",
        element: <My_Jobs />,
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
