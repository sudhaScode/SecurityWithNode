### **Python Data Structures - Validation & Corrections**  

#### **Lists**  
✔️ **Correct**  
- **Heterogeneous** (can store different data types)  
- **Ordered** (maintains insertion order)  
- **Index-based retrieval** (`list[index]`)  
- **Mutable** (values can be updated/deleted)  
- **Duplicates allowed**  

✅ **Example:**  
```python
my_list = [1, 2, 3, 1, "a"]
my_list[0] = 100  # ✅ Allowed (mutable)
```

---

#### **Tuples**  
✔️ **Correct (with minor clarification)**  
- **Immutable** (Cannot modify elements after creation)  
- **Ordered** (Maintains insertion order)  
- **Index-based retrieval**  
- **Duplicates allowed**  

✅ **Example:**  
```python
my_tuple = (1, 2, 3, 3, "a")
# my_tuple[0] = 100  ❌ Not allowed (Immutable)
```

---

#### **Sets**  
❌ **Incorrect – Sets are unordered and mutable**  
- **Unordered** (No guarantee of insertion order, especially before Python 3.7)  
- **Mutable** (You can add or remove elements)  
- **Duplicates not allowed**  
- **Set elements must be immutable types (e.g., numbers, strings, tuples)**  

✅ **Corrected Example:**  
```python
my_set = {1, 2, 3, "a"}
my_set.add(5)  # ✅ Allowed (Mutable)
my_set.remove(2)  # ✅ Allowed
```
🔹 *Note:* `{}` creates an **empty dictionary**, not a set. To create an empty set, use `set()`.  

---

#### **Dictionaries**  
❌ **Incorrect – Dictionaries are ordered since Python 3.7**  
- **Key-value pairs** (`key: value`)  
- **Keys must be unique** (Values can be duplicates)  
- **Retrievable by key (`dict[key]`)**  
- **Mutable** (Can update values, add/remove key-value pairs)  
- **Maintains insertion order (Python 3.7+)**  

✅ **Corrected Example:**  
```python
my_dict = {"a": 1, 2: "b"}
my_dict["a"] = 100  # ✅ Allowed (Mutable)
```

---

### **Final Fixes:**  
1. **Sets are unordered, mutable, and don’t allow duplicates.**  
2. **Dictionaries are ordered (since Python 3.7), mutable, and store unique keys.**  
3. **Use `{}` for dictionaries and `set()` for an empty set.**  

### **Advanced Operations on Python Data Structures**  

#### **1. Lists - Advanced Operations**  
Lists allow dynamic operations such as slicing, list comprehensions, and built-in methods for modification.  

##### **(a) List Slicing**
```python
my_list = [10, 20, 30, 40, 50, 60]
print(my_list[1:4])  # [20, 30, 40]
print(my_list[::-1])  # Reverse the list: [60, 50, 40, 30, 20, 10]
```

##### **(b) List Comprehensions (Efficient Iterations)**
```python
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
```

##### **(c) Common List Methods**
```python
my_list.append(70)  # Add an element at the end
my_list.insert(2, 25)  # Insert at index 2
my_list.remove(40)  # Remove specific value
my_list.pop()  # Remove last element
my_list.sort(reverse=True)  # Sort in descending order
print(my_list)
```

---

#### **2. Tuples - Advanced Operations**  
Tuples are immutable but support indexing, slicing, and unpacking.

##### **(a) Tuple Unpacking**
```python
t = (1, 2, 3)
a, b, c = t
print(a, b, c)  # 1 2 3
```

##### **(b) Converting Tuple to List (To Modify)**
```python
t = (10, 20, 30)
t_list = list(t)
t_list.append(40)
t = tuple(t_list)  # Convert back to tuple
print(t)  # (10, 20, 30, 40)
```

---

#### **3. Sets - Advanced Operations**  
Sets support mathematical operations such as union, intersection, and difference.

##### **(a) Set Operations**
```python
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

print(A | B)  # Union: {1, 2, 3, 4, 5, 6}
print(A & B)  # Intersection: {3, 4}
print(A - B)  # Difference: {1, 2}
print(A ^ B)  # Symmetric Difference: {1, 2, 5, 6}
```

##### **(b) Checking Membership**
```python
print(2 in A)  # True
```

##### **(c) Adding & Removing Elements**
```python
A.add(10)
A.remove(3)
print(A)
```

---

#### **4. Dictionaries - Advanced Operations**  
Dictionaries allow efficient lookups, updates, and iteration.

##### **(a) Dictionary Iteration**
```python
my_dict = {"name": "Alice", "age": 25, "city": "New York"}

for key, value in my_dict.items():
    print(f"{key}: {value}")
```

