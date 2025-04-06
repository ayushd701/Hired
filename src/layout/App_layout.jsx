import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const App_layout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container px-15">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">Made by Ayush Dixit</div>
    </div>
  );
};

export default App_layout;
