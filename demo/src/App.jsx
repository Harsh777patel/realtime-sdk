import React from 'react'
import { Chat } from 'digi-react-library';
import 'digi-react-library/dist/styles.css';

const App = () => {
  return (
    <div>
      <h1 className='font-bold text-3xl'>nice</h1>
      <Chat
        apiKey={'sk_94579f9570b35d100b38d336f097786c004b11f1b9a32e64bf9e31002241ac89'}
        userId="user123"
        name="John Doe"
        email="john@email.com"
        serverUrl="http://localhost:5000"
        theme="light"
        position="bottom-right"
        roomId="support"
      />
    </div>
  )
}

export default App