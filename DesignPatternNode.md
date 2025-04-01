### **🔹 Common Design Patterns for MERN Stack Developers**  
Since **MERN (MongoDB, Express.js, React.js, Node.js)** is more **functional** and **component-driven**, traditional **OOP-based design patterns** like **Singleton or Factory** are used less frequently. Instead, developers follow **modular, scalable, and reusable patterns** suited for **JavaScript (ES6+), functional programming, and async workflows**.

---

## **🔹 1️⃣ Modular Folder Structure (Separation of Concerns)**  
📌 **Why?** Improves maintainability by keeping backend, frontend, routes, and services organized.

✅ **Example Folder Structure for a MERN Project**
```
project/
│── backend/
│   │── controllers/   # Business logic (Express.js)
│   │── routes/        # API endpoints
│   │── models/        # Mongoose Schemas
│   │── services/      # External API calls, authentication, etc.
│   │── middleware/    # Express.js middleware (Auth, Logging)
│   │── utils/         # Helper functions
│   │── server.js      # Entry point
│
│── frontend/
│   │── components/    # Reusable React Components
│   │── pages/         # Page-level Components
│   │── hooks/         # Custom React Hooks
│   │── context/       # Global State Management (React Context)
│   │── services/      # API Calls (Axios, Fetch)
│   │── App.js         # Root Component
```
📌 **Benefits:**  
✅ Cleaner **code organization**  
✅ Reusable **components and API services**  

---

## **🔹 2️⃣ Middleware Pattern (Express.js)**
📌 **Why?** Helps apply cross-cutting concerns like **authentication, logging, and error handling**.

✅ **Example: Custom Middleware for Authentication**
```javascript
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Proceed to the next middleware or route
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
```
📌 **Usage in Routes:**
```javascript
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to Dashboard", user: req.user });
});

module.exports = router;
```
✅ **Benefits:**  
✔ Makes **authentication reusable**  
✔ Keeps **routes clean**  

---

## **🔹 3️⃣ Service Layer Pattern (API Calls & Business Logic)**
📌 **Why?** Separates **API requests and business logic** from controllers and components.

✅ **Example: Service for Fetching Users**
```javascript
// services/userService.js
const User = require("../models/User");

const getUserById = async (userId) => {
    return await User.findById(userId);
};

module.exports = { getUserById };
```
📌 **Usage in Controller:**
```javascript
const { getUserById } = require("../services/userService");

const getUserController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
```
✅ **Benefits:**  
✔ **Separates business logic** from Express.js controllers  
✔ **Easier to test and modify**  

---

## **🔹 4️⃣ Factory Pattern (Mongoose Model Factory)**
📌 **Why?** Avoids duplicate logic when creating database models.

✅ **Example: Mongoose Factory for Creating Users**
```javascript
// factories/userFactory.js
const User = require("../models/User");

const createUser = (name, email, password) => {
    return new User({ name, email, password });
};

module.exports = { createUser };
```
📌 **Usage in Routes:**
```javascript
const { createUser } = require("../factories/userFactory");

router.post("/register", async (req, res) => {
    const user = createUser(req.body.name, req.body.email, req.body.password);
    await user.save();
    res.json(user);
});
```
✅ **Benefits:**  
✔ Simplifies **creating objects dynamically**  
✔ Keeps **code DRY**  

---

## **🔹 5️⃣ Observer Pattern (Event-Driven Architecture)**
📌 **Why?** Helps handle **real-time events** like notifications, email sending, or logging.

✅ **Example: Using Node.js EventEmitter**
```javascript
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// Event Listener
eventEmitter.on("user_registered", (user) => {
    console.log(`Sending welcome email to ${user.email}`);
});

// Trigger Event
const registerUser = (user) => {
    console.log(`Registering user: ${user.name}`);
    eventEmitter.emit("user_registered", user); // Trigger Event
};

registerUser({ name: "John", email: "john@example.com" });
```
✅ **Benefits:**  
✔ Great for **real-time notifications**  
✔ Improves **scalability** in microservices  

---

## **🔹 6️⃣ Higher-Order Component (HOC) Pattern (React.js)**
📌 **Why?** Helps reuse logic across multiple components.

