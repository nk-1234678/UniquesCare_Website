import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // 🔥 required for cookies
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registered Successfully ✅");
        setUser(data.user);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

        <div className="text-center mb-7">
          <h2 className="text-3xl font-semibold text-gray-900">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign up to start using the platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?
          <a
            href="/login"
            className="ml-1 text-red-600 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>

      </div>
    </div>
  );
}

export default SignUp;