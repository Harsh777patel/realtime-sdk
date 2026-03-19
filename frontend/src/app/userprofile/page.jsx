"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [edit, setEdit] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    skills: "",
  });

  // 🔹 Fetch profile from DB
  useEffect(() => {
    axios.get("http://localhost:5000/api/users/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔹 Save profile
  const saveProfile = async () => {
    try {
      await axios.put("http://localhost:5000/api/users/profile", profile);
      setEdit(false);
      alert("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/120"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="mt-12 text-white">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <p className="text-sm opacity-90">{profile.role}</p>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8 grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="space-y-6">
            <Card title="Contact Info">
              <Input edit={edit} label="Email" name="email" value={profile.email} onChange={handleChange} />
              <Input edit={edit} label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
              <Input edit={edit} label="Location" name="location" value={profile.location} onChange={handleChange} />
            </Card>

            <Card title="Skills (comma separated)">
              <textarea
                disabled={!edit}
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </Card>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 space-y-6">
            <Card title="About Me">
              <textarea
                disabled={!edit}
                name="about"
                value={profile.about}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 text-sm"
              />
            </Card>

            <Card title="Personal Details">
              <div className="grid md:grid-cols-2 gap-4">
                <Input edit={edit} label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} />
                <Input edit={edit} label="Username" name="username" value={profile.username} onChange={handleChange} />
                <Input edit={edit} label="Role" name="role" value={profile.role} onChange={handleChange} />
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              {edit ? (
                <>
                  <button
                    onClick={() => setEdit(false)}
                    className="px-5 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="border rounded-xl p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, edit, ...props }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <input
      disabled={!edit}
      className="w-full border rounded-lg p-2 text-sm"
      {...props}
    />
  </div>
);

export default UserProfile;