##### **(b) Dictionary Comprehension**
```python
squared_numbers = {x: x ** 2 for x in range(5)}
print(squared_numbers)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

##### **(c) Merging Dictionaries (`update()`)**
```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}

dict1.update(dict2)
print(dict1)  # {'a': 1, 'b': 3, 'c': 4}
```

---

### **Conclusion**
- **Lists:** Slicing, comprehensions, and sorting make them powerful.
- **Tuples:** Immutable but support unpacking.
- **Sets:** Great for unique elements and mathematical operations.
- **Dictionaries:** Efficient key-value lookups and flexible merging.

### **OOP (Object-Oriented Programming) in Python**  
OOP is a programming paradigm that models real-world entities using **classes** (blueprints) and **objects** (instances of classes). It enables **code reusability, scalability, and organization.**  

#### **1. Classes & Objects**  
- A **class** is a blueprint for creating objects, defining their attributes (data members) and behaviors (methods).  
- An **object** is an instance of a class that holds real data.  
```python
class Car:
    def __init__(self, brand, model):
        self.brand = brand  
        self.model = model  

    def show_details(self):
        return f"Car: {self.brand} {self.model}"

my_car = Car("Tesla", "Model S")
print(my_car.show_details())  # Car: Tesla Model S
```

#### **2. Key OOP Principles**  

✅ **Inheritance** – Allows a child class to acquire properties and behaviors of a parent class.  
```python
class ElectricCar(Car):
    def __init__(self, brand, model, battery_capacity):
        super().__init__(brand, model)
        self.battery_capacity = battery_capacity
```
✅ **Polymorphism** – A single interface for different types. Achieved via **method overriding** (runtime polymorphism).  
```python
class Bike:
    def move(self):
        return "Bike is moving"

class Truck:
    def move(self):
        return "Truck is moving"

def transport(vehicle):
    print(vehicle.move())

transport(Bike())   # Bike is moving
transport(Truck())  # Truck is moving
```
✅ **Encapsulation** – Restricts direct access to object attributes.  
```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private variable

    def get_balance(self):
        return self.__balance  # Controlled access

account = BankAccount(1000)
print(account.get_balance())  # 1000
```

✅ **super()** – Calls the **parent class constructor or methods** in a child class.  
```python
class Parent:
    def __init__(self):
        print("Parent Constructor")

class Child(Parent):
    def __init__(self):
        super().__init__()  # Calls Parent's constructor
        print("Child Constructor")

c = Child()
# Output:
# Parent Constructor
# Child Constructor
```
**Corrections in your explanation:**  
1. Polymorphism is not about "achieving one functionality in multiple objects." Instead, it allows the **same interface (method name) to work differently across multiple objects.**  
2. Encapsulation does not mean securing data but rather **restricting direct access to internal details** while exposing controlled methods to interact with them.

---

### **1. Built-in Method Decorators**  
Decorators modify **functions or methods** without changing their core logic.  

✅ **`@staticmethod`**  
- Defines a method that belongs to the class but **does not** have access to the class (`cls`) or instance (`self`).  
- Used for **utility functions** inside a class.  
```python
class Math:
    @staticmethod
    def add(x, y):  # No 'self' or 'cls'
        return x + y

print(Math.add(3, 5))  # ✅ 8
```

✅ **`@classmethod`**  
- Has access to the class (`cls`) but **not** the instance (`self`).  
- Useful when you want to modify **class-level attributes**.  
```python
class Person:
    count = 0  # Class variable

    def __init__(self, name):
        self.name = name
        Person.count += 1

    @classmethod
    def get_count(cls):
        return cls.count

print(Person.get_count())  # ✅ 0 (before instances)
p1 = Person("Alice")
p2 = Person("Bob")
print(Person.get_count())  # ✅ 2 (tracks class-level count)
```

✅ **`@property`** (Getter method for attributes)  
- Used to **define computed properties** that act like attributes but execute logic when accessed.  
```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):  # Acts as an attribute but executes function logic
        return 3.14 * self._radius ** 2

circle = Circle(5)
print(circle.area)  # ✅ 78.5 (no need for `()`)
```

---

### **2. Function Decorators (`@log_time`)**  
Decorators modify **function behavior** without modifying its core logic.  

✅ **Concept Correction**:  
- A **decorator function** takes another function as an argument, modifies its behavior, and returns a new function.  
- `*args` and `**kwargs` ensure the decorator can handle **any function signature.**  

Example:
```python
import time

def log_time(func):  
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} executed in {end_time - start_time:.4f} sec")
        return result
    return wrapper

@log_time
def compute(x):
    time.sleep(1)
    return x ** 2

