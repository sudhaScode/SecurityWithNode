# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.


""" List Comprehensions are a unique way of quickly creating list with add on logic to items """ 
celcius = [20, 30, 40, 50, 60, 70]
fahrenheit = [(9/5)*temp+32 for temp in celcius]
print(fahrenheit)

even_list = [2, 4, 6,8,10]

odd_list = [odd+1 for odd in even_list]
print("odd_list:: ", odd_list)


""" Stroing or processing a large set of data upfont is high computing and time process to mitigate that python offer generator s special function which returns a value on demand with yield keyword, if any value consumed , it supends the iteration and resumes again when next value is consumes """
def generator(num):
        for i in range(num):
            yield i*3
gen = generator(10)

# print(next(gen))
# print(next(gen))
# print(next(gen))

""" Decorator - special feature offered by pyhton to modifiy exiting function without altering the functionality of  it. keeping pure functions to have their own capabilities """
def high_order_func(normal_fun):
    
    def wrap(*args):
        print("I am first")
        print(normal_fun(*args))
        print("I am last")
    return wrap


@high_order_func
def normal_fun(a,b): # Imperative function - pure functions 
    return a+b
normal_fun(1,2)

""" Custom Exception handling and creating """
class CustomException(Exception):
    def __init_(self, message):
        self.message = message
        super().__init__(self.message)

try:
    if 10/10 == 1:
       raise CustomException("Same nominator and denominator division is not supported")
except CustomException as e:
    print(e)


    """ Regular Expression """
import re

exp = "12345678"
match = re.match(r"[0-9]+", exp)

if match:
    print("Match found:", match.group())
else:
    print("No match found")
    