✅ **Example: `withAuth` HOC for Protecting Routes**
```javascript
import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
    return (props) => {
        const isAuthenticated = localStorage.getItem("token") !== null;
        return isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />;
    };
};

export default withAuth;
```
📌 **Usage in a Protected Component:**
```javascript
import withAuth from "./hoc/withAuth";
const Dashboard = () => <h1>Welcome to Dashboard</h1>;
export default withAuth(Dashboard);
```
✅ **Benefits:**  
✔ **Reusable authentication logic**  
✔ Works with **multiple components**  

---

## **🔹 7️⃣ Custom Hook Pattern (React.js)**
📌 **Why?** Encapsulates reusable logic inside **custom hooks**.

✅ **Example: Custom Hook for Fetching Data**
```javascript
import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data);
            setLoading(false);
        });
    }, [url]);

    return { data, loading };
};

export default useFetch;
```
📌 **Usage in Component:**
```javascript
const Users = () => {
    const { data, loading } = useFetch("/api/users");

    if (loading) return <p>Loading...</p>;
    return <ul>{data.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
};
```
✅ **Benefits:**  
✔ Simplifies **API fetching logic**  
✔ Reduces **boilerplate code**  

---

## **✨ Summary of MERN Design Patterns**
| Pattern | Used In | Benefit |
|---------|--------|---------|
| **Modular Folder Structure** | Full-Stack | Clean organization |
| **Middleware Pattern** | Express.js | Centralized authentication/logging |
| **Service Layer Pattern** | Express.js | Separates business logic |
| **Factory Pattern** | Mongoose | Simplifies object creation |
| **Observer Pattern** | Node.js | Event-driven programming |
| **HOC Pattern** | React.js | Reusable component logic |
| **Custom Hooks** | React.js | Reusable data fetching |

---

## **🚀 Final Thoughts**
✅ **MERN Stack uses more functional programming & modularization** than classical OOP.  
✅ **Use middleware, services, and hooks** to keep code **scalable and reusable**.  
✅ **Follow modular structure** to separate concerns between frontend and backend.  

# **🔹 Good Design Patterns for Developers**  
Writing **clean, reusable, and maintainable** code is crucial for long-term project success. Here are some essential design patterns and best practices every developer should follow.  

---

## **🔹 1️⃣ DRY (Don’t Repeat Yourself) – Reusability**  
**🔹 Principle:** Avoid duplicating logic by using functions, classes, and reusable modules.  

✅ **Example: Instead of repeating logic, use functions**  
```python
# ❌ Bad: Repeating logic
print("Hello, John")
print("Hello, Alice")

# ✅ Good: DRY principle applied
def greet(name):
    print(f"Hello, {name}")

greet("John")
greet("Alice")
```
✅ **Use modules for code reuse**  
```python
# greetings.py (Reusable Module)
def greet(name):
    return f"Hello, {name}"
```
```python
# main.py (Importing module)
from greetings import greet
print(greet("John"))  # Output: Hello, John
```

---

## **🔹 2️⃣ SOLID Principles – OOP Best Practices**
For **better code structure**, follow the **SOLID** principles in Object-Oriented Programming (OOP).  

### **🔸 S – Single Responsibility Principle (SRP)**  
🔹 **A class should have only one reason to change.**  
✅ **Example:** Instead of handling both **data storage & formatting** in one class, separate concerns.  
```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    def save_to_db(self, user):
        print(f"Saving {user.name} to database")

class UserService:
    def send_email(self, user):
        print(f"Sending email to {user.email}")
```
📌 **Why?** Each class has a **single responsibility**.

---

### **🔸 O – Open/Closed Principle (OCP)**  
🔹 **Classes should be open for extension but closed for modification.**  
✅ **Example: Use Inheritance Instead of Modifying a Class**  
```python
class Payment:
    def pay(self):
        raise NotImplementedError()

class CreditCardPayment(Payment):
    def pay(self):
        print("Paid using Credit Card")

class PayPalPayment(Payment):
    def pay(self):
        print("Paid using PayPal")

# Adding new payment methods without modifying existing code
payments = [CreditCardPayment(), PayPalPayment()]
for p in payments:
    p.pay()
```
📌 **Why?** New payment types can be added **without modifying** existing classes.

---

## **🔹 3️⃣ Code Organization – Modules & Imports**  
🔹 Keep code organized by **splitting it into modules**.

