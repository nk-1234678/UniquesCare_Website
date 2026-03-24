import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function Navbar({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setOpen(false);
      if (setUser) setUser(null);
      navigate("/");
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb", // softer gray #e5e7eb
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // subtle modern shadow
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",           // wider container like modern sites
          margin: "0 auto",
          padding: "0 24px",            // better horizontal padding
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",               // taller for better touch/click area
        }}
      >
        {/* Logo + tagline */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 42,
                height: 42,
                backgroundColor: "#C0272D",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "18px",
                boxShadow: "0 2px 6px rgba(192,39,45,0.25)", // subtle glow
              }}
            >
              UC
            </div>

            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827", // dark gray-black
                  letterSpacing: "-0.02em",
                }}
              >
                UNIQUE <span style={{ color: "#C0272D" }}>CARE</span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#6b7280", // gray-500
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "1px",
                }}
              >
                Smart Lab Maintenance
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px", // more generous spacing
          }}
        >
          {[
            { name: "About Us", path: "/about" },
            { name: "Services", path: "/services" }, // ← added suggestion
            { name: "Features", path: "/features" }, // ← optional, common in such sites
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                color: "#374151", // gray-700
                fontSize: "15px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C0272D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <div style={{ position: "relative", display: "inline-block" }}>
            {/* Profile button */}
            <div
              onClick={toggleDropdown}
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}`}
                alt="profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </div>

            {/* Dropdown menu */}
            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  marginTop: "4px",
                  minWidth: "120px",
                  zIndex: 100,
                }}
              >
              <Link to ="/dashboard">
              <button
                onClick={() => console.log("Go to Dashboard")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  textAlign: "left",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Dashboard
              </button>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  textAlign: "left",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                      Logout
                    </button>
                  </div>
                )}
              </div>
          ) : (
            <>
              <Link to="/login">
                <button
                  className="btn-outline"
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                    backgroundColor: "transparent",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="btn-red"
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: "#C0272D",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(192,39,45,0.2)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e53e3e";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#C0272D";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
