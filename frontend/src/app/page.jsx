"use client";
import React, { useState } from "react";
import MyButton from "@/components/MyButton";


const LandingPage = () => {
  const [showChat, setShowChat] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 mt-12 md:mt-24">
        {/* Text */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Build Real-Time Applications Effortlessly
          </h2>
          <p className="text-gray-600 text-lg">
            Create powerful real-time apps with chat, audio, and video features using our easy-to-use platform. Save time and boost productivity.
          </p>
          <div className="flex gap-4">
            <MyButton text="Get Started" primary />
            <MyButton text="Learn More" />
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/004/579/209/small_2x/man-is-analyzing-social-media-marketing-data-and-ads-free-vector.jpg"
            alt="Real-Time App Illustration"
            className="w-full max-w-lg rounded-xl shadow-xl"
          />
        </div>
      </section>

     {/* Features Section */}
<section id="features" className="px-10 mt-20">
  <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
    Features
  </h3>

  <div className="grid md:grid-cols-3 gap-10">
    {/* Real-Time Chat */}
    <div
      onClick={() => setShowChat(true)}
      className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-blue-800">Real-Time Chat</h4>
      <p className="text-blue-700">Instant messaging with live updates.</p>
    </div>

    {/* Audio & Video Call */}
    <div
      onClick={() => setShowAudio(true)}
      className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-teal-800">Audio & Video Call</h4>
      <p className="text-teal-700">Seamless communication with peers.</p>
    </div>

    {/* User Management */}
    <div
      onClick={() => setShowVideo(true)}
      className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-purple-800">User Management</h4>
      <p className="text-purple-700">Manage users and roles effortlessly.</p>
    </div>

    {/* Interactive Live Streaming */}
    <div
      onClick={() => setShowLiveStreaming(true)}
      className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-orange-800">Interactive Live Streaming</h4>
      <p className="text-orange-700">Engage your audience in real-time.</p>
    </div>

    {/* Broadcast Streaming */}
    <div
      onClick={() => setShowBroadcast(true)}
      className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-pink-800">Broadcast Streaming</h4>
      <p className="text-pink-700">Stream content to multiple viewers simultaneously.</p>
    </div>

    {/* Interactive Whiteboard */}
    <div
      onClick={() => setShowWhiteboard(true)}
      className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer hover:scale-105"
    >
      <h4 className="text-xl font-semibold mb-2 text-yellow-800">Interactive Whiteboard</h4>
      <p className="text-yellow-700">Collaborate visually with your team in real-time.</p>
    </div>
  </div>
</section>


      {/* Modals */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowChat(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <chats />
          </div>
        </div>
      )}

      {showAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowAudio(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <audio />
          </div>
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl w-full relative">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <video/>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
