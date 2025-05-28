# Node js and Frontend Real time communication
## Socketio
Here's a detailed **use case** to demonstrate and learn **real-time communication using WebSockets** with a **Node.js backend** and a **React.js frontend**.

---

## 📦 Use Case: Real-Time Chat App

We'll build a **simple chat app** where multiple users can join a room and send messages that appear instantly for all participants—perfect to learn WebSocket basics.

---

## 🔑 Key Concepts You'll Learn

### **Backend (Node.js + WebSocket/Socket.IO):**

* Setting up a WebSocket server
* Managing socket connections/disconnections
* Broadcasting messages to all clients
* Handling rooms or user sessions

### **Frontend (React.js + Socket.IO Client):**

* Connecting to WebSocket server
* Sending and receiving real-time messages
* Managing user input and chat display

---

## 🛠️ Stack

* **Backend:** Node.js with [Express](https://expressjs.com/) and [Socket.IO](https://socket.io/)
* **Frontend:** React.js with [Socket.IO Client](https://socket.io/docs/v4/client-api/)

---

## 🧩 Project Structure

```
chat-app/
├── server/
│   └── index.js
├── client/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
```

---

## 🖥️ Backend (Node.js + Socket.IO)

### `server/index.js`

```js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow any origin for testing
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('📨 Message received:', msg);
    io.emit('chat message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('✅ Server listening on http://localhost:3001');
});
```

---

## 🌐 Frontend (React.js + Socket.IO Client)

### Install Client Dependencies:

```bash
cd client
npm install socket.io-client
```

### `client/src/App.js`

```jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Real-Time Chat</h2>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: 20 }}>
        {chat.map((msg, idx) => (
          <div key={idx}>👉 {msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

---

## 🚀 Running the App

1. **Start Backend**

   ```bash
   cd server
   node index.js
   ```

2. **Start Frontend**

   ```bash
   cd client
   npm start
   ```

Open `http://localhost:3000` in two browser tabs to see real-time communication in action.

---

## 📘 Optional Enhancements (for deeper learning)

* Support for user names or rooms
* Typing indicators (`user is typing...`)
* Persist messages using MongoDB or PostgreSQL
* Authentication with JWT
* Use `useRef` to auto-scroll to new messages

---

# Websocket - ws

Great — let’s recreate **a real-time WhatsApp-like chat experience** using **WebSockets** (`ws`), a **Node.js backend**, and a **React frontend**.

This project will demonstrate:

* **WebSocket integration**
* **User-based direct messaging (1-on-1)**
* **Chat rooms (optional)**
* **Online/offline indicators**
* **Typing status (optional)**

---

## 🧠 Goal: WhatsApp-Style Real-Time Chat with React + Node + WebSocket (`ws`)

---

## ✅ Key Features

| Feature              | Status |
| -------------------- | ------ |
| Real-time messaging  | ✅      |
| User login (mocked)  | ✅      |
| 1-on-1 private chats | ✅      |
| Online users list    | ✅      |
| React UI             | ✅      |

---

## 📦 Project Structure

```
whatsapp-clone/
├── server/
│   ├── server.js
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Chat.js
│   │   ├── Login.js
│   │   └── socket.js
│   └── package.json
```

---

# 🛠️ Backend (`ws` + Node.js)

### 1. `server/server.js`

```js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

const users = new Map(); // username => ws

wss.on('connection', (ws) => {
    let username = null;

    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.type === 'login') {
            username = msg.username;
            users.set(username, ws);
            broadcastUserList();
        } else if (msg.type === 'message') {
            const target = users.get(msg.to);
            if (target && target.readyState === WebSocket.OPEN) {
                target.send(JSON.stringify({
                    type: 'message',
                    from: username,
                    text: msg.text
                }));
            }
        }
    });

    ws.on('close', () => {
        if (username) {
            users.delete(username);
            broadcastUserList();
        }
    });
});

function broadcastUserList() {
    const userList = Array.from(users.keys());
    const message = JSON.stringify({ type: 'users', users: userList });

    for (let ws of users.values()) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    }
}

server.listen(4000, () => console.log('WebSocket server on http://localhost:4000'));
```

---

# ⚛️ Frontend (React)

```bash
npx create-react-app client
cd client
npm install
```

---

### 2. `src/socket.js`

```js
let socket;

export const connectSocket = (username, onMessage, onUsers) => {
    socket = new WebSocket('ws://localhost:4000');

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'login', username }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') onMessage(data);
        if (data.type === 'users') onUsers(data.users);
    };
};

export const sendMessage = (to, text) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'message', to, text }));
    }
};
```

---

### 3. `src/Login.js`

```jsx
import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username) onLogin(username);
    };

    return (
        <div>
            <h2>Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
```

---

### 4. `src/Chat.js`

```jsx
import React, { useState } from 'react';
import { sendMessage } from './socket';

function Chat({ username, users, messages, setMessages }) {
    const [target, setTarget] = useState('');
    const [text, setText] = useState('');

    const handleSend = () => {
        if (target && text) {
            sendMessage(target, text);
            setMessages([...messages, { from: username, to: target, text }]);
            setText('');
        }
    };

    return (
        <div>
            <h2>Welcome, {username}</h2>
            <select onChange={e => setTarget(e.target.value)} value={target}>
                <option value="">Select a user</option>
                {users.filter(u => u !== username).map(user => (
                    <option key={user} value={user}>{user}</option>
                ))}
            </select>
            <div style={{ border: '1px solid #ccc', height: '200px', overflow: 'auto' }}>
                {messages.map((msg, i) => (
                    <div key={i}><b>{msg.from}:</b> {msg.text}</div>
                ))}
            </div>
            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;
```

---

### 5. `src/App.js`

```jsx
import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import { connectSocket } from './socket';

function App() {
    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleLogin = (user) => {
        setUsername(user);
        connectSocket(
            user,
            msg => setMessages(prev => [...prev, msg]),
            userList => setUsers(userList)
        );
    };

    if (!username) return <Login onLogin={handleLogin} />;
    return <Chat username={username} users={users} messages={messages} setMessages={setMessages} />;
}

export default App;
```

---

### 6. Run Everything

**Start Backend:**

```bash
cd server
node server.js
```

**Start Frontend:**

```bash
cd client
npLet's build a **WhatsApp-style real-time chat app** using a **FastAPI WebSocket backend** and a **React.js frontend**.

---

## 🔧 Tech Stack Overview

* **Backend**: FastAPI + `websockets` via `fastapi.WebSocket`
* **Frontend**: React.js (using native `WebSocket` API)
* **Communication**: JSON over WebSocket
* **Features**:

  * Login (mocked)
  * Online users list
  * 1-on-1 messaging
  * Real-time updates

---

## 🗂️ Project Structure

```
chat-app/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── Login.js
│       ├── Chat.js
│       └── socket.js
```

---

## 🚀 Backend – FastAPI WebSocket Server

### 🔹 `backend/requirements.txt`

```
fastapi
uvicorn
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 🔹 `backend/main.py`

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

active_users = {}  # username: websocket

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()
    active_users[username] = websocket
    await broadcast_users()

    try:
        while True:
            data = await websocket.receive_json()
            if data["type"] == "message":
                to_user = data["to"]
                msg_text = data["text"]
                if to_user in active_users:
                    await active_users[to_user].send_json({
                        "type": "message",
                        "from": username,
                        "text": msg_text
                    })
    except WebSocketDisconnect:
        del active_users[username]
        await broadcast_users()

async def broadcast_users():
    user_list = list(active_users.keys())
    for ws in active_users.values():
        await ws.send_json({
            "type": "users",
            "users": user_list
        })
```

---

### 🔹 Run FastAPI Server

```bash
uvicorn main:app --reload --port 8000
```

---

## ⚛️ Frontend – React.js WebSocket Client

### 🔹 1. Create React App

```bash
npx create-react-app frontend
cd frontend
```

---

### 🔹 2. `src/socket.js`

```js
let socket = null;

export const connectSocket = (username, onMessage, onUsers) => {
    socket = new WebSocket(`ws://localhost:8000/ws/${username}`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") onMessage(data);
        if (data.type === "users") onUsers(data.users);
    };
};

export const sendMessage = (to, text) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "message", to, text }));
    }
};
```

---

### 🔹 3. `src/Login.js`

```jsx
import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username.trim()) onLogin(username.trim());
    };

    return (
        <div>
            <h2>Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
```

---

### 🔹 4. `src/Chat.js`

```jsx
import React, { useState } from 'react';
import { sendMessage } from './socket';

function Chat({ username, users, messages, setMessages }) {
    const [target, setTarget] = useState('');
    const [text, setText] = useState('');

    const handleSend = () => {
        if (target && text) {
            sendMessage(target, text);
            setMessages([...messages, { from: username, to: target, text }]);
            setText('');
        }
    };

    return (
        <div>
            <h2>Welcome, {username}</h2>
            <select onChange={e => setTarget(e.target.value)} value={target}>
                <option value="">Select a user</option>
                {users.filter(u => u !== username).map(u => (
                    <option key={u} value={u}>{u}</option>
                ))}
            </select>

            <div style={{ border: '1px solid #ccc', height: '200px', overflowY: 'scroll' }}>
                {messages.map((msg, i) => (
                    <div key={i}><b>{msg.from}:</b> {msg.text}</div>
                ))}
            </div>

            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;
```

---

### 🔹 5. `src/App.js`

```jsx
import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import { connectSocket } from './socket';

function App() {
    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleLogin = (user) => {
        setUsername(user);
        connectSocket(
            user,
            msg => setMessages(prev => [...prev, msg]),
            userList => setUsers(userList)
        );
    };

    if (!username) return <Login onLogin={handleLogin} />;
    return <Chat username={username} users={users} messages={messages} setMessages={setMessages} />;
}

export default App;
```

---

### 🔹 6. Run React Frontend

```bash
npm start
```

---

## 🧪 Test the App

1. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. Start the React frontend:

   ```bash
   npm start
   ```

3. Open two tabs and log in as different users.

---

## ✅ Features Demonstrated

* Real-time 1-on-1 WebSocket messaging
* FastAPI WebSocket server
* React WebSocket client
* Online user tracking

---

Would you like me to package this into a downloadable zip or help deploy it with Docker or live hosting?
m start
```

---

## ✅ WhatsApp Features Demonstrated

* Real-time 1:1 messaging
* User list with online presence
* Stateless login for demo purposes
* Message history in-session

---

# FAST API - Real time communication 
Let's build a **WhatsApp-style real-time chat app** using a **FastAPI WebSocket backend** and a **React.js frontend**.

---

## 🔧 Tech Stack Overview

* **Backend**: FastAPI + `websockets` via `fastapi.WebSocket`
* **Frontend**: React.js (using native `WebSocket` API)
* **Communication**: JSON over WebSocket
* **Features**:

  * Login (mocked)
  * Online users list
  * 1-on-1 messaging
  * Real-time updates

---

## 🗂️ Project Structure

```
chat-app/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── Login.js
│       ├── Chat.js
│       └── socket.js
```

---

## 🚀 Backend – FastAPI WebSocket Server

### 🔹 `backend/requirements.txt`

```
fastapi
uvicorn
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 🔹 `backend/main.py`

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

active_users = {}  # username: websocket

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()
    active_users[username] = websocket
    await broadcast_users()

    try:
        while True:
            data = await websocket.receive_json()
            if data["type"] == "message":
                to_user = data["to"]
                msg_text = data["text"]
                if to_user in active_users:
                    await active_users[to_user].send_json({
                        "type": "message",
                        "from": username,
                        "text": msg_text
                    })
    except WebSocketDisconnect:
        del active_users[username]
        await broadcast_users()

async def broadcast_users():
    user_list = list(active_users.keys())
    for ws in active_users.values():
        await ws.send_json({
            "type": "users",
            "users": user_list
        })
```

---

### 🔹 Run FastAPI Server

```bash
uvicorn main:app --reload --port 8000
```

---

## ⚛️ Frontend – React.js WebSocket Client

### 🔹 1. Create React App

```bash
npx create-react-app frontend
cd frontend
```

---

### 🔹 2. `src/socket.js`

```js
let socket = null;

export const connectSocket = (username, onMessage, onUsers) => {
    socket = new WebSocket(`ws://localhost:8000/ws/${username}`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") onMessage(data);
        if (data.type === "users") onUsers(data.users);
    };
};

export const sendMessage = (to, text) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "message", to, text }));
    }
};
```

---

### 🔹 3. `src/Login.js`

```jsx
import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username.trim()) onLogin(username.trim());
    };

    return (
        <div>
            <h2>Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
```

---

### 🔹 4. `src/Chat.js`

```jsx
import React, { useState } from 'react';
import { sendMessage } from './socket';

function Chat({ username, users, messages, setMessages }) {
    const [target, setTarget] = useState('');
    const [text, setText] = useState('');

    const handleSend = () => {
        if (target && text) {
            sendMessage(target, text);
            setMessages([...messages, { from: username, to: target, text }]);
            setText('');
        }
    };

    return (
        <div>
            <h2>Welcome, {username}</h2>
            <select onChange={e => setTarget(e.target.value)} value={target}>
                <option value="">Select a user</option>
                {users.filter(u => u !== username).map(u => (
                    <option key={u} value={u}>{u}</option>
                ))}
            </select>

            <div style={{ border: '1px solid #ccc', height: '200px', overflowY: 'scroll' }}>
                {messages.map((msg, i) => (
                    <div key={i}><b>{msg.from}:</b> {msg.text}</div>
                ))}
            </div>

            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;
```

---

### 🔹 5. `src/App.js`

```jsx
import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import { connectSocket } from './socket';

function App() {
    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleLogin = (user) => {
        setUsername(user);
        connectSocket(
            user,
            msg => setMessages(prev => [...prev, msg]),
            userList => setUsers(userList)
        );
    };

    if (!username) return <Login onLogin={handleLogin} />;
    return <Chat username={username} users={users} messages={messages} setMessages={setMessages} />;
}

export default App;
```

---

### 🔹 6. Run React Frontend

```bash
npm start
```

---

## 🧪 Test the App

1. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. Start the React frontend:

   ```bash
   npm start
   ```

3. Open two tabs and log in as different users.

---

## ✅ Features Demonstrated

* Real-time 1-on-1 WebSocket messaging
* FastAPI WebSocket server
* React WebSocket client
* Online user tracking

---

Would you like me to package this into a downloadable zip or help deploy it with Docker or live hosting?
