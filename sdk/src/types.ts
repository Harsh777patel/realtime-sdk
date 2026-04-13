export interface RTCProps {
  apiKey: string;
  userId: string;
  name?: string;
  serverUrl?: string;
  roomId?: string;
  iceServers?: RTCIceServer[];
}

export interface Message {
  text: string;
  type: "sent" | "received";
  time: string;
  read?: boolean;
}