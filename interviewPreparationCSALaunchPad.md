# Road Map for Interview Preparation 
## Myth Behind awhy Node js or Browser JavaScript is Single Thread  

### **Why is Node.js Single-Threaded?**  
JavaScript, including Node.js, follows a **single-threaded event loop** model. This means:  
- It can handle **one operation at a time** in the main thread.  
- But it achieves concurrency using **asynchronous, non-blocking operations** with the event loop.  

### **How Does Node.js Handle Multiple Requests?**  
- **Asynchronous operations** (e.g., file reading, database queries) are handled by worker threads in the background (via **libuv**).  
- Once an operation completes, Node.js **calls the callback function** and continues execution.  
- This is why **Node.js can efficiently serve multiple clients** even though it's single-threaded.  

### **Why Not Use Multi-Threading?**  
If JavaScript were **multi-threaded**, multiple threads could manipulate the **DOM (Document Object Model)** simultaneously, leading to **race conditions, inconsistent UI updates, and performance issues**. This is why browsers and Node.js rely on **a single-threaded event loop**.  


## **MERN Stack + GenAI Interview Preparation Roadmap**  

#### **Phase 1: Core MERN Stack (2-3 Weeks)**  
✅ **React.js:**   
- Component lifecycle, Hooks (useState, useEffect, useContext, useReducer)  
- State management: Context API, Redux Toolkit  
- Performance Optimization (useMemo, React.memo, Lazy Loading)  
- Routing with React Router  
- UI libraries (Material-UI, Tailwind)  

✅ **Node.js & Express.js:**  
- Middleware, Authentication (JWT, OAuth)  
- REST API & GraphQL  
- Error Handling, Logging (Winston, Morgan)  
- Rate Limiting, Security Best Practices  

✅ **MongoDB:**  
- CRUD operations, Aggregation Pipeline  
- Indexing & Performance Optimization  
- Mongoose ORM  

✅ **System Design:**  
- How to design a scalable MERN app  
- Caching (Redis), Load Balancing, Rate Limiting  
- WebSockets for real-time updates  

#### **Phase 2: GenAI & LLMs (2-3 Weeks)**  
✅ **GenAI Basics:**  
- OpenAI API, Azure OpenAI, Google Gemini  
- LLM Fine-tuning & Prompt Engineering  
- Embeddings, Tokenization  

✅ **Retrieval-Augmented Generation (RAG):**  
- Vector Databases (Pinecone, Weaviate, ChromaDB)  
- Building a chatbot with LLM + Vector Search  

✅ **Model Deployment & Optimization:**  
- Running ONNX models in a MERN App  
- AI APIs vs Self-Hosted Models (Hugging Face, FastAPI)  

#### **Phase 3: Coding & Problem-Solving (Ongoing)**  
✅ **DSA Topics:**  
- Arrays, Strings, Linked Lists, Trees, Graphs  
- Recursion, Dynamic Programming  
- Problem-solving platforms (LeetCode, CodeSignal)  

✅ **Mock Interviews & System Design:**  
- Solve 2-3 coding problems daily  
- System design for an AI-powered app  
- Mock interviews on Pramp, Interviewing.io  

---

### **Mock Interview Questions**  

#### **MERN Stack:**  
1. How does React’s virtual DOM work?  
2. Explain the difference between useEffect and useCallback.  
3. How do you optimize performance in React?  
4. How does middleware work in Express.js?  
5. What’s the difference between SQL and NoSQL databases?  
6. How do you handle authentication in a MERN app?  
7. Explain Redux Thunk vs Redux Saga.  

#### **GenAI & LLMs:**  
8. What is the difference between GPT-4 and Gemini?  
9. How does LangChain work in an AI pipeline?  
10. What are embeddings in GenAI? How do vector databases work?  
11. How do you fine-tune an LLM?  
12. What is RAG, and how does it improve LLM responses?  
13. How do you deploy a Generative AI model in a web app?  

#### **System Design:**  
14. How would you design an AI-powered resume screening tool?  
15. How do you handle millions of users in a MERN application?  
16. How would you build a real-time chat app with GenAI-powered responses?  

---

### **Next Steps**  
- Pick a **learning schedule** (e.g., 3 hours/day, 5 days a week)  
- Start building **mini-projects** (e.g., AI chatbot, Resume Enhancer)  
- Join **mock interviews** and **DSA practice groups**  

## NodeJs Cluster Management and Threads  

### **Node.js Workers, Clusters, and Throng**  

When working with high-performance Node.js applications, handling multiple concurrent requests efficiently is crucial. **Node.js Workers, Clusters, and Throng** help achieve better scalability and performance.  

---

### **1. Node.js Clusters**  
- By default, Node.js runs on a **single-threaded event loop**, meaning it can utilize only one CPU core.  
- The **Cluster module** allows creating multiple child processes (workers), each running a separate instance of the Node.js application, utilizing multiple CPU cores.  

#### **Example: Using Clusters in Node.js**  
```javascript
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length; // Get the number of CPU cores

  console.log(`Master process ${process.pid} is running`);
  
  // Fork workers equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart a worker if it exits
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker processes run the server
  const express = require("express");
  const app = express();

  app.get("/", (req, res) => {
    res.send(`Handled by worker ${process.pid}`);
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```
**How it works:**  
- The **master process** forks worker processes, each running on a different CPU core.  
- Requests are distributed among workers, improving performance.  

---

### **2. Node.js Worker Threads**
- Unlike clusters (which create separate processes), **worker threads** allow **multi-threaded execution** within a single Node.js process.  
- Useful for CPU-intensive tasks without blocking the event loop.  

#### **Example: Using Worker Threads**  
```javascript
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  console.log("Main thread running");

  const worker = new Worker(__filename);
  worker.on("message", (message) => console.log("Message from worker:", message));
  worker.postMessage("Hello from main thread");
} else {
  parentPort.on("message", (msg) => {
    console.log("Worker received:", msg);
    parentPort.postMessage("Hello from worker");
  });
}
```
**Use Cases:**  
- Handling **CPU-intensive tasks** (e.g., image processing, cryptography).  
- Avoiding **blocking the event loop** while performing heavy computations.  

---

### **3. Throng (Cluster Management)**
**Throng** is a lightweight library that simplifies managing clusters. It:  
- Automatically forks workers.  
- Handles worker crashes and restarts them.  
- Manages worker lifecycle efficiently.  

#### **Example: Using Throng for Cluster Management**  
```javascript
const throng = require("throng");

const WORKERS = process.env.WEB_CONCURRENCY || 4; // Number of worker processes

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start: startWorker,
});

function startWorker(id) {
  console.log(`Worker ${id} started`);

  const express = require("express");
  const app = express();

  app.get("/", (req, res) => {
    res.send(`Handled by worker ${id}`);
  });

  app.listen(3000, () => {
    console.log(`Worker ${id} listening on port 3000`);
  });
}
```
**Benefits of Throng:**  
✔ **Automatically forks workers** based on available CPUs.  
✔ **Handles worker restarts** if they crash.  
✔ **Simple API** compared to raw `cluster` module.  

---

### **When to Use What?**
| Feature          | Use Case |
|----------------|--------------------------------|
| **Clusters** | Best for handling **multiple requests** on multi-core CPUs. |
| **Worker Threads** | Best for **CPU-heavy tasks** like data processing, hashing. |
| **Throng** | Best for **simplified cluster management** in production. |

# Event Loop(Asynchronous Programming), Multiprocessing, and Threading comparison b/w *Python* and *NodeJs*

### **Comparison of Event Loop, Threading, and Multi-processing in Python vs. Node.js**  

| Concept | **Node.js** | **Python** |
|---------|------------|------------|
| **Event Loop** | Uses a **single-threaded, non-blocking event loop** with async I/O (ideal for I/O-bound tasks). | Uses an **event loop** with `asyncio` for async programming, but traditionally multi-threaded/multi-process. |
| **Threading** | Uses the **Worker Threads module** for multi-threading, but doesn't improve CPU-bound tasks due to the **Global Interpreter Lock (GIL)**-like behavior. | Uses the `threading` module, but GIL restricts true parallel execution. Best for I/O-bound tasks. |
| **Multi-processing** | Uses the **Cluster module** to spawn separate Node.js processes (not threads). | Uses the `multiprocessing` module to spawn multiple processes, bypassing GIL and enabling true parallelism. |

---

## **1️⃣ Event Loop (Async I/O)**
### **Node.js: Event Loop with setTimeout and Promises**
```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback executed");
}, 1000);

Promise.resolve().then(() => console.log("Promise resolved"));

console.log("End");
```
**Expected Output:**
```
Start
End
Promise resolved
Timeout callback executed
```
**Explanation:**  
- The event loop executes synchronous code first.  
- `setTimeout` is deferred to the **event loop**.  
- The **microtask queue (Promise)** executes before the **macro task queue (setTimeout)**.  

---

### **Python: Async Event Loop with asyncio**
```python
import asyncio

async def main():
    print("Start")
    await asyncio.sleep(1)
    print("Timeout callback executed")

asyncio.run(main())
print("End")
```
**Expected Output:**
```
Start
End
Timeout callback executed
```
**Explanation:**  
- `asyncio.run(main())` starts the event loop.  
- `await asyncio.sleep(1)` simulates an async delay, allowing the event loop to continue.  

---

## **2️⃣ Multi-threading (Parallel Execution for I/O-Bound Tasks)**  
### **Node.js: Worker Threads for Parallel Execution**
```javascript
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  console.log("Main thread running");

  const worker = new Worker(__filename);
  worker.on("message", (message) => console.log("Message from worker:", message));
  worker.postMessage("Hello from main thread");
} else {
  parentPort.on("message", (msg) => {
    console.log("Worker received:", msg);
    parentPort.postMessage("Hello from worker");
  });
}
```
**Key Points:**  
- Uses the `worker_threads` module for parallel execution.  
- Workers have separate memory spaces but communicate via messaging.  

