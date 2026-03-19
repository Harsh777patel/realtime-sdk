import React from "react";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, Harsh</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <aside className="bg-white rounded-xl shadow p-6">
          <nav className="space-y-4">
            <MenuItem title="Dashboard" active />
            <MenuItem title="Profile" />
            <MenuItem title="Settings" />
            <MenuItem title="Logout" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Projects" value="12" />
            <StatCard title="API Keys" value="4" />
            <StatCard title="Usage" value="78%" />
          </div>

          {/* Profile Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><b>Name:</b> Harsh</p>
              <p><b>Email:</b> harsh@email.com</p>
              <p><b>Role:</b> Developer</p>
              <p><b>Location:</b> India</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>🔑 API Key generated</li>
              <li>✏️ Profile updated</li>
              <li>🚀 New project created</li>
            </ul>
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
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {title}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
  </div>
);

export default UserDashboard;
