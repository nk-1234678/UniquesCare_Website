import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // page load par check karo agar user logged in hai
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include", // cookie ke liye required
    })
      .then(res => {
        if (!res.ok) {
          setUser(null);
          return null;
        }

        return res.json();
      })
      .then(data => {
        if (data?.user) setUser(data.user);
      });
  }, []);

  return (
    <>
      {/* Pass auth state and updater to Navbar */}
      <Navbar user={user} setUser={setUser} />

      <main>
        <div>
          {/* Outlet me login/register pages me setUser prop pass karna */}
          <Outlet context={{ setUser }} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PublicLayout;