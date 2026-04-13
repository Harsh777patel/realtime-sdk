'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getbyid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  if (!user) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Realtime SDK</h2>
        <nav className="space-y-3">
          <MenuItem title="Dashboard" active />
          <MenuItem title="Projects" />
          <MenuItem title="API Keys" />
          <MenuItem title="SDK Integration" />
          <MenuItem title="Analytics" />
          <MenuItem title="Chat Logs" />
          <MenuItem title="Call Logs" />
          <MenuItem title="Users" />
          <MenuItem title="Billing" />
          <MenuItem title="Settings" />
          <MenuItem title="Logout" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name}
            </span>
            <img
              src={user.profilePic || "https://i.pravatar.cc/40"}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StatCard title="Projects" value="12" />
            <StatCard title="API Keys" value="4" />
            <StatCard title="Active Users" value="89" />
            <StatCard title="Messages Today" value="1,245" />
          </div>

          {/* SDK Integration */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Quick SDK Integration
            </h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">
{`<script src="https://yourplatform.com/sdk.js"></script>
<script>
RealtimeSDK.init({
  apiKey: "YOUR_API_KEY",
  userId: "${user._id}",
  name: "${user.name}"
});
</script>`}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Role:</b> {user.role}</p>
              <p><b>Location:</b> {user.location || "India"}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MenuItem = ({ title, active }) => (
  <div
    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
      active
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`}
  >
    {title}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
  </div>
);

export default UserDashboard;