---

### **Python: Multi-threading with `threading` Module**
```python
import threading
import time

def task():
    print("Thread started")
    time.sleep(2)
    print("Thread finished")

thread = threading.Thread(target=task)
thread.start()
thread.join()
```
**Key Points:**  
- The `threading` module runs tasks in separate threads.  
- Python's **GIL (Global Interpreter Lock)** prevents true parallel execution of CPU-bound tasks.  
- Best used for I/O-bound operations (file I/O, network requests).  

---

## **3️⃣ Multi-processing (True Parallelism for CPU-Bound Tasks)**
### **Node.js: Clusters (Separate Processes)**
```javascript
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  console.log(`Worker ${process.pid} started`);
}
```
**Key Points:**  
- Uses the `cluster` module to fork multiple Node.js processes.  
- Each worker runs independently, utilizing multiple CPU cores.  
- Ideal for CPU-intensive tasks (video processing, large calculations).  

---

### **Python: Multi-processing for True Parallelism**
```python
import multiprocessing
import os

def worker():
    print(f"Worker process {os.getpid()} running")

if __name__ == "__main__":
    num_workers = multiprocessing.cpu_count()
    processes = []

    for _ in range(num_workers):
        p = multiprocessing.Process(target=worker)
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
```
**Key Points:**  
- The `multiprocessing` module spawns separate processes, bypassing the GIL.  
- Each process runs independently on a different CPU core.  
- Suitable for **CPU-intensive** workloads like AI/ML processing.  

---

## **🔍 Summary Table**
| Feature | **Node.js** | **Python** | **Best For** |
|---------|------------|------------|--------------|
| **Event Loop (Async I/O)** | Uses non-blocking, single-threaded event loop | Uses `asyncio` for async programming | I/O-bound tasks (network requests, file I/O) |
| **Threading** | Uses `worker_threads` but doesn't bypass event loop limitations | Uses `threading`, but GIL restricts true parallelism | I/O-bound tasks (DB queries, file handling) |
| **Multi-processing** | Uses `cluster` to fork processes (multi-core utilization) | Uses `multiprocessing`, bypassing GIL | CPU-bound tasks (ML, heavy computations) |

---

### **🚀 Key Takeaways:**
- **For I/O-heavy apps:** Use **Node.js event loop** or **Python asyncio**.  
- **For parallel execution:** Use **worker threads in Node.js** (with some limitations) or **Python threading** (for I/O tasks).  
- **For CPU-intensive tasks:** Use **Node.js clusters** or **Python multiprocessing** (Python is better here due to GIL).  

# http/https vs express server intitilizing
The difference between creating a server using Node.js's `http` module and using `app.listen(port)` in Express lies in flexibility and direct integration. Let’s break it down:  

### **1. Using the `http` Module to Create a Server**  
```javascript
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
### **How This Works:**  
- The `http.createServer(app)` explicitly creates an HTTP server and passes the Express instance (`app`) to handle requests.  
- This provides flexibility if you need to integrate WebSockets (`socket.io`), handle HTTP/HTTPS conditions manually, or extend functionalities later.  
- You can attach additional listeners like:  
  ```javascript
  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    console.log("A user connected");
  });
  ```

---

### **2. Directly Using `app.listen(port)`**
```javascript
const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
### **How This Works:**  
- `app.listen(port)` is a shortcut provided by Express, which internally calls `http.createServer(app).listen(port)`.  
- It’s a simpler approach and is useful if you don’t need low-level HTTP server control.  
- However, you **cannot** directly use WebSockets (`socket.io`) or attach low-level event listeners (e.g., `server.on("request", callback)`) without modifying it.

---

### **When to Use Which?**
| Approach | When to Use |
|----------|------------|
| `http.createServer(app)` | If you need WebSockets, HTTPS handling, or more control over HTTP requests. |
| `app.listen(port)` | If you only need a simple Express server for handling routes and APIs. |

For most REST API applications, `app.listen(port)` is sufficient. But for advanced use cases, `http.createServer(app)` provides more flexibility.

# Validating Request body using express-validator (midlware) v/s Joi scheme based validation:

### **Express Validator vs. Joi for Request Body Validation**  

Both **Express Validator** and **Joi** are popular for validating user input in an Express.js application, but they have key differences in **syntax, flexibility, and validation approach**.  

---

## **1️⃣ Express Validator (`express-validator`)**
🔹 **Uses middleware-based validation** that integrates directly into Express routes.  
🔹 **Lightweight** – No need to define schemas separately.  
🔹 **Validates request body, query params, headers, and URL params easily.**  

### **Installation**
```sh
npm install express-validator
```

### **Example: Validating User Registration**
```javascript
const { body, validationResult } = require("express-validator");
const express = require("express");

const app = express();
app.use(express.json());

app.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User registered successfully!");
  }
);

app.listen(3000, () => console.log("Server running on port 3000"));
```

### **Pros of Express Validator**
✅ Middleware-based validation that integrates well with Express routes.  
✅ No need to define separate validation schemas.  
✅ Supports **sanitization** (`.trim()`, `.escape()`).  

### **Cons of Express Validator**
❌ Cannot be used outside Express middleware.  
❌ Less structured compared to Joi’s schema-based validation.  

---

## **2️⃣ Joi (`joi`)**
🔹 **Schema-based validation** (similar to Mongoose schema).  
🔹 More flexible and reusable for validation across different parts of the app.  
🔹 Supports **custom error messages, complex object validation, and strict type checking**.  

### **Installation**
```sh
npm install joi
```

### **Example: Validating User Registration**
```javascript
const Joi = require("joi");
const express = require("express");

const app = express();
app.use(express.json());

// Define Joi schema
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

app.post("/register", (req, res) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  res.send("User registered successfully!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### **Pros of Joi**
✅ **Reusable schemas** (better for large applications).  
✅ Can be used **outside Express routes** (e.g., for database validation).  
✅ Supports **advanced validation (nested objects, arrays, regex, and custom rules)**.  

### **Cons of Joi**
❌ Cannot be used as Express middleware directly (must call `.validate()`).  
❌ Slightly more code for simple validations.  

---

## **📌 Key Differences:**
| Feature | **Express Validator** | **Joi** |
|---------|----------------|------|
| **Validation Type** | Middleware-based | Schema-based |
| **Ease of Use** | Simple, inline validation | Structured, reusable schemas |
| **Reusability** | Only works inside Express | Can be used in models, services, and controllers |
| **Complex Object Support** | Limited | Supports nested objects, arrays, regex validation |
| **Performance** | Lightweight | Slightly heavier due to schema parsing |

---

### **🔹 When to Use What?**
- **Use Express Validator** if you want **simple, inline validation directly in Express routes**.  
- **Use Joi** if you need **structured, reusable validation schemas** across your app (e.g., database validation, services).  

# RBAC with CASL - (Content Access Security Layer)
Build the rules (using AbilityBuilder) and abilities (createMongoAbility ()) from package *@casl/ability*

### **How Rules Are Shared from the Server to the Frontend in CASL (RBAC)**  

In a **Node.js backend**, role-based access control (RBAC) rules are often defined based on **user roles** and dynamically sent to the **frontend application**. This is typically done by:  
1. **Generating rules on the server** (using `createMongoAbility`)  
2. **Sending them in the API response**  
3. **Applying them in the frontend using CASL (`@casl/ability`)**  

---

### **1️⃣ Backend (Express.js) – Defining & Sending Rules**  
In your Express.js API, you generate **user-specific permissions** based on roles and send them to the frontend.  

#### **📌 Middleware to Generate Ability Rules**
```javascript
const { AbilityBuilder, createMongoAbility } = require("@casl/ability");
abili
// Define user roles and permissions
const defineRulesFor = (user) => {
  const { can, rules } = new AbilityBuilder(createMongoAbility);

  if (user.role === "admin") {
    can("manage", "all"); // Admins can do everything
  } else if (user.role === "editor") {
    can("read", "Post");
    can("update", "Post", { authorId: user.id }); // Editors can update their own posts
  } else {
    can("read", "Post"); // Default role (viewer) can only read
  }

  return rules;
};

// Middleware to attach ability to request object
const setAbility = (req, res, next) => {
  const user = req.user; // Assume user is attached via authentication middleware
  req.ability = createMongoAbility(defineRulesFor(user)); // Create ability instance
  next();
};

module.exports = { setAbility, defineRulesFor };
```

---

#### **📌 Sending Ability Rules to Frontend in API Response**
```javascript
const express = require("express");
const { setAbility, defineRulesFor } = require("./abilityMiddleware");

const app = express();
app.use(express.json());