📌 **Folder Structure Example:**
```
project/
│── app.py
│── services/
│   │── auth_service.py
│   │── payment_service.py
│── models/
│   │── user.py
│   │── order.py
│── utils/
│   │── logger.py
```
✅ **Using Modules:**  
```python
# services/auth_service.py
def authenticate(user):
    print(f"Authenticating {user}")
```
```python
# main.py
from services.auth_service import authenticate
authenticate("John")  # Output: Authenticating John
```
📌 **Why?** Better **code reuse, maintainability, and readability**.

---

## **🔹 4️⃣ Factory Pattern – Object Creation Best Practice**  
🔹 The **Factory Pattern** helps create objects dynamically without modifying existing code.  

✅ **Example: Creating Different Object Types**  
```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class AnimalFactory:
    @staticmethod
    def get_animal(animal_type):
        animals = {"dog": Dog(), "cat": Cat()}
        return animals.get(animal_type.lower())

# Usage
animal = AnimalFactory.get_animal("dog")
print(animal.speak())  # Output: Woof!
```
📌 **Why?** Adding new animals is easy **without modifying existing code**.

---

## **🔹 5️⃣ Singleton Pattern – Ensuring a Single Instance**  
🔹 Use **Singleton Pattern** when only **one instance** of a class should exist (e.g., **database connection, logging**).

✅ **Example: Singleton Implementation**  
```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# Usage
s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # Output: True (Same Instance)
```
📌 **Why?** Prevents unnecessary multiple object creation.

---

## **🔹 6️⃣ Decorator Pattern – Extending Functionality**  
🔹 Decorators allow **modifying function behavior dynamically** without changing its code.

✅ **Example: Logging Decorator**  
```python
def log_function(func):
    def wrapper(*args, **kwargs):
        print(f"Executing {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_function
def say_hello():
    print("Hello!")

say_hello()
```
📌 **Why?** Adds logging **without modifying the original function**.

---

## **🔹 7️⃣ Observer Pattern – Event-Driven Programming**  
🔹 When **one change should notify multiple components** (e.g., **pub/sub messaging**).

✅ **Example: Event Subscription**  
```python
class EventManager:
    def __init__(self):
        self.listeners = []

    def subscribe(self, listener):
        self.listeners.append(listener)

    def notify(self, data):
        for listener in self.listeners:
            listener.update(data)

class Listener:
    def update(self, data):
        print(f"Received event data: {data}")

# Usage
event_manager = EventManager()
listener1 = Listener()
event_manager.subscribe(listener1)

event_manager.notify("New Event Occurred!")  # Output: Received event data: New Event Occurred!
```
📌 **Why?** Useful for **real-time notifications**.

---

## **🔹 8️⃣ Strategy Pattern – Dynamic Behavior Change**  
🔹 Helps change a **function’s behavior dynamically**.

✅ **Example: Changing Sorting Algorithms Dynamically**  
```python
class QuickSort:
    def sort(self, data):
        return sorted(data)  # Dummy quicksort implementation

class MergeSort:
    def sort(self, data):
        return sorted(data)  # Dummy mergesort implementation

class SortContext:
    def __init__(self, strategy):
        self.strategy = strategy

    def execute_sort(self, data):
        return self.strategy.sort(data)

# Usage
sorter = SortContext(QuickSort())
print(sorter.execute_sort([3, 1, 2]))  # Output: [1, 2, 3]

sorter.strategy = MergeSort()
print(sorter.execute_sort([3, 1, 2]))  # Output: [1, 2, 3]
```
📌 **Why?** Swap strategies dynamically **without modifying existing code**.

---

## **✨ Summary of Good Design Patterns**
| Pattern | Use Case |
|---------|---------|
| **DRY Principle** | Avoid code duplication using functions & modules |
| **SOLID Principles** | Write maintainable, scalable OOP code |
| **Factory Pattern** | Create objects dynamically |
| **Singleton Pattern** | Ensure a **single instance** of a class (e.g., logging, database connection) |
| **Decorator Pattern** | Extend function behavior dynamically |
| **Observer Pattern** | Notify multiple components on change (e.g., real-time updates) |
| **Strategy Pattern** | Switch behavior dynamically (e.g., different sorting algorithms) |

---

