import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/chats";
import AudioCall from "./components/audio";
import VideoCall from "./components/video";
import Broadcast from "./components/broadcast";
import LiveStreaming from "./components/live_streaming";
import Whiteboard from "./components/whiteboard";
import ApiKeyManager from "./components/ApiKeyManager";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chats" element={<Chat
          apiKey={'sk_94579f9570b35d100b38d336f097786c004b11f1b9a32e64bf9e31002241ac89'}
          userId="user123"
          name="triple m"
          email="john@email.com"
          serverUrl="http://localhost:5000"
          theme="light"
          position="bottom-right"
          roomId="support"
        />} />
        <Route path="/audio" element={<AudioCall
          apiKey="sk_94579f9570b35d100b38d336f097786c004b11f1b9a32e64bf9e31002241ac89"
          userId="user123"
          name="Mubassir"
          roomId="room1"
        />} />
        <Route path="/video" element={<VideoCall
          apiKey="sk_94579f9570b35d100b38d336f097786c004b11f1b9a32e64bf9e31002241ac89"
          userId="user1"
          name="John"
          serverUrl="http://localhost:5000"
          roomId="support"
        />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/live_streaming" element={<LiveStreaming />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/apikeymanager" element={<ApiKeyManager />} />

      </Routes>
    </Router>
  );
}

export default App;