app.get("/current-user", setAbility, (req, res) => {
  res.json({
    user: req.user,
    rules: defineRulesFor(req.user), // Send rules to the frontend
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```
🔹 **Now, the frontend can receive `rules` dynamically from the backend.**

---

### **2️⃣ Frontend (React) – Using CASL to Apply Rules**  
Once the frontend receives rules, it can use CASL’s `Ability` to enforce permissions.  

#### **📌 Install CASL on the Frontend**
```sh
npm install @casl/ability @casl/react
```

#### **📌 Creating an Ability Instance in React**
Use `useAbility`hook from *@casl/react* package to check permission and it takes Context created using createContext()
```javascript
import { createContext, useContext, useEffect, useState } from "react";
import { Ability, createMongoAbility } from "@casl/ability";
import axios from "axios";

const AbilityContext = createContext();

export const useAppAbility = () => useContext(AbilityContext);

export const AbilityProvider = ({ children }) => {
  const [ability, setAbility] = useState(new Ability([]));

  useEffect(() => {
    axios.get("/current-user").then((response) => {
      const newAbility = createMongoAbility(response.data.rules);
      setAbility(newAbility);
    });
  }, []);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};
```
🔹 **This fetches rules from the API and updates the frontend’s ability dynamically.**

---

### **3️⃣ Enforcing Permissions in React Components**
Now, the frontend can **conditionally render UI elements** based on permissions.

#### **Using `useAppAbility` for Permission Checks**
```javascript
import { useAppAbility } from "../AbilityProvider";

const DeleteButton = ({ post }) => {
  const ability = useAppAbility();

  return (
    ability.can("delete", "Post", post) && <button>Delete Post</button>
  );
};
```

#### **Using `CreateContextualCan` for Cleaner JSX**
```javascript
import { CreateContextualCan } from "@casl/react";
import { useAppAbility } from "../AbilityProvider";

const Can = CreateContextualCan(useAppAbility);

const PostActions = ({ post }) => (
  <div>
    <Can I="update" a="Post" subject={post}>
      <button>Edit Post</button>
    </Can>
    <Can I="delete" a="Post" subject={post}>
      <button>Delete Post</button>
    </Can>
  </div>
);
```
🔹 **If a user doesn’t have permission, the buttons won’t render.**  

---

### **📌 Summary – How Rules Are Shared from Backend to Frontend**
| Step | Backend (Express.js) | Frontend (React) |
|------|----------------------|------------------|
| **1. Define Rules** | Create rules based on the user's role (`defineRulesFor(user)`) | Not applicable |
| **2. Attach Ability** | Middleware (`setAbility`) assigns `req.ability` | Fetch rules from API (`axios.get("/current-user")`) |
| **3. Send Rules** | API response includes `rules` | Store ability in context (`AbilityProvider`) |
| **4. Apply Rules** | Enforce permissions in API (optional) | Use `useAppAbility()` or `CreateContextualCan` to control UI |

---

### **🔹 Why This Approach is Useful**
✅ **Dynamic Role Management** – Backend controls permissions without modifying frontend code.  
✅ **Centralized Security** – All permissions are defined in one place.  
✅ **Seamless Frontend Integration** – React components can automatically update based on new rules.  

Would you like an example where **rules are stored in a database** instead of hardcoded in middleware? 🚀

# Redux Toolkit - Role of extraReducers 

# When to use
1. handling Asynchronous operation within reducer of Slice is not allowed due to its synchronous execution, to execute asynchronous operation and updating state of Slice as per state of Async operation can be possible with *createAsyncThunk* and *extraReducers*
2. When a current slice needs to act external reducer actions
3. When global actions that effect multiple slices

### **What Does `extraReducers` Do in Redux Toolkit?**  

In **Redux Toolkit (RTK)**, `extraReducers` is used inside `createSlice` to handle **external actions**, such as:  
1. **Handling actions from another slice**  
2. **Handling async actions from `createAsyncThunk`**  
3. **Modifying state based on non-slice actions**  

---

### **1️⃣ `extraReducers` with `createAsyncThunk` (Handling Async API Calls)**
`extraReducers` is commonly used with **`createAsyncThunk`** to handle the different states (**pending, fulfilled, rejected**) of an async operation.

#### **Example: Fetching Users from an API**
```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/users");
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: { data: [], loading: false, error: null },
  reducers: {}, // Normal reducers go here
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
```
🔹 **Breakdown:**  
- `fetchUsers.pending` → Sets `loading = true` when the request starts.  
- `fetchUsers.fulfilled` → Stores the fetched data in `state.data`.  
- `fetchUsers.rejected` → Captures any errors.  

---

### **2️⃣ `extraReducers` to Handle Actions from Another Slice**  
Sometimes, one slice needs to listen to actions from another slice.

#### **Example: Handling an Action from Another Slice**
```javascript
import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice"; // Importing an action from authSlice

const userSlice = createSlice({
  name: "users",
  initialState: { data: [], loggedIn: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.loggedIn = false; // Reset user state on logout
      state.data = [];
    });
  },
});

export default userSlice.reducer;
```
```js
import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // Assuming your RTK Query setup

const userSlice = createSlice({
  name: "user",
  initialState: { data: null },
  reducers: {}, // Normal reducers go here
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.getUserInfo.matchFulfilled,
      (state, action) => {
        state.data = action.payload; // Sync user data
      }
    );
  },
});

export default userSlice.reducer;

```
🔹 **Here, when `logout` is dispatched from `authSlice`, `userSlice` resets its state.**  

---

### **3️⃣ `extraReducers` vs. `reducers` – When to Use What?**
| Feature | `reducers` | `extraReducers` |
|---------|------------|----------------|
| Handles actions **inside the slice** | ✅ | ❌ |
| Handles **async thunks** (`createAsyncThunk`) | ❌ | ✅ |
| Handles **actions from other slices** | ❌ | ✅ |
| Automatically generates action creators | ✅ | ❌ (must dispatch manually) |

---

### **📌 When Should You Use `extraReducers`?**
✅ When handling **async actions** from `createAsyncThunk`.  
✅ When listening for **actions from another slice**.  
✅ When handling **global actions** that affect multiple slices.  

### **`extraReducers` Builder Methods in Redux Toolkit**  

When using `extraReducers` in `createSlice`, the **`builder`** parameter provides three main methods:  

| Method | Purpose |
|--------|---------|
| **`builder.addCase`** | Handles a specific action (e.g., `getUserInfo.fulfilled`). |
| **`builder.addMatcher`** | Handles multiple actions that match a condition (e.g., all API success responses). |
| **`builder.addDefaultCase`** | Handles actions that don't match `addCase` or `addMatcher`. |

---

## **1️⃣ `addCase` – Handling a Specific Action**
`addCase` is used when handling a **single, known action**, such as an API response from `createAsyncThunk` or RTK Query.

### ✅ **Example: Handling `getUserInfo.fulfilled`**
```javascript
builder.addCase(getUserInfo.fulfilled, (state, action) => {
  state.data = action.payload;
  state.loading = false;
});
```
🔹 **Best Use Case:** When you **know exactly which action type** to handle.  

---

## **2️⃣ `addMatcher` – Handling Multiple Related Actions**
`addMatcher` is useful when handling **multiple actions with similar behavior**.  

### ✅ **Example: Handling All API Calls (`pending`, `fulfilled`, `rejected`)**
```javascript
builder
  .addMatcher(
    (action) => action.type.endsWith("/pending"), // Matches any action ending with "/pending"
    (state) => {
      state.loading = true;
    }
  )
  .addMatcher(
    (action) => action.type.endsWith("/fulfilled"), // Matches any "/fulfilled" action
    (state, action) => {
      state.data = action.payload;
      state.loading = false;
    }
  )
  .addMatcher(
    (action) => action.type.endsWith("/rejected"), // Matches any "/rejected" action
    (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    }
  );
```
🔹 **Best Use Case:** When handling **multiple similar actions dynamically** (e.g., all API calls).  

---

## **3️⃣ `addDefaultCase` – Handling Unexpected Actions**
If an action doesn't match any `addCase` or `addMatcher`, `addDefaultCase` acts as a **fallback**.

### ✅ **Example: Setting an Error for Unexpected Actions**
```javascript
builder.addDefaultCase((state, action) => {
  console.warn("Unhandled action:", action.type);
  state.error = "Unexpected error occurred";
});
```
🔹 **Best Use Case:** Handling **unknown actions** or setting a fallback state.  

---

### **📌 Summary – When to Use Each Method?**
| Method | Use When... | Example |
|--------|------------|---------|
| **`addCase`** | Handling a **specific action** | `getUserInfo.fulfilled` |
| **`addMatcher`** | Handling **multiple related actions dynamically** | All API calls (`pending`, `fulfilled`, `rejected`) |
| **`addDefaultCase`** | Catching **unexpected actions** | Logging unknown actions |

# Redux TookKit RTK query 
RTX query provide feature rich, reliable flexible API Integration and cache enabled 
API fetching to seamlessly integrated with react application.

- Define the endpoints for mutation and query
- export the hooks built by RTK for defined endpoints 
- provides all states of fetching and method for mutation fecth


# Authentication with @azure/masal-node

### **Demonstrating Authentication in a Node.js Application Using MSAL (Microsoft Authentication Library)**  

Microsoft Authentication Library (`@azure/msal-node`) is used to authenticate users and applications with **Azure Active Directory (Azure AD)**, enabling secure access to Microsoft services like **Graph API, Outlook, SharePoint, and Teams**.  

---

## **1️⃣ Install MSAL for Node.js**
Run the following command to install the required package:  
```sh
npm install @azure/msal-node express dotenv
```

---

## **2️⃣ Configure Azure AD App for Authentication**
Before implementing authentication, you need to **register your application in Azure AD**:  
1. Go to the **Azure Portal** → **Azure Active Directory** → **App registrations** → **New registration**.  
2. Enter a **name** for your app.  
3. Select **"Accounts in any organizational directory (Any Azure AD directory - Multitenant)"**.  
4. Set a **Redirect URI**:  
   - If using localhost: `http://localhost:3000/redirect`  
5. Copy your **Client ID** and **Tenant ID** from the app overview.  
6. Go to **Certificates & Secrets** → **New client secret** → Copy the generated secret.  

---

## **3️⃣ Set Up Environment Variables (`.env`)**
Create a **`.env`** file and add the following credentials:  
```env
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
TENANT_ID=your-tenant-id
REDIRECT_URI=http://localhost:3000/redirect
```

---

## **4️⃣ Implement MSAL Authentication in Node.js**
Create a file **`server.js`** and implement authentication using MSAL:  

