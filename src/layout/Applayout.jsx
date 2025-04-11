import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Applayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container px-15">
        <Header />
        <Outlet />
      </main>
      <hr className="mt-5"/>
      <div className="p-4 text-center bg-transparent">Made by Ayush Dixit</div>
    </div>
  );
};

export default Applayout;
