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
        <Route path="/chats" element={<Chat />} />
        <Route path="/audio" element={<AudioCall />} />
        <Route path="/video" element={<VideoCall />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/live_streaming" element={<LiveStreaming />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
                <Route path="/apikeymanager" element={<ApiKeyManager />} />

      </Routes>
    </Router>
  );
}

export default App;
