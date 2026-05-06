import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const PublicLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar user={user} />

      <main>
        <div>
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PublicLayout;