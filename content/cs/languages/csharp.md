---
title: "C#"
category: CS
tags:
  - csharp
  - dotnet
  - object-oriented
date: '2025-10-13'
excerpt: "C# cheat sheet covering data types, control flow, collections, LINQ, async/await, classes, interfaces, and modern language features."
stub: false
verified: false
notionId: 25ba584d-bff3-808d-bd2a-c4d0103ec988
---

C# is a general-purpose high-level programming language supporting multiple paradigms.

---

## Data Types

### Value Types

```csharp
int age = 25;                    // 32-bit integer
long bigNumber = 1000000L;       // 64-bit integer
float price = 19.99f;            // 32-bit floating point
double precise = 19.99;          // 64-bit floating point
decimal money = 19.99m;          // 128-bit precise decimal
bool isActive = true;            // Boolean
char letter = 'A';               // Single character
```

### Reference Types

```csharp
string name = "John";            // String
object obj = new object();       // Base type
int[] numbers = {1, 2, 3};      // Array
```

## Variables & Constants

```csharp
// Variable declaration
int count = 10;
var autoType = "Inferred as string";

// Constants
const double PI = 3.14159;

// Null-safe types
int? nullableInt = null;
string? nullableString = null;
```

## Operators

```csharp
// Arithmetic
+ - * / % ++ --

// Comparison
== != > < >= <=

// Logical
&& || !

// Assignment
= += -= *= /= %=

// Null-coalescing
?? ??=

// Null-conditional
?.
```

## Control Flow

### If-Else

```csharp
if (condition)
{
    // code
}
else if (anotherCondition)
{
    // code
}
else
{
    // code
}
```

### Switch

```csharp
switch (value)
{
    case 1:
        // code
        break;
    case 2:
        // code
        break;
    default:
        // code
        break;
}

// Switch expression (C# 8.0+)
var result = value switch
{
    1 => "One",
    2 => "Two",
    _ => "Other"
};
```

### Loops

```csharp
// For loop
for (int i = 0; i < 10; i++)
{
    Console.WriteLine(i);
}

// While loop
while (condition)
{
    // code
}

// Do-while loop
do
{
    // code
} while (condition);

// Foreach loop
foreach (var item in collection)
{
    Console.WriteLine(item);
}
```

## Collections

### Arrays

```csharp
int[] numbers = new int[5];
string[] names = {"Alice", "Bob", "Charlie"};
int[,] matrix = new int[3, 3];
```

### Lists

```csharp
using System.Collections.Generic;

List<int> numbers = new List<int>();
numbers.Add(1);
numbers.Remove(1);
numbers.Count;
```

### Dictionaries

```csharp
Dictionary<string, int> ages = new Dictionary<string, int>();
ages["John"] = 30;
ages.Add("Jane", 25);
ages.ContainsKey("John");
```

## Methods

```csharp
// Basic method
public int Add(int a, int b)
{
    return a + b;
}

// Void method
public void PrintMessage(string message)
{
    Console.WriteLine(message);
}

// Optional parameters
public void Greet(string name = "Guest")
{
    Console.WriteLine($"Hello, {name}!");
}

// Out parameters
public void GetValues(out int x, out int y)
{
    x = 10;
    y = 20;
}

// Ref parameters
public void Double(ref int number)
{
    number *= 2;
}
```

## Classes & Objects

```csharp
public class Person
{
    // Fields
    private string name;

    // Properties
    public string Name { get; set; }
    public int Age { get; set; }

    // Auto-property
    public string Email { get; set; }

    // Constructor
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    // Method
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name}");
    }
}

// Usage
Person person = new Person("John", 30);
person.Introduce();
```

## Inheritance

```csharp
public class Animal
{
    public virtual void MakeSound()
    {
        Console.WriteLine("Some sound");
    }
}

public class Dog : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
}
```

## Interfaces

```csharp
public interface IDrawable
{
    void Draw();
}

public class Circle : IDrawable
{
    public void Draw()
    {
        Console.WriteLine("Drawing circle");
    }
}
```

## Exception Handling

```csharp
try
{
    // Risky code
    int result = 10 / 0;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"General error: {ex.Message}");
}
finally
{
    // Always executes
    Console.WriteLine("Cleanup");
}
```

## LINQ (Language Integrated Query)

```csharp
using System.Linq;

int[] numbers = {1, 2, 3, 4, 5};

// Query syntax
var evens = from n in numbers
            where n % 2 == 0
            select n;

// Method syntax
var evens2 = numbers.Where(n => n % 2 == 0);

// Common operations
numbers.First();
numbers.Last();
numbers.Count();
numbers.Sum();
numbers.Average();
numbers.Max();
numbers.Min();
numbers.OrderBy(n => n);
numbers.Select(n => n * 2);
```

## Lambda Expressions

```csharp
// Basic lambda
Func<int, int> square = x => x * x;

// Multiple parameters
Func<int, int, int> add = (x, y) => x + y;

// Lambda with body
Func<int, bool> isEven = x =>
{
    return x % 2 == 0;
};
```

## Async/Await

```csharp
public async Task<string> FetchDataAsync()
{
    await Task.Delay(1000);
    return "Data fetched";
}

// Usage
var data = await FetchDataAsync();
```

## String Manipulation

```csharp
string text = "Hello World";

text.Length;
text.ToUpper();
text.ToLower();
text.Substring(0, 5);
text.Contains("Hello");
text.Replace("World", "C#");
text.Split(' ');
string.IsNullOrEmpty(text);

// String interpolation
string name = "John";
string message = $"Hello, {name}!";

// Verbatim string
string path = @"C:\Users\Documents";
```

## File I/O

```csharp
using System.IO;

// Write to file
File.WriteAllText("file.txt", "Hello");

// Read from file
string content = File.ReadAllText("file.txt");

// Append to file
File.AppendAllText("file.txt", "More text");

// Check if file exists
if (File.Exists("file.txt"))
{
    // code
}
```

## Common .NET Namespaces

- `System` - Core types and utilities
- `System.Collections.Generic` - Generic collections
- `System.Linq` - LINQ operations
- `System.IO` - File and stream I/O
- `System.Text` - String manipulation
- `System.Threading.Tasks` - Async programming
- `System.Net.Http` - HTTP client

## Access Modifiers

- `public` - Accessible everywhere
- `private` - Accessible only within class
- `protected` - Accessible within class and derived classes
- `internal` - Accessible within same assembly
- `protected internal` - Protected OR internal

## Modern C# Features

### Pattern Matching

```csharp
object obj = "Hello";
if (obj is string str)
{
    Console.WriteLine(str.Length);
}
```

### Record Types (C# 9.0+)

```csharp
public record Person(string Name, int Age);
```

### Init-only Properties

```csharp
public class Person
{
    public string Name { get; init; }
}
```

This cheat sheet covers the fundamentals of C# and .NET programming for quick reference!