```javascript
require("dotenv").config();
const express = require("express");
const { ConfidentialClientApplication } = require("@azure/msal-node");

const app = express();
const port = 3000;

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};
const pca = new ConfidentialClientApplication(msalConfig);

const authCodeUrlParams = {
  scopes: ["user.read"],
  redirectUri: process.env.REDIRECT_URI,
};

// Step 1: Redirect User to Microsoft Login
app.get("/login", async (req, res) => {
  try {
    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParams);
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).send("Error generating auth URL: " + error.message);
  }
});

// Step 2: Handle Redirect and Exchange Code for Token
app.get("/redirect", async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["user.read"],
    redirectUri: process.env.REDIRECT_URI,
  };

  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    res.json({
      message: "Authentication successful!",
      accessToken: response.accessToken,
      user: response.account,
    });
  } catch (error) {
    res.status(500).send("Error acquiring token: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

---

## **5️⃣ Test the Authentication Flow**
1. **Start the server**:  
   ```sh
   node server.js
   ```
2. Open your browser and go to:  
   ```
   http://localhost:3000/login
   ```
3. **Sign in with your Microsoft account** → Redirects to `/redirect`  
4. If authentication is successful, you’ll receive an **access token** in JSON response.  

---

## **6️⃣ Use the Access Token to Call Microsoft Graph API**
After authentication, you can use the access token to fetch user details from Microsoft Graph API.

```javascript
const axios = require("axios");

async function getUserProfile(accessToken) {
  const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
```

---

### **📌 Summary**
✅ **MSAL handles OAuth 2.0 authentication** for Node.js apps.  
✅ **Login flow redirects users to Microsoft login, then exchanges code for an access token**.  
✅ **Access token can be used to call Microsoft Graph API (e.g., fetch user profile, emails, or calendar events)**.  

Would you like to extend this with **role-based access control (RBAC) using Azure AD groups**? 🚀


# Running Scheduled Taks using cron package:
### **What Does the `cron` Package Do?**  

The [`cron`](https://www.npmjs.com/package/cron) package in Node.js is used for **scheduling tasks** to run at specific times, similar to Linux cron jobs. It allows you to execute functions **at fixed intervals**, such as:  

✅ Running a script **every minute, hour, or day**  
✅ Scheduling **database backups** or log cleanups  
✅ Automating **email notifications**  
✅ Performing **API calls at scheduled times**  

---

### **🔹 Installation**  
```sh
npm install cron
```

---

### **🔹 Basic Usage Example**  
```javascript
const { CronJob } = require("cron");

// Run every minute
const job = new CronJob("* * * * *", () => {
  console.log("Task executed at:", new Date());
});

job.start(); // Start the cron job
```
📌 **Breakdown of Cron Syntax (`* * * * *`)**:  
```
┌──────── minute (0-59)
│ ┌────── hour (0-23)
│ │ ┌──── day of month (1-31)
│ │ │ ┌── month (1-12)
│ │ │ │ ┌ day of week (0-6) (Sunday = 0)
* * * * *
```
Example patterns:  
- `0 9 * * *` → Runs every day at **9:00 AM**  
- `*/5 * * * *` → Runs **every 5 minutes**  
- `0 0 1 * *` → Runs **on the first day of every month**  

---

### **🔹 Running a Function at a Specific Time**
```javascript
const job = new CronJob("0 12 * * *", () => {
  console.log("Running a task at 12 PM every day!");
});

job.start();
```

---

### **🔹 Stopping and Restarting a Cron Job**
```javascript
job.stop();  // Stops the cron job
job.start(); // Restarts the cron job
```

---

### **🔹 Use Case: Automatically Delete Old Logs**
```javascript
const fs = require("fs");

const job = new CronJob("0 0 * * *", () => {
  fs.unlink("/path/to/logs.log", (err) => {
    if (!err) console.log("Logs deleted!");
  });
});

job.start();
```

---

### **🔹 When to Use `cron`?**
- Automating **database maintenance** (e.g., clearing old records).  
- Sending **scheduled reports or emails**.  
- **Triggering API calls** (e.g., fetching data at intervals).  
- Running **server maintenance tasks**.  


# PostgreSQL with Sequilize ORM

### **How to Connect a Database with Sequelize in Node.js**  

Sequelize is a popular **ORM (Object-Relational Mapping) library** for Node.js that helps interact with SQL databases like **PostgreSQL, MySQL, and SQLite** using JavaScript instead of raw SQL queries.  

---

## **1️⃣ Install Sequelize and Database Driver**
Run the following command to install Sequelize and your preferred database driver:  

For **PostgreSQL** (recommended):  
```sh
npm install sequelize pg pg-hstore
```
For **MySQL**:  
```sh
npm install sequelize mysql2
```
For **SQLite** (local database):  
```sh
npm install sequelize sqlite3
```

---

## **2️⃣ Initialize Sequelize Connection**
Create a file **`database.js`** to establish the database connection:  

```javascript
const { Sequelize } = require("sequelize");

// Connect to the database
const sequelize = new Sequelize("database_name", "username", "password", {
  host: "localhost", // Change to your DB host (e.g., AWS RDS, DigitalOcean)
  dialect: "postgres", // Change to 'mysql', 'sqlite', etc.
  logging: false, // Disable logging for cleaner console output
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
```

---

## **3️⃣ Define a Model (Table)**
Create a file **`models/User.js`** to define a `User` table:  

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

// Define the User model
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = User;
```

---

## **4️⃣ Sync the Model with Database**
In your main file (e.g., `server.js`), sync the model to create the table:  

```javascript
const sequelize = require("./database");
const User = require("./models/User");

(async () => {
  await sequelize.sync({ force: false }); // Set force to true to drop existing tables
  console.log("✅ Database synchronized successfully!");
})();
```

---

## **5️⃣ Perform CRUD Operations**
Now, you can **insert, read, update, and delete** records easily.

### **Create a User**
```javascript
const newUser = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword",
});
console.log("New user created:", newUser.toJSON());
```

### **Fetch All Users**
```javascript
const users = await User.findAll();
console.log("Users:", users);
```

### **Update a User**
```javascript
await User.update({ name: "John Updated" }, { where: { id: 1 } });
console.log("User updated!");
```

### **Delete a User**
```javascript
await User.destroy({ where: { id: 1 } });
console.log("User deleted!");
```

---

## **6️⃣ Using Sequelize in Express Routes**
In an **Express.js app**, you can use Sequelize like this:  

```javascript
const express = require("express");
const User = require("./models/User");

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### **🔹 Summary**
✅ **Sequelize simplifies database operations** in Node.js.  
✅ **Supports multiple databases** (PostgreSQL, MySQL, SQLite, etc.).  
✅ **Provides easy CRUD operations** without writing raw SQL.  
✅ **Integrates well with Express.js and other frameworks.**  


# GraphQL server
### **GraphQL Basics**  

GraphQL is an alternative to REST APIs that allows clients to request only the data they need. It improves performance by reducing over-fetching and under-fetching.

---

## **1️⃣ GraphQL vs REST API**
| Feature        | REST API                         | GraphQL                     |
|--------------|--------------------------------|------------------------------|
| Data Fetching | Over-fetching/Under-fetching | Exact data as requested      |
| Endpoints     | Multiple for different data  | Single endpoint (`/graphql`) |
| Response      | Fixed structure              | Flexible JSON response       |

---

## **2️⃣ Setting Up a Basic GraphQL Server with Express & Apollo**
### **Step 1: Install Dependencies**
```sh
npm init -y
npm install express graphql express-graphql apollo-server-express mongoose
```

### **Step 2: Create `server.js`**
```javascript
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/graphqlDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("MongoDB connected"));

// Define Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// GraphQL Type Definitions (Schema)
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!): User
  }
`;

// GraphQL Resolvers (Functions for Queries/Mutations)
const resolvers = {
  Query: {
    getUser: async (_, { id }) => await User.findById(id),
    getUsers: async () => await User.find(),
  },
  Mutation: {
    addUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      return await user.save();
    },
  },
};

// Setup Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log("Server running at http://localhost:4000"));
});
```

---

## **3️⃣ GraphQL Query & Mutation Examples**
### **Get All Users**
```graphql
query {
  getUsers {
    id
    name
    email
  }
}
```

### **Get User by ID**
```graphql
query {
  getUser(id: "USER_ID_HERE") {
    name
    email
  }
}
```

### **Create a New User**
```graphql
mutation {
  addUser(name: "John Doe", email: "john@example.com") {
    id
    name
  }
}
```

---

## **4️⃣ GraphQL Best Practices**
✅ **Use Apollo Client for Frontend** - Better caching & state management  
✅ **Optimize Performance** - Use **Dataloader** to batch & cache queries  
✅ **Secure GraphQL APIs** - Use authentication & input validation  

---