## **🚀 Final Thoughts**
✅ Use **DRY, SOLID, and Modular Code** for maintainability.  
✅ **Organize code** using **modules and imports**.  
✅ Implement **design patterns** where needed (Factory, Singleton, Decorator).  


---

## **1. Node.js Event Loop & Non-Blocking I/O**
✅ **Definition:**  
- **Node.js is a single-threaded, event-driven JavaScript runtime** designed for **asynchronous programming**.  
- It **handles multiple tasks concurrently** using **event-driven architecture** without blocking the main thread.  

✅ **How Event Loop Works:**  
1. **Async task starts execution.**  
2. **Event Loop registers the task & moves on** without waiting for completion.  
3. **Task completes asynchronously** (via OS, worker threads, or async APIs).  
4. **Callback function processes the result** when the task finishes.  
5. **Event Loop continues execution** of queued tasks.  

✅ **Components of the Event Loop:**
- **Call Stack** → Executes synchronous JavaScript code.  
- **Callback Queue** → Holds callbacks waiting for execution.  
- **Microtask Queue** → Handles high-priority tasks (e.g., Promises, `process.nextTick()`).  
- **Timers Queue** → Handles scheduled functions (`setTimeout`, `setInterval`).  

✅ **Example: Non-Blocking I/O**
```javascript
const fs = require("fs");

console.log("Start");

// Asynchronous file read
fs.readFile("example.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log("File Content:", data);
});

console.log("End"); // ✅ Runs before file read completes
```
**Output Order:**  
```
Start  
End  
File Content: (data from example.txt)
```
✅ **Why?** → **File I/O is handled asynchronously** while the event loop continues execution.

---

## **2. Ways to Achieve Non-Blocking I/O**
### **1️⃣ Microtasks & Promises**
✅ **Microtasks (Promises, `process.nextTick()`) run before normal callbacks.**  
- Promises represent asynchronous operations with states:  
  - **Pending** → Task started.  
  - **Fulfilled** → Task completed successfully.  
  - **Rejected** → Task failed.  
✅ **Handled using `.then()`, `.catch()`, and `.finally()`.**  
```javascript
console.log("Before Promise");

Promise.resolve().then(() => console.log("Promise Resolved"));

console.log("After Promise");
```
**Output Order:**  
```
Before Promise  
After Promise  
Promise Resolved  ✅ (Microtask executed after sync code)
```
---

### **2️⃣ Callbacks**
✅ **Traditional approach** → Pass a function as an argument to an async function.  
```javascript
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 2000);
}

fetchData((data) => console.log(data)); // ✅ Callback function executed after async task
```
✅ **Issue:** Callback Hell (nested callbacks).  

---

### **3️⃣ Async/Await**
✅ **Modern approach** → Writes asynchronous code like synchronous code.  
✅ **Uses `async` for functions & `await` for waiting on async tasks.**  
```javascript
async function fetchData() {
    console.log("Fetching...");
    let data = await new Promise((resolve) => setTimeout(() => resolve("Data Ready"), 2000));
    console.log(data); // ✅ Executes after 2s, looks like sync code
}
fetchData();
```
✅ **Why use Async/Await?**  
- **Improves readability.**  
- **Handles errors using `try...catch` easily.**  
- **No Callback Hell!**  

---

## **Corrections & Refinements**
❌ *"Microtask implemented by promises, which tracks eventual completion of asynchronous tasks, it represents a process by different states fulfilled, rejected, partially fulfilled."*  
✅ **Correction:**  
- **"Microtasks (Promises, `process.nextTick()`) are executed before the Callback Queue, ensuring prioritized execution."**  

❌ *"Event loop handles the tasks to push to queue and stack."*  
✅ **Correction:**  
- **"Event Loop picks tasks from different queues (Callback Queue, Microtask Queue, Timers) and executes them in order."**  

## **Streams & Buffers in Node.js**
Streams and Buffers are **core concepts in Node.js** that help **handle large amounts of data efficiently** without loading everything into memory at once.

---

# **1️⃣ What are Streams?**
- **Streams** are used to handle **large amounts of data** efficiently.
- Instead of loading **entire files or network responses**, **streams process data in chunks**.
- They are **memory-efficient and fast** for handling I/O operations.