print(compute(5))  # ✅ Logs execution time and returns 25
```

---

### **Corrections in Your Explanation**
❌ *"These annotations represent methods with special behavior that work the same way as class and object methods."*  
✅ **Correction**:  
- `@staticmethod` **does not** access `self` or `cls`, making it **different** from regular instance methods.  
- `@classmethod` modifies **class attributes**, not instance attributes.  

❌ *"Adding an annotation to a pure function modifies execution according to the decorator function implementation."*  
✅ **Correction**:  
- A decorator **wraps** a function to modify behavior without altering the function itself.  
- `*args` and `**kwargs` **pass all arguments** dynamically to ensure flexibility.

---

---

### **1. Iterators (`__iter__()` and `__next__()`)**  
✅ **Definition:**  
- An **iterator** is an object that implements the **`__iter__()`** and **`__next__()`** methods.  
- It **does not** load the entire dataset upfront but **fetches data lazily**, one item at a time.  
- Iterators are used to traverse iterable objects like **lists, tuples, dictionaries, and sets**.

✅ **How Iterators Work:**  
- The **`__iter__()`** method **returns the iterator object itself**.  
- The **`__next__()`** method returns the **next value** in the sequence and raises a **`StopIteration`** exception when there are no more items left.

### **Example: Creating an Iterator**
```python
class MyNumbers:
    def __init__(self):
        self.num = 1

    def __iter__(self):
        return self  # ✅ Returns itself as an iterator

    def __next__(self):
        if self.num > 5:
            raise StopIteration  # ✅ Ends iteration when condition is met
        val = self.num
        self.num += 1
        return val

obj = MyNumbers()
itr = iter(obj)

print(next(itr))  # ✅ 1
print(next(itr))  # ✅ 2
print(next(itr))  # ✅ 3
```

---

### **2. Generators (`yield` for Memory Efficiency)**  
✅ **Definition:**  
- A **generator** is a special type of iterator **defined using a function and `yield` keyword**.  
- **Unlike iterators**, generators **do not store all values in memory**; instead, they **generate values on demand**.
- The **execution is suspended** at `yield` and **resumed** when `next()` is called.

✅ **Key Differences Between Generators and Iterators**  
| Feature | Iterators | Generators |
|---------|----------|------------|
| Definition | Uses `__iter__()` & `__next__()` | Uses `yield` inside a function |
| Memory | Stores data | Does **not** store data (lazy evaluation) |
| Usage | Explicitly maintains state | Auto-resumes execution |

### **Example: Creating a Generator**
```python
def my_generator():
    yield 1  # ✅ Suspends execution here
    yield 2
    yield 3  # ✅ Resumes from here when next() is called

gen = my_generator()
print(next(gen))  # ✅ 1
print(next(gen))  # ✅ 2
print(next(gen))  # ✅ 3
# Calling next(gen) again will raise StopIteration
```

✅ **Real-World Use Case: Streaming Large Files**
```python
def read_large_file(file_path):
    with open(file_path, "r") as file:
        for line in file:
            yield line  # ✅ Reads one line at a time (memory-efficient)

for line in read_large_file("large.txt"):
    print(line)  # ✅ Processes one line at a time instead of loading the whole file
```

---

### **Corrections in Your Explanation**
❌ *"Iterators load the entire dataset upfront."*  
✅ **Correction**:  
- Iterators **do not** load data upfront; they fetch **one item at a time**, making them **memory efficient**.  
- **Lists and tuples** (not iterators) load data upfront.

❌ *"Generators return an iterator which sends the value on request and suspends the iteration."*  
✅ **Correction**:  
- Generators **are themselves iterators**, meaning they do **not return an iterator** but rather behave like one.  
- They **pause execution at `yield`** and resume **without losing state**.
---

### **1. Asynchronous Programming (`async` & `await`)**
✅ **Definition:**  
- Asynchronous programming allows non-blocking execution, meaning the program **doesn't pause** while waiting for time-consuming tasks (e.g., API requests, database calls, file I/O).  
- It is implemented using **event loops**, which schedule tasks and switch between them efficiently.  
- `async` and `await` are used to define and run asynchronous functions.  

✅ **Key Concepts:**  
- **`async def`** → Defines an asynchronous function (coroutine).  
- **`await`** → Suspends execution of the coroutine until the awaited task completes.  
- Unlike regular functions, **calling an `async` function does not execute it immediately**; instead, it returns a **coroutine object** that needs to be scheduled (e.g., with `asyncio.run()`).

---

### **2. `asyncio` Module (For Concurrent Execution)**
✅ **Definition:**  
- **`asyncio`** provides tools for running asynchronous tasks concurrently.  
- It allows scheduling multiple coroutines **without blocking the main thread**.  

✅ **Example: Running Multiple Tasks Concurrently**
```python
import asyncio

async def fetch_data():
    print("Fetching data...")
    await asyncio.sleep(3)  # Simulates network delay
    print("Data fetched")
    return {"data": "sample"}