## **5️⃣ Additional Learning**
🔗 [Official GraphQL Docs](https://graphql.org/)  
🔗 [Apollo GraphQL Guide](https://www.apollographql.com/)  
🔗 [YouTube: GraphQL in 100 Seconds](https://www.youtube.com/watch?v=ed8SzALpx1Q)  

---

## GraphQL Subscriptions
**GraphQL Subscriptions** allow real-time updates based on events like **user sign-up, feature unlocks, data updates, or status changes**. Unlike **queries** (which fetch data once) and **mutations** (which modify data), **subscriptions** keep a persistent connection open using **WebSockets**.

---

### **📌 How GraphQL Subscriptions Work**
1️⃣ **Client subscribes** to an event (e.g., user sign-up, order status change).  
2️⃣ **Server listens** for changes in the database or application state.  
3️⃣ **Server pushes updates** to all subscribed clients in real-time.  

---

### **🛠 Example: Real-Time User Signups**
Let's say we want to notify clients when **a new user signs up**.

#### **1️⃣ Define Subscription in Schema**
```graphql
type Subscription {
  userSignedUp: User
}
```

#### **2️⃣ Implement Subscription Resolver**
```javascript
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    userSignedUp: {
      subscribe: () => pubsub.asyncIterator(["USER_SIGNED_UP"]),
    },
  },
  Mutation: {
    addUser: async (_, { name, email }) => {
      const newUser = { id: Date.now(), name, email };
      
      // Publish event when a new user is added
      pubsub.publish("USER_SIGNED_UP", { userSignedUp: newUser });

      return newUser;
    },
  },
};
```

#### **3️⃣ Set Up Apollo Server with WebSockets**
```javascript
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            wsServer.close();
          },
        };
      },
    },
  ],
});

server.applyMiddleware({ app });

httpServer.listen(4000, () => {
  console.log("Server running on http://localhost:4000/graphql");
});
```

#### **4️⃣ Frontend: Listen for Subscription Events**
```javascript
import { gql, useSubscription } from "@apollo/client";

const USER_SIGNED_UP = gql`
  subscription {
    userSignedUp {
      id
      name
      email
    }
  }
`;

const NewUserNotification = () => {
  const { data, loading } = useSubscription(USER_SIGNED_UP);

  if (loading) return <p>Listening for new users...</p>;

  return <p>New user signed up: {data?.userSignedUp.name}</p>;
};
```

---

### **🎯 When to Use GraphQL Subscriptions**
✔ **User Notifications** → New messages, order updates, feature unlocks  
✔ **Live Data Updates** → Stock prices, dashboards, analytics  
✔ **Collaboration Features** → Real-time chat, multiplayer editing  

---

💡 **Next Steps:**  
🔹 Implement authentication in subscriptions  
🔹 Optimize performance with Redis PubSub for large-scale apps  

## GraphQl Frontend Integration
Now that you've set up a **GraphQL server** using `apollo-server-express`, the next step is **integrating it into your frontend application**. Since you're experienced in **React.js**, I'll guide you through integrating GraphQL with **Apollo Client** in a React application.  

---

## **1️⃣ Install Apollo Client in React**
Run the following command in your React project:  
```sh
npm install @apollo/client graphql
```

---

## **2️⃣ Setup Apollo Client in React**
Create an **Apollo Client** instance and connect it to your GraphQL server.

### **📌 Create `ApolloProvider.js`**
```javascript
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

// Wrap the app with ApolloProvider
const ApolloWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloWrapper;
```

### **📌 Wrap your App in `index.js`**
```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloWrapper from "./ApolloProvider";

ReactDOM.render(
  <ApolloWrapper>
    <App />
  </ApolloWrapper>,
  document.getElementById("root")
);
```

---

## **3️⃣ Fetch Data Using GraphQL Queries in React**
Now, let's use Apollo Client to fetch data from your GraphQL backend.

### **📌 Create `Users.js`**
```javascript
import React from "react";
import { useQuery, gql } from "@apollo/client";

// Define GraphQL Query
const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      email
    }
  }
`;

const Users = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {data.getUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
```

---

## **4️⃣ Perform Mutations (Add a User)**
Now, let's create a mutation to add a new user.

### **📌 Create `AddUser.js`**
```javascript
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

// Define GraphQL Mutation
const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addUser] = useMutation(ADD_USER, {
    refetchQueries: ["getUsers"], // Refresh users list after adding
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await addUser({ variables: { name, email } });
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUser;
```

---

## **5️⃣ Integrate Components in `App.js`**
Now, use both `Users` and `AddUser` components in your `App.js` file.

### **📌 Update `App.js`**
```javascript
import React from "react";
import Users from "./Users";
import AddUser from "./AddUser";

const App = () => {
  return (
    <div>
      <h1>GraphQL + Apollo Client</h1>
      <AddUser />
      <Users />
    </div>
  );
};

export default App;
```

---

## **6️⃣ Test in Browser**
Start both your **GraphQL Server** and **React App**:
```sh
# Start GraphQL Server
node server.js

# Start React App
npm start
```

Open `http://localhost:3000/` and test the **GraphQL integration**! 🎉

---

## **7️⃣ Additional Enhancements**
✅ **Use Apollo DevTools** - Inspect queries and responses  
✅ **Implement GraphQL Subscriptions** - Real-time updates  
✅ **Implement Pagination** - Use `fetchMore()` for efficient data loading  

Let me know if you need more details on any step! 🚀
Yes! You've captured the key takeaways of integrating GraphQL with a frontend application. Here's a **concise summary** to solidify your understanding:

---

## **📌 GraphQL Takeaways**

1️⃣ **Single Endpoint:**  
   - Unlike REST, GraphQL operates with a single endpoint (`/graphql`).  
   - Clients send **queries/mutations** specifying **only the data they need**.  

2️⃣ **Schema Definition (Types & Operations)**  
   - Use `gql` to define **types**, **queries**, and **mutations**.  
   - Example:  
     ```graphql
     type User {
       id: ID!
       name: String!
       email: String!
     }

     type Query {
       getUsers: [User]
     }

     type Mutation {
       addUser(name: String!, email: String!): User
     }
     ```

3️⃣ **GraphQL Server (`apollo-server-express`)**  
   - Use `ApolloServer` with **typeDefs** and **resolvers** to handle requests.  
   - Example:
     ```javascript
     const { ApolloServer, gql } = require("apollo-server-express");
     const express = require("express");

     const typeDefs = gql`...`; // Define schema here
     const resolvers = { Query: {...}, Mutation: {...} };

     const app = express();
     const server = new ApolloServer({ typeDefs, resolvers });
     server.applyMiddleware({ app });

     app.listen(4000, () => console.log("Server running"));
     ```

4️⃣ **Apollo Client (`@apollo/client`) for Frontend**  
   - Use `ApolloProvider` to wrap your React app.  
   - Connect Apollo Client with **URI (server endpoint)** and **cache**.  
   - Example:
     ```javascript
     import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

     const client = new ApolloClient({
       uri: "http://localhost:4000/graphql",
       cache: new InMemoryCache(),
     });

     <ApolloProvider client={client}>
       <App />
     </ApolloProvider>;
     ```

5️⃣ **Use GraphQL Hooks in React (`useQuery`, `useMutation`)**  
   - Fetch data using **useQuery()**:
     ```javascript
     const GET_USERS = gql`
       query {
         getUsers {
           id
           name
           email
         }
       }
     `;

     const { data, loading, error } = useQuery(GET_USERS);
     ```
   - Mutate data using **useMutation()**:
     ```javascript
     const ADD_USER = gql`
       mutation addUser($name: String!, $email: String!) {
         addUser(name: $name, email: $email) {
           id
           name
           email
         }
       }
     `;

     const [addUser] = useMutation(ADD_USER);
     ```

---

## **🎯 Key Benefits**
✅ **Concise & Goal-Oriented** → Fetch only what you need  
✅ **Simplified API Structure** → Single endpoint for all operations  
✅ **Efficient Data Fetching** → Apollo Client caching reduces network requests  
✅ **Middleware Integration** → Works well with **Express.js**  

---

🚀 **Next Steps:**  
🔹 Learn **GraphQL Subscriptions** for real-time updates  
🔹 Use **Apollo Cache Updates** for optimized UI updates  
🔹 Implement **GraphQL Authentication & Authorization**  

Let me know if you need help with any of these!

# **MongoDB CRUD Operations and Aggregation Demonstration**

Here’s a hands-on demonstration of **CRUD (Create, Read, Update, Delete) operations** and **Aggregation Pipelines** in MongoDB using **MongoDB Shell (`mongosh`)** and **Node.js with Mongoose**.

---

## **1. Setting Up the Database and Collection**
### **Create a Sample Collection**
We'll use a **users** collection with documents like:
```json
{
  "_id": ObjectId("..."),
  "name": "Alice",
  "age": 28,
  "email": "alice@example.com",
  "role": "developer",
  "salary": 80000,
  "skills": ["JavaScript", "React", "Node.js"],
  "joinDate": ISODate("2024-01-15T00:00:00Z")
}
```

---

## **2. CRUD Operations**
### **A. CREATE (Insert Documents)**
#### **Using MongoDB Shell**
```js
db.users.insertMany([
  { name: "Alice", age: 28, email: "alice@example.com", role: "developer", salary: 80000, skills: ["JavaScript", "React", "Node.js"], joinDate: new Date("2024-01-15") },
  { name: "Bob", age: 32, email: "bob@example.com", role: "manager", salary: 120000, skills: ["Leadership", "Project Management"], joinDate: new Date("2023-08-10") },
  { name: "Charlie", age: 26, email: "charlie@example.com", role: "intern", salary: 30000, skills: ["Python", "Django"], joinDate: new Date("2024-03-01") }
]);
```

#### **Using Node.js with Mongoose**
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  role: String,
  salary: Number,
  skills: [String],
  joinDate: Date,
});

const User = mongoose.model("User", userSchema);

async function createUser() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");
  
  const user = new User({
    name: "Alice",
    age: 28,
    email: "alice@example.com",
    role: "developer",
    salary: 80000,
    skills: ["JavaScript", "React", "Node.js"],
    joinDate: new Date("2024-01-15"),
  });

  await user.save();
  console.log("User Created:", user);
  mongoose.connection.close();
}

createUser();
```

---

### **B. READ (Find Documents)**
#### **Find All Users**
```js
db.users.find();
```

#### **Find a User by Role**
```js
db.users.find({ role: "developer" });
```

#### **Using Mongoose (Node.js)**
```js
async function findUsers() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");
  const users = await User.find({ role: "developer" });
  console.log("Developers:", users);
  mongoose.connection.close();
}

findUsers();
```

---

### **C. UPDATE (Modify Documents)**
#### **Update One User's Salary**
```js
db.users.updateOne({ name: "Alice" }, { $set: { salary: 90000 } });
```

#### **Increase Salary for All Developers**
```js
db.users.updateMany({ role: "developer" }, { $inc: { salary: 5000 } });
```

#### **Using Mongoose (Node.js)**
```js
async function updateSalary() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");
  const updatedUser = await User.findOneAndUpdate(
    { name: "Alice" },
    { salary: 90000 },
    { new: true }
  );
  console.log("Updated User:", updatedUser);
  mongoose.connection.close();
}

