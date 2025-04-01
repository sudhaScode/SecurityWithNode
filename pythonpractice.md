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