async def main():
    task1 = asyncio.create_task(fetch_data())  # ✅ Runs asynchronously
    task2 = asyncio.create_task(fetch_data())  # ✅ Runs asynchronously
    await task1  # ✅ Wait for task1 to complete
    await task2  # ✅ Wait for task2 to complete

asyncio.run(main())  # ✅ Starts the event loop
```
### **What Happens Here?**
1. **`asyncio.create_task()`** schedules tasks **without blocking** the execution.
2. Both **tasks start at the same time** (instead of one waiting for the other).
3. **`await asyncio.sleep(3)`** suspends execution **without blocking the entire program**.
4. Execution resumes when the sleep is over, and both tasks complete.

---

### **3. Synchronous vs. Asynchronous Execution**
| Feature | Synchronous (Blocking) | Asynchronous (Non-Blocking) |
|---------|------------------|------------------|
| Execution | One task at a time | Multiple tasks concurrently |
| Performance | Slow for I/O-bound tasks | Faster for I/O-bound tasks |
| Code Example | `time.sleep(3)` blocks execution | `await asyncio.sleep(3)` does not block |

---

### **Corrections in Your Explanation**
❌ *"Implemented by event loop without waiting for completion of async operation, execution moves to the next line."*  
✅ **Correction:**  
- **The event loop manages execution**, but an `await` **does wait for the async operation to complete**—it **just doesn’t block** the entire program.  
- Execution **pauses at `await` but other scheduled tasks can still run**.

❌ *"`asyncio` makes code execution without blocking for long-running tasks."*  
✅ **Correction:**  
- `asyncio` allows **concurrent execution** of multiple coroutines, but **each coroutine still "waits" at `await`**.  
- It prevents blocking the entire application while waiting for I/O operations.

---

### **Bonus: Running Async Code in Real-World Scenarios**
✅ **Example: Fetching Multiple APIs Concurrently**  
```python
import asyncio
import aiohttp  # Asynchronous HTTP requests

async def fetch_url(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    urls = ["https://example.com", "https://httpbin.org/get"]
    tasks = [fetch_url(url) for url in urls]
    responses = await asyncio.gather(*tasks)  # ✅ Run all requests concurrently
    print(responses)

asyncio.run(main())
```
✅ **Why is this better?**  
- Instead of making one request at a time, this fetches **both URLs in parallel**, making it much **faster than sequential execution**

---

## **1. File Handling in Python**  
✅ **Definition:**  
- Python allows **reading/writing** files using the `open()` function.  
- Files can be handled using **file handlers** and **the `os` module** for path manipulations.  

✅ **Key Operations:**  
- `open(filename, mode)`: Opens a file in different modes:
  - **Read (`"r"`)** → Opens file for reading (default).
  - **Write (`"w"`)** → Opens file for writing (overwrites if exists).
  - **Append (`"a"`)** → Opens file for writing (adds content without overwriting).
  - **Binary (`"rb"`, `"wb"`)** → Handles binary files (e.g., images, PDFs).
  - **Read/Write (`"r+"`, `"w+"`)** → Reads and writes to a file.

✅ **File Closing:**  
- **Files should be closed manually** using `.close()` to free resources.  
- **Better approach:** Use a **context manager (`with`)**, which **automatically closes the file** after execution.  

✅ **Example: Using Context Manager (`with`)**
```python
with open("example.txt", "w") as file:
    file.write("Hello, World!")  # ✅ File is closed automatically after this block
```
**Why use `with`?**  
- ✅ Avoids memory leaks.  
- ✅ Ensures file closure even if an error occurs.  

---

## **2. Exception Handling in Python**
✅ **Definition:**  
- **Handles runtime errors** and **prevents program crashes**.  
- The `try-except-finally` block is used to catch and handle errors.  

✅ **Key Components:**  
1. **`try:`** Contains the code that might raise an exception.  
2. **`except:`** Catches and handles exceptions.  
3. **`finally:`** Always executes (even if an exception occurs).  

✅ **Example: Handling File Errors**
```python
try:
    with open("non_existing_file.txt", "r") as file:
        data = file.read()
except FileNotFoundError:
    print("File not found, please check the filename!")
finally:
    print("Execution completed.")  # ✅ This always runs
```
✅ **Why use `finally`?**  
- Ensures that important cleanup operations (e.g., closing files, releasing memory) are performed **even if an error occurs**.  

---

## **Corrections in Your Explanation**
❌ *"Reading or writing data from/to files are synchronous in nature."*  
✅ **Correction:**  
- **File I/O is blocking (synchronous) by default**, but **async file handling** can be done using `aiofiles` for non-blocking operations.  

❌ *"The code written inside block taken by except to catch potential errors caused."*  
✅ **Correction:**  
- The `except` block **catches errors raised in the `try` block** and allows the program to continue running.  

---