updateSalary();
```

---

### **D. DELETE (Remove Documents)**
#### **Delete One User**
```js
db.users.deleteOne({ name: "Charlie" });
```

#### **Delete All Interns**
```js
db.users.deleteMany({ role: "intern" });
```

#### **Using Mongoose (Node.js)**
```js
async function deleteUser() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");
  await User.deleteOne({ name: "Charlie" });
  console.log("User Deleted");
  mongoose.connection.close();
}

deleteUser();
```

---

## **3. Aggregation in MongoDB**
MongoDB **aggregation pipelines** process data and return computed results.

### **A. Count Users by Role**
```js
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);
```
**Output:**
```json
[
  { "_id": "developer", "count": 1 },
  { "_id": "manager", "count": 1 }
]
```

### **B. Average Salary per Role**
```js
db.users.aggregate([
  { $group: { _id: "$role", avgSalary: { $avg: "$salary" } } }
]);
```

### **C. Filter Users Who Earn More Than ₹50,000**
```js
db.users.aggregate([
  { $match: { salary: { $gt: 50000 } } }
]);
```

### **D. Sort Users by Salary (Descending)**
```js
db.users.aggregate([
  { $sort: { salary: -1 } }
]);
```

### **E. Select Specific Fields (Projection)**
```js
db.users.aggregate([
  { $project: { name: 1, salary: 1, _id: 0 } }
]);
```

---

## **4. Running Aggregations in Mongoose (Node.js)**
```js
async function aggregateUsers() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");

  const salaryStats = await User.aggregate([
    { $group: { _id: "$role", avgSalary: { $avg: "$salary" } } }
  ]);

  console.log("Average Salary Per Role:", salaryStats);
  mongoose.connection.close();
}

aggregateUsers();
```

---

## **Conclusion**
- **CRUD Operations**: Create, Read, Update, and Delete documents.
- **Aggregation Pipelines**: Grouping, filtering, sorting, and projections.
- **Mongoose Usage**: Implements CRUD and aggregation in a structured way.

### Crud Operations 
Here’s a demonstration of all **Mongoose Model Methods** with **MongoDB** using a `User` model.

---

## **1. Setup**
Before running the operations, ensure:
- You have a **MongoDB server running**.
- **Mongoose is installed** (`npm install mongoose`).

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  role: String,
  salary: Number,
  skills: [String],
  joinDate: Date,
});

const User = mongoose.model("User", userSchema);

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/myDatabase");
  console.log("Connected to MongoDB");
}
```

---

# **CRUD Operations with Mongoose**
## **1. Create Sample Data**
```js
async function createUsers() {
  await User.insertMany([
    { name: "Alice", age: 28, email: "alice@example.com", role: "developer", salary: 80000, skills: ["JavaScript", "React"], joinDate: new Date("2024-01-15") },
    { name: "Bob", age: 32, email: "bob@example.com", role: "manager", salary: 120000, skills: ["Leadership"], joinDate: new Date("2023-08-10") },
    { name: "Charlie", age: 26, email: "charlie@example.com", role: "intern", salary: 30000, skills: ["Python", "Django"], joinDate: new Date("2024-03-01") },
  ]);
  console.log("Users Created");
}
```

---

## **2. DELETE Methods**
### **A. `deleteMany(filter)` → Delete multiple documents**
```js
async function deleteAllInterns() {
  const result = await User.deleteMany({ role: "intern" });
  console.log("Deleted Interns:", result.deletedCount);
}
```

### **B. `deleteOne(filter)` → Delete first matching document**
```js
async function deleteOneUser() {
  const result = await User.deleteOne({ name: "Bob" });
  console.log("Deleted User:", result);
}
```

---

## **3. FIND Methods**
### **C. `find(filter)` → Find multiple users**
```js
async function findDevelopers() {
  const developers = await User.find({ role: "developer" });
  console.log("Developers:", developers);
}
```

### **D. `findById(id)` → Find by `_id`**
```js
async function findUserById(userId) {
  const user = await User.findById(userId);
  console.log("User Found:", user);
}
```

---

## **4. DELETE Methods with ID**
### **E. `findByIdAndDelete(id)` → Find and delete**
```js
async function deleteUserById(userId) {
  const deletedUser = await User.findByIdAndDelete(userId);
  console.log("Deleted User:", deletedUser);
}
```

### **F. `findByIdAndRemove(id)` → (Deprecated) Find and remove**
```js
async function removeUserById(userId) {
  const removedUser = await User.findByIdAndRemove(userId);
  console.log("Removed User:", removedUser);
}
```

---

## **5. UPDATE Methods**
### **G. `findByIdAndUpdate(id, update, options)` → Find by ID and update**
```js
async function updateUserById(userId) {
  const updatedUser = await User.findByIdAndUpdate(userId, { salary: 90000 }, { new: true });
  console.log("Updated User:", updatedUser);
}
```

### **H. `findOne(filter)` → Find first matching document**
```js
async function findOneUser() {
  const user = await User.findOne({ role: "manager" });
  console.log("Manager Found:", user);
}
```

### **I. `findOneAndDelete(filter)` → Find and delete**
```js
async function deleteOneUserByRole() {
  const deletedUser = await User.findOneAndDelete({ role: "intern" });
  console.log("Deleted Intern:", deletedUser);
}
```

### **J. `findOneAndReplace(filter, replacement, options)` → Replace document**
```js
async function replaceUser() {
  const replacedUser = await User.findOneAndReplace(
    { name: "Alice" },
    { name: "Alicia", age: 30, email: "alicia@example.com", role: "senior developer", salary: 95000, skills: ["JavaScript", "React", "Node.js"], joinDate: new Date("2022-06-20") },
    { new: true }
  );
  console.log("Replaced User:", replacedUser);
}
```

### **K. `findOneAndUpdate(filter, update, options)` → Find and update**
```js
async function updateOneUser() {
  const updatedUser = await User.findOneAndUpdate(
    { name: "Charlie" },
    { salary: 35000 },
    { new: true }
  );
  console.log("Updated User:", updatedUser);
}
```

---

## **6. UPDATE MULTIPLE USERS**
### **L. `replaceOne(filter, replacement, options)` → Replace entire document**
```js
async function replaceOneUser() {
  const result = await User.replaceOne(
    { name: "Alice" },
    { name: "Ally", age: 29, email: "ally@example.com", role: "tech lead", salary: 100000, skills: ["JavaScript", "TypeScript"], joinDate: new Date("2021-09-12") }
  );
  console.log("Replace Result:", result);
}
```

### **M. `updateMany(filter, update, options)` → Update multiple users**
```js
async function updateAllDevelopers() {
  const result = await User.updateMany({ role: "developer" }, { $inc: { salary: 5000 } });
  console.log("Updated Developers:", result.modifiedCount);
}
```

### **N. `updateOne(filter, update, options)` → Update first matching document**
```js
async function updateOneUserSalary() {
  const result = await User.updateOne({ name: "Bob" }, { $set: { salary: 125000 } });
  console.log("Updated Bob's Salary:", result);
}
```

---

## **Running the Functions**
```js
async function run() {
  await connectDB();
  await createUsers();              // Insert sample data
  await findDevelopers();           // Find all developers
  await updateAllDevelopers();      // Increase developer salaries
  await deleteOneUser();            // Delete Bob
  await updateOneUserSalary();      // Update Bob’s salary
  await deleteUserById("someId");   // Delete by ID (replace "someId" with actual ID)
  mongoose.connection.close();
}

run();
```

---

## **Summary**
| Method                      | Operation |
|-----------------------------|-----------|
| `deleteMany(filter)`        | Deletes multiple documents |
| `deleteOne(filter)`         | Deletes the first matching document |
| `find(filter)`              | Finds multiple documents |
| `findById(id)`              | Finds a document by `_id` |
| `findByIdAndDelete(id)`     | Finds and deletes a document by `_id` |
| `findByIdAndRemove(id)`     | (Deprecated) Finds and removes by `_id` |
| `findByIdAndUpdate(id, update, options)` | Finds and updates by `_id` |
| `findOne(filter)`           | Finds the first matching document |
| `findOneAndDelete(filter)`  | Finds and deletes the first matching document |
| `findOneAndReplace(filter, replacement, options)` | Finds and replaces a document |
| `findOneAndUpdate(filter, update, options)` | Finds and updates a document |
| `replaceOne(filter, replacement, options)` | Replaces a document |
| `updateMany(filter, update, options)` | Updates multiple documents |
| `updateOne(filter, update, options)` | Updates the first matching document |
### Aggregation in MongDB
## **Common & Useful MongoDB Aggregation Operators**  
MongoDB **aggregation framework** processes data records and returns computed results. It is useful for data transformation, filtering, grouping, and analytics.

---

## **1. `$match` → Filter Documents**  
Filters documents based on criteria (like SQL `WHERE`).  

```js
const pipeline = [
  { $match: { role: "developer", age: { $gte: 25 } } }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **2. `$group` → Group Documents**  
Groups documents and applies aggregate functions like **sum, avg, count, etc.**  

```js
const pipeline = [
  { $group: { _id: "$role", totalSalary: { $sum: "$salary" }, avgSalary: { $avg: "$salary" } } }
];
const result = await User.aggregate(pipeline);
console.log(result);
```
### **Example Output:**  
```json
[
  { "_id": "developer", "totalSalary": 160000, "avgSalary": 80000 },
  { "_id": "manager", "totalSalary": 120000, "avgSalary": 120000 }
]
```

---

## **3. `$sort` → Sort Documents**  
Sorts documents in **ascending (1)** or **descending (-1)** order.  

```js
const pipeline = [
  { $sort: { salary: -1 } }  // Sort by salary in descending order
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **4. `$project` → Include/Exclude Fields**  
Select specific fields and compute new ones.  

```js
const pipeline = [
  { $project: { name: 1, role: 1, annualSalary: { $multiply: ["$salary", 12] } } }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

### **Example Output:**  
```json
[
  { "name": "Alice", "role": "developer", "annualSalary": 960000 },
  { "name": "Bob", "role": "manager", "annualSalary": 1440000 }
]
```

---

## **5. `$unwind` → Flatten Arrays**  
Expands an array field into separate documents.  

```js
const pipeline = [
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 } } }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