### **Examples of Data That Uses Streams:**
✅ **File reading/writing**  
✅ **HTTP requests & responses**  
✅ **Real-time data processing (e.g., video streaming, logs, chat apps)**  

---

# **2️⃣ Types of Streams in Node.js**
There are **4 types** of streams in Node.js:

### **🔹 1. Readable Streams**
➡ Used to **read data chunk by chunk**.  
➡ Example: **Reading a file, getting data from an HTTP request.**  

✅ **Example: Reading a file using a Readable Stream**
```javascript
const fs = require('fs');

const readStream = fs.createReadStream('data.txt', 'utf8');

readStream.on('data', (chunk) => {
    console.log("Received Chunk:", chunk);
});

readStream.on('end', () => {
    console.log("File Read Completed.");
});
```
**How It Works?**
- `fs.createReadStream('data.txt')` opens a stream to read the file.
- The `'data'` event fires whenever a chunk is received.
- The `'end'` event fires when reading is complete.

---

### **🔹 2. Writable Streams**
➡ Used to **write data chunk by chunk**.  
➡ Example: **Writing to a file, sending data to an API.**  

✅ **Example: Writing to a file using a Writable Stream**
```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello, this is a chunk of data.\n');
writeStream.write('Another chunk of data.');
writeStream.end();

writeStream.on('finish', () => {
    console.log("Writing to file completed.");
});
```
**How It Works?**
- `fs.createWriteStream('output.txt')` creates a stream to write to a file.
- `.write()` sends data chunks.
- `.end()` signals that writing is done.
- `'finish'` event fires when writing is complete.

---

### **🔹 3. Duplex Streams**
➡ **Can read & write data simultaneously** (like a two-way communication).  
➡ Example: **Sockets, TCP connections, WebSockets.**

✅ **Example: Custom Duplex Stream**
```javascript
const { Duplex } = require('stream');

const duplexStream = new Duplex({
    write(chunk, encoding, callback) {
        console.log("Writing:", chunk.toString());
        callback();
    },
    read(size) {
        this.push("Data from Duplex Stream\n");
        this.push(null);  // Ends the stream
    }
});

duplexStream.write("Client Request");
duplexStream.on("data", (chunk) => console.log("Received:", chunk.toString()));
```
**How It Works?**
- Implements **both `write()` & `read()`** methods.
- Allows **simultaneous** reading & writing.

---

### **🔹 4. Transform Streams**
➡ A special type of **Duplex Stream** that **modifies data while reading & writing**.  
➡ Example: **Compression, encryption, data transformation.**

✅ **Example: Converting Text to Uppercase (Transform Stream)**
```javascript
const { Transform } = require('stream');

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

process.stdin.pipe(transformStream).pipe(process.stdout);
```
**How It Works?**
- **Takes input**, processes it, and **outputs modified data**.
- Uses **`.pipe()`** to connect streams.

---

# **3️⃣ What is a Buffer?**
- A **Buffer** is a **temporary storage** for **binary data**.
- Used when **reading or writing files, network packets, or any binary data**.

### ✅ **Example: Creating & Using Buffers**
```javascript
const buffer = Buffer.from('Hello, Node.js');
console.log(buffer.toString());  // Converts back to text
console.log(buffer.toString('hex'));  // Converts to hexadecimal
console.log(buffer.toString('base64'));  // Converts to base64 encoding
```
**Key Points:**
- Buffers handle **binary data**.
- Used in **file I/O, networking, and data encoding**.
- Supports **different encodings** like UTF-8, Base64, and Hex.

---

# **4️⃣ Streams vs Buffers**
| Feature  | **Streams**  | **Buffers**  |
|----------|------------|------------|
| **Data Handling** | Processes data in **chunks** | Stores data **entirely** in memory |
| **Memory Usage** | **Low (efficient for large files)** | **High (loads entire file into memory)** |
| **Performance** | **Fast** | **Slower for large data** |
| **Use Cases** | File I/O, HTTP requests, logs, real-time data | Encoding, network packets, file conversions |

---

# **5️⃣ Summary**
✅ **Streams are efficient for handling large data** (files, network, etc.)  
✅ **There are 4 types of streams:** Readable, Writable, Duplex, Transform  
✅ **Buffers store binary data for temporary processing**  
✅ **Use streams for large files, Buffers for small binary data**  
