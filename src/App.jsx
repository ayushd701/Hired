import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Applayout from "./layout/Applayout";
import {
  Job,
  Job_listing,
  LandingPage,
  My_Jobs,
  Onboarding,
  Postjob,
  Savedjobs,
} from "./pages/index.js";
import Protectedroute from "./components/Protectedroute";

const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: 
          <Protectedroute>
            <Onboarding />
          </Protectedroute>,
      },
      {
        path: "/jobs",
        element: 
          <Protectedroute>
            <Job_listing />
          </Protectedroute>,
      },
      {
        path: "/job/:id",
        element: 
          <Protectedroute>
            <Job />
          </Protectedroute>,
      },
      {
        path: "/post-job",
        element: 
          <Protectedroute>
            <Postjob />
          </Protectedroute>,
      },
      {
        path: "/saved-jobs",
        element: 
          <Protectedroute>
            <Savedjobs />
          </Protectedroute>,
      },
      {
        path: "/my-jobs",
        element: 
          <Protectedroute>
            <My_Jobs />
          </Protectedroute>,
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