### **Example Output:**  
```json
[
  { "_id": "JavaScript", "count": 2 },
  { "_id": "React", "count": 1 },
  { "_id": "Python", "count": 1 }
]
```

---

## **6. `$lookup` → Join Collections (Foreign Key Lookup)**  
Joins `users` collection with `projects` collection.  

```js
const pipeline = [
  { 
    $lookup: {
      from: "projects", // Foreign collection
      localField: "_id",
      foreignField: "userId",
      as: "userProjects"
    }
  }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **7. `$count` → Count Documents**  
Counts total documents after filtering.  

```js
const pipeline = [
  { $match: { role: "developer" } },
  { $count: "developerCount" }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **8. `$limit` and `$skip` → Pagination**  
**Skip first 5 records & return next 10.**  

```js
const pipeline = [
  { $sort: { salary: -1 } },
  { $skip: 5 },
  { $limit: 10 }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **9. `$addFields` → Add Computed Fields**  
Calculates **monthly tax deduction** based on **salary**.  

```js
const pipeline = [
  { 
    $addFields: { 
      monthlyTax: { $multiply: ["$salary", 0.1] }  // 10% tax deduction
    }
  }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **10. `$merge` → Store Aggregation Result in a New Collection**  
Saves the aggregation result into a new collection.  

```js
const pipeline = [
  { 
    $merge: {
      into: "summary",
      whenMatched: "merge",
      whenNotMatched: "insert"
    }
  }
];
const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **Bonus: Full Aggregation Example (Analytics Report)**  

```js
const pipeline = [
  { $match: { role: "developer" } },        // 1. Filter developers
  { $unwind: "$skills" },                   // 2. Expand skills array
  { $group: {                                // 3. Count developers per skill
      _id: "$skills",
      count: { $sum: 1 },
      avgSalary: { $avg: "$salary" }
    } 
  },
  { $sort: { count: -1 } },                 // 4. Sort by popularity
  { $limit: 5 }                             // 5. Top 5 skills
];

const result = await User.aggregate(pipeline);
console.log(result);
```

---

## **Key Aggregation Functions Summary**
| Operator    | Purpose |
|------------|---------|
| `$match`   | Filter documents (like `WHERE`) |
| `$group`   | Group & aggregate (like `GROUP BY`) |
| `$sort`    | Sort results (`ORDER BY`) |
| `$project` | Select fields & compute new ones (`SELECT column`) |
| `$unwind`  | Flatten arrays |
| `$lookup`  | Join collections (Foreign Key Join) |
| `$count`   | Count total documents |
| `$limit` & `$skip` | Pagination |
| `$addFields` | Add computed fields |
| `$merge`   | Store results in a new collection |

## MongoDB replication 
## **Maintaining Data Consistency and Integrity in MongoDB Replica Sets**

MongoDB's **replica sets** provide **high availability** and **fault tolerance**, but ensuring **data consistency and integrity** requires careful configuration and best practices.

---

### **1. Data Consistency in MongoDB Replication**
MongoDB follows an **eventual consistency** model for replication, meaning:
- Writes go to the **primary node**.
- Secondary nodes **replicate asynchronously**.
- There may be a slight lag before all secondaries receive updates.
- If a primary fails, a secondary takes over, possibly before it has all updates.

To **enhance consistency**, you can use:
1. **Write Concern (`w` option)** – Ensures data is written to multiple nodes before acknowledging a write.
2. **Read Concern (`majority`, `linearizable`)** – Controls how fresh the read data is.

---

### **2. Enforcing Data Integrity in MongoDB**
MongoDB does not have strict ACID transactions like relational databases, but you can maintain integrity using:
#### **A. Write Concerns (Ensuring Reliable Writes)**
Use **write concerns** to ensure data is replicated across nodes before confirming a write.

Example:
```js
db.collection.insertOne(
  { name: "Alice", balance: 1000 },
  { writeConcern: { w: "majority", j: true } } // Ensures durability
);
```
- `w: "majority"` → Waits until a majority of nodes acknowledge the write.
- `j: true` → Ensures data is written to the journal before acknowledgment.

#### **B. Read Concerns (Ensuring Fresh Reads)**
Read concern levels:
- `local` (default) → Reads data from the nearest available node.
- `majority` → Ensures data has been written to most nodes before reading.
- `linearizable` → Guarantees strict consistency (but impacts performance).

Example:
```js
db.collection.find({}, { readConcern: { level: "majority" } });
```

#### **C. Transactions for Multi-Document Consistency**
For operations that need **ACID compliance**, use **MongoDB transactions** (available in replica sets).

Example (using Node.js and Mongoose):
```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.updateOne({ _id: userId }, { $inc: { balance: -500 } }, { session });
  await Order.create([{ userId, amount: 500 }], { session });

  await session.commitTransaction();
  session.endSession();
  console.log("Transaction committed");
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  console.error("Transaction aborted", error);
}
```
- Ensures that **both updates happen or neither happens**, preventing data corruption.

---

### **3. Does Sharding Maintain Data Integrity?**
**Sharding** is used for **horizontal scaling**, distributing data across multiple servers (shards). It **does not inherently maintain integrity**, so additional mechanisms are needed.

- **Sharding + Replica Sets**: Each shard should be a **replica set** to ensure redundancy.
- **Cross-Shard Transactions**: MongoDB supports transactions across shards (starting from v4.2), but they can be slower.

**Key Sharding Limitations:**
- Joins across shards are not supported natively.
- Transactions across shards have higher latency.
- Writes must be routed correctly based on the **shard key**.

For strong consistency, **replication with transactions** is preferred over sharding unless dealing with large-scale data distribution.

---

### **4. Best Practices for Data Integrity in MongoDB Replica Sets**
1. **Use Strong Write Concerns** (`majority`, journaling).
2. **Use Majority Read Concerns** to avoid stale reads.
3. **Enable Transactions** for multi-document operations.
4. **Monitor Replication Lag** (`rs.printSecondaryReplicationInfo()`).
5. **Backup Regularly** to recover from failures.

---

### **Final Thoughts**
- **Replica sets ensure availability, not strict consistency** (without extra configurations).
- **Write concerns, read concerns, and transactions** improve data integrity.
- **Sharding does not inherently maintain integrity**, but combining it with replica sets and transactions helps.

## Shredding and Data Integrity in MongoDB

## **Maintaining Data Consistency and Integrity in MongoDB Replica Sets**

MongoDB's **replica sets** provide **high availability** and **fault tolerance**, but ensuring **data consistency and integrity** requires careful configuration and best practices.

---

### **1. Data Consistency in MongoDB Replication**
MongoDB follows an **eventual consistency** model for replication, meaning:
- Writes go to the **primary node**.
- Secondary nodes **replicate asynchronously**.
- There may be a slight lag before all secondaries receive updates.
- If a primary fails, a secondary takes over, possibly before it has all updates.

To **enhance consistency**, you can use:
1. **Write Concern (`w` option)** – Ensures data is written to multiple nodes before acknowledging a write.
2. **Read Concern (`majority`, `linearizable`)** – Controls how fresh the read data is.

---

### **2. Enforcing Data Integrity in MongoDB**
MongoDB does not have strict ACID transactions like relational databases, but you can maintain integrity using:
#### **A. Write Concerns (Ensuring Reliable Writes)**
Use **write concerns** to ensure data is replicated across nodes before confirming a write.

Example:
```js
db.collection.insertOne(
  { name: "Alice", balance: 1000 },
  { writeConcern: { w: "majority", j: true } } // Ensures durability
);
```
- `w: "majority"` → Waits until a majority of nodes acknowledge the write.
- `j: true` → Ensures data is written to the journal before acknowledgment.

#### **B. Read Concerns (Ensuring Fresh Reads)**
Read concern levels:
- `local` (default) → Reads data from the nearest available node.
- `majority` → Ensures data has been written to most nodes before reading.
- `linearizable` → Guarantees strict consistency (but impacts performance).

Example:
```js
db.collection.find({}, { readConcern: { level: "majority" } });
```

#### **C. Transactions for Multi-Document Consistency**
For operations that need **ACID compliance**, use **MongoDB transactions** (available in replica sets).

Example (using Node.js and Mongoose):
```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.updateOne({ _id: userId }, { $inc: { balance: -500 } }, { session });
  await Order.create([{ userId, amount: 500 }], { session });

  await session.commitTransaction();
  session.endSession();
  console.log("Transaction committed");
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  console.error("Transaction aborted", error);
}
```
- Ensures that **both updates happen or neither happens**, preventing data corruption.

---

### **3. Does Sharding Maintain Data Integrity?**
**Sharding** is used for **horizontal scaling**, distributing data across multiple servers (shards). It **does not inherently maintain integrity**, so additional mechanisms are needed.

- **Sharding + Replica Sets**: Each shard should be a **replica set** to ensure redundancy.
- **Cross-Shard Transactions**: MongoDB supports transactions across shards (starting from v4.2), but they can be slower.

**Key Sharding Limitations:**
- Joins across shards are not supported natively.
- Transactions across shards have higher latency.
- Writes must be routed correctly based on the **shard key**.

For strong consistency, **replication with transactions** is preferred over sharding unless dealing with large-scale data distribution.

---

### **4. Best Practices for Data Integrity in MongoDB Replica Sets**
1. **Use Strong Write Concerns** (`majority`, journaling).
2. **Use Majority Read Concerns** to avoid stale reads.
3. **Enable Transactions** for multi-document operations.
4. **Monitor Replication Lag** (`rs.printSecondaryReplicationInfo()`).
5. **Backup Regularly** to recover from failures.

---

### **Final Thoughts**
- **Replica sets ensure availability, not strict consistency** (without extra configurations).
- **Write concerns, read concerns, and transactions** improve data integrity.
- **Sharding does not inherently maintain integrity**, but combining it with replica sets and transactions helps.


# React foundation 
---

### **React Virtual DOM, Diffing Algorithm, and Reconciliation**  

#### **1. Virtual DOM**  
The **Virtual DOM (VDOM)** is a lightweight JavaScript representation of the real DOM, maintained in memory. Instead of directly manipulating the real DOM, React updates this virtual representation first. This helps improve performance since updating the real DOM is costly in terms of speed.  

#### **2. Reconciliation**  
Reconciliation is the process by which React updates the UI efficiently when the application state changes. When a component’s state or props change, React:  
1. Creates a new Virtual DOM tree.  
2. Compares it with the previous Virtual DOM snapshot.  
3. Determines the minimal set of changes required to update the real DOM.  
4. Efficiently applies only those changes to the real DOM.  

#### **3. Diffing Algorithm**  
React uses an optimized **diffing algorithm** to compare the previous and new Virtual DOM trees. Key optimizations include:  
- **Element Type Comparison:** If elements differ (e.g., `<div>` → `<span>`), React destroys the old element and creates a new one.  
- **Keyed Lists Optimization:** In lists, React uses **keys** to track elements efficiently and avoid unnecessary re-renders.  
- **Component Updates:** If a component type remains the same, React updates its props and state instead of replacing the entire DOM node.  

---

### **Refined Explanation of Your Points**  
✅ Virtual DOM is a shadow copy of the real DOM, structured as a tree.  
✅ When component data changes, React updates the Virtual DOM first.  
✅ Using **Reconciliation**, React efficiently finds the differences.  
✅ With the **Diffing Algorithm**, React updates only the necessary parts of the real DOM instead of re-rendering everything.  

## Error Boundaries and Fallback UI

To handle errors in individual React components, you can use **Error Boundaries**.  

### **What is an Error Boundary?**  
An **Error Boundary** is a React component that catches JavaScript errors in its child component tree and renders a fallback UI instead of crashing the entire application.  

### **How to Implement an Error Boundary?**  
React provides a lifecycle method called `componentDidCatch(error, info)`, which can be used in class components to catch errors.  

#### **Step 1: Create an Error Boundary Component**  
```jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>; // Fallback UI
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

#### **Step 2: Wrap Components with Error Boundary**  
```jsx
import ErrorBoundary from "./ErrorBoundary";
import SomeComponent from "./SomeComponent";

function App() {
  return (
    <ErrorBoundary>
      <SomeComponent />
    </ErrorBoundary>
  );
}

export default App;
```

---

### **How About Functional Components?**  
React does not support error boundaries in functional components directly, but you can use the `react-error-boundary` library to achieve similar behavior.  

```bash
npm install react-error-boundary
```

Then, implement it in your component:  
```jsx
import { ErrorBoundary } from "react-error-boundary";

function FallbackComponent({ error }) {
  return <h2>Something went wrong: {error.message}</h2>;
}

function SomeComponent() {
  throw new Error("Test Error");
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <SomeComponent />
    </ErrorBoundary>
  );
}

export default App;
```

---

### **Key Differences Between React Router Error Handling and Error Boundaries**  
| Feature  | React Router (`errorElement`) | Error Boundaries |
|----------|--------------------------|----------------|
| Handles errors in | Specific routes/pages | Individual components |
| Implementation | `errorElement` in `createBrowserRouter` | Wrapping components with `ErrorBoundary` |
| React version support | React Router 6.4+ | React 16+ |
| Works with functional components? | Yes | Needs `react-error-boundary` or a class component |


## React Optimization techniques other than useCallback, useMemo, and Reac.Memo
### **Using `Suspense` with a Fallback Component**  
React's `Suspense` allows you to show a fallback UI while waiting for a component to load.  

#### **Example: Lazy Loading with Suspense**  
```jsx
import React, { Suspense, lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<h2>Loading Component...</h2>}>
      <LazyComponent />
    </Suspense>
  );
}

export default App;
```
- `lazy()` dynamically imports `LazyComponent`.  
- `Suspense` displays **"Loading Component..."** until `LazyComponent` loads.  

---

### **Using `use` (React 18+) for Awaitable Components**  
React 18 introduces the **`use` hook** to handle async functions directly in components.  

#### **Example: Awaiting Data Fetching**  
```jsx
import React, { Suspense, use } from "react";

async function fetchData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return res.json();
}

function DataComponent() {
  const data = use(fetchData());
  return <h2>Todo: {data.title}</h2>;
}

export default function App() {
  return (
    <Suspense fallback={<h2>Loading Data...</h2>}>
      <DataComponent />
    </Suspense>
  );
}
```
### **How It Works**  
1. `fetchData()` is an **async function** that fetches data from an API.  
2. The `use(fetchData())` **pauses rendering** until the promise resolves.  
3. `Suspense` shows `"Loading Data..."` until the data is available.  

---

### **Key Benefits of `Suspense` and `use`**
- **Optimized performance**: Avoids unnecessary renders.
- **Better user experience**: Provides a smooth transition with fallback UI.
- **Cleaner code**: Removes the need for complex loading states.

## Detailed Gude
Here’s a **detailed guide on optimizing performance** in a React application using **Suspense, Fallback, and Lazy Loading** effectively.  

---

## **1. Lazy Loading Components with `React.lazy`**  
This ensures components are loaded **only when needed**, reducing the **initial load time**.  

### **✅ Lazy Load a Component**
```jsx
import React, { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<h2>Loading Dashboard...</h2>}>
      <Dashboard />
    </Suspense>
  );
}

export default App;
```
✔ **Why?**  
- The `Dashboard` component **loads only when required**, reducing the **initial JavaScript bundle size**.  
- **`Suspense` provides a fallback UI** until the component is loaded.  

---

## **2. Lazy Load Routes for Better Navigation Performance**  
Instead of loading all pages upfront, load them **only when the user visits a route**.  

### **✅ Lazy Loading Routes with `React Router`**
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./Home"));
const Profile = lazy(() => import("./Profile"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h2>Loading Page...</h2>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```
✔ **Why?**  
- Reduces **initial page load time**.  
- **Only loads the route the user visits**, keeping the JavaScript bundle size small.  

---

## **3. Lazy Loading Data with Suspense & GraphQL**  
GraphQL allows **data fetching to be suspended until data is available**.

### **✅ Example Using Apollo Client**
```jsx
import { gql, useQuery } from "@apollo/client";
import { Suspense } from "react";

const GET_USER = gql`
  query GetUser {
    user {
      name
      email
    }
  }
`;

function UserComponent() {
  const { data } = useQuery(GET_USER);
  return <h2>User: {data.user.name}</h2>;
}

export default function App() {
  return (
    <Suspense fallback={<h2>Loading User...</h2>}>
      <UserComponent />
    </Suspense>
  );
}
```
✔ **Why?**  
- `Suspense` ensures the UI **doesn’t render** until the **data is available**.  
- Reduces **unnecessary re-renders**.  

---

## **4. Lazy Load Images for Faster Page Load**  
Large images **slow down** web pages. Use the `loading="lazy"` attribute to **load them only when needed**.  

### **✅ Lazy Loading Images**
```jsx
<img src="large-image.jpg" alt="Optimized Image" loading="lazy" />
```
✔ **Why?**  
- **Loads images only when they appear on the screen**.  
- Reduces **initial page load size**.  

---

## **5. Code-Splitting with Dynamic Imports**  
**Code-splitting** improves performance by **loading JavaScript only when needed**.

### **✅ Example with `import()`**
```jsx
function loadDashboard() {
  return import("./Dashboard").then((module) => module.default);
}

async function handleClick() {
  const Dashboard = await loadDashboard();
  console.log("Dashboard loaded:", Dashboard);
}
```
✔ **Why?**  
- Avoids **loading unnecessary JavaScript upfront**.  
- Loads components **only when an event occurs**.  

---

## **6. Fallback Components for a Better User Experience**  
A **fallback component** ensures **users see meaningful content** instead of a blank screen.

### **✅ Fallback Component Example**
```jsx
const FallbackUI = () => <h2>Loading... Please wait.</h2>;

function App() {
  return (
    <Suspense fallback={<FallbackUI />}>
      <LazyComponent />
    </Suspense>
  );
}
```
✔ **Why?**  
- **Enhances the user experience** during loading.  
- **Keeps the UI responsive** while loading components.  

---

## **7. Error Boundaries for Handling Failures Gracefully**  
React’s `Suspense` doesn’t handle **errors**, but you can wrap components with an **Error Boundary**.

### **✅ Example of Error Boundaries**
```jsx
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```
✔ **Why?**  
- Catches **errors in lazy-loaded components**.  
- **Prevents the entire app from breaking**.  

---

## **🚀 Summary of Optimizations**  
| Optimization  | Benefit  |
|--------------|---------|
| **Lazy Loading Components** | Loads components only when needed |
| **Lazy Loading Routes** | Improves navigation speed |
| **Suspense for Data Fetching** | Prevents unnecessary re-renders |
| **Lazy Loading Images** | Optimizes page speed |
| **Code-Splitting with import()** | Loads JavaScript dynamically |
| **Fallback Components** | Improves user experience |
| **Error Boundaries** | Handles errors in lazy-loaded components |

---

## **🔥 Final Thoughts**
By using **lazy loading, Suspense, and fallback components**, your app will:  
✅ **Load faster**  
✅ **Reduce unnecessary re-renders**  
✅ **Enhance user experience**  
