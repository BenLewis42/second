---
title: TypeScript
category: CS
tags:
  - typescript
  - javascript
  - static-typing
  - generics
date: '2025-10-14'
excerpt: 'Comprehensive TypeScript reference covering types, generics, utility types, decorators, modules, and modern features like the using keyword.'
stub: false
verified: false
notionId: 28ba584d-bff3-80cd-8bde-ce0d977bbec2
---

TypeScript is a high-level programming language that adds static typing with optional type annotations to [[JavaScript]]. It is designed for developing large applications and transpiles to JavaScript.

---

## Installation and Setup

```bash
# Install TypeScript globally
npm install -g typescript

# Compile TypeScript file
tsc file.ts

# Initialize tsconfig.json
tsc --init
```

---

## Basic Types

```typescript
let isActive: boolean = true;
let age: number = 25;
let name: string = "Ben";

let ids: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

let tuple: [string, number] = ["score", 100];
enum Direction { Up, Down, Left, Right }

let anyValue: any = "could be anything";
let unknownValue: unknown = 10;
```

---

## Type Inference and Assertions

```typescript
let x = 10;              // inferred as number
let value: unknown = "Hi";
let len = (value as string).length;  // assertion

// or
let len2 = (<string>value).length;
```

---

## Functions

```typescript
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string = "World"): void {
  console.log(`Hello, ${name}!`);
}

const subtract = (a: number, b: number): number => a - b;

// Optional / Rest parameters
function log(message?: string) {}
function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b);
}
```

---

## Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // optional
}

let user: User = {
  id: 1,
  name: "Ben"
};

// Extending interfaces
interface Admin extends User {
  role: string;
}
```

---

## Classes

```typescript
class Person {
  constructor(
    public name: string,
    private age: number
  ) {}

  greet(): void {
    console.log(`Hi, I'm ${this.name}`);
  }
}

class Employee extends Person {
  constructor(name: string, age: number, public role: string) {
    super(name, age);
  }
}
```

---

## Union and Intersection Types

```typescript
type ID = string | number;

function printId(id: ID) {
  console.log(id);
}

interface Person {
  name: string;
}

interface Contact {
  email: string;
}

type Employee = Person & Contact;
```

---

## Type Aliases

```typescript
type Point = {
  x: number;
  y: number;
};

let coord: Point = { x: 10, y: 20 };
```

---

## Type Narrowing

```typescript
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

---

## Never and Void

```typescript
function fail(message: string): never {
  throw new Error(message);
}

function logMessage(msg: string): void {
  console.log(msg);
}
```

---

## Enums

Enums are used to define a set of named constants, useful when you have a fixed group of related values (like directions, states, or statuses).

### Numeric Enums (Default Behavior)

By default, TypeScript assigns numeric values starting from 0:

```typescript
enum Direction {
  Up,       // 0
  Down,     // 1
  Left,     // 2
  Right     // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0
```

You can also manually assign values, and the rest will auto-increment:

```typescript
enum Status {
  Pending = 1,
  InProgress, // 2
  Completed,  // 3
}
```

### String Enums

Each member has a string value. String enums don't auto-increment, so you must specify every value.

```typescript
enum FileAccess {
  Read = "READ",
  Write = "WRITE",
  Execute = "EXECUTE"
}

let permission: FileAccess = FileAccess.Read;
console.log(permission); // "READ"
```

### Mixed Enums

You can mix string and numeric values (though it's not recommended for clarity):

```typescript
enum Result {
  Success = 1,
  Failure = "FAIL"
}
```

### Enums as Types

Enums can be used just like union types to restrict values:

```typescript
enum LogLevel {
  Info,
  Warning,
  Error
}

function logMessage(level: LogLevel, message: string) {
  console.log(`[${LogLevel[level]}]: ${message}`);
}

logMessage(LogLevel.Info, "App started");
```

---

## Literal Types

Literal types let you specify exact values that a variable or parameter can hold, instead of broad types like string or number.

### String Literal Types

```typescript
let direction: "up" | "down" | "left" | "right";

direction = "up";     // OK
direction = "left";   // OK
direction = "forward"; // Error
```

### Numeric Literal Types

```typescript
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;

diceRoll = 3; // OK
diceRoll = 7; // Error
```

### Boolean Literal Types

```typescript
type Toggle = true | false;
let switchState: Toggle = true;
```

### Combining Literal Types with Type Aliases

```typescript
type Direction = "up" | "down" | "left" | "right";
type Speed = 10 | 20 | 30;

function move(direction: Direction, speed: Speed) {
  console.log(`Moving ${direction} at ${speed} mph`);
}

move("up", 20);  // OK
move("sideways", 40); // Error
```

### Literal Types with Objects (Discriminated Unions)

Literal types often power discriminated unions, used for safer object handling:

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape) {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2;
  if (shape.kind === "square") return shape.side ** 2;
}

console.log(area({ kind: "square", side: 5 })); // 25
```

This guarantees you handle every possible variant with no missing cases.

### Literal Inference with `as const`

By default, TypeScript widens literals to general types ("hello" becomes string). Use `as const` to lock them as literal values:

```typescript
let direction = "up";         // type: string
let fixedDirection = "up" as const; // type: "up"

const config = {
  env: "dev",
  retry: 3
} as const;
// config.env type = "dev", not string
```

---

## Generics

Generics let you create reusable, type-safe components that work with any data type while preserving that type information. They're one of the most powerful features of TypeScript.

### Generic Functions

You can create a function that works with multiple types using a type parameter (usually `<T>`):

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity("Hello"); // TypeScript infers <string>
```

`<T>` acts like a placeholder type that TypeScript fills in automatically when called.

### Multiple Type Parameters

You can pass more than one generic type:

```typescript
function pair<K, V>(key: K, value: V) {
  return { key, value };
}

const result = pair<string, number>("age", 30);
// result: { key: string; value: number }
```

### Constraining Generics

You can limit what types a generic can accept using `extends`.

```typescript
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("Hello");       // OK - string has length
logLength([1, 2, 3]);     // OK - array has length
// logLength(42);         // Error - number doesn't
```

### Default Type Parameters

You can specify a default type in case none is provided.

```typescript
function fetchData<T = string>(): T {
  // some mock return
  return "Data loaded" as T;
}

const data = fetchData(); // inferred as string
```

### Generic Interfaces

Interfaces can be parameterized with types too:

```typescript
interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: "text" };
const numberBox: Box<number> = { content: 123 };
```

### Generic Classes

Classes can use generics to store or return flexible, strongly typed data.

```typescript
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}

const userRepo = new Repository<string>();
userRepo.add("Ben");
userRepo.add("Alice");
console.log(userRepo.getAll()); // ["Ben", "Alice"]
```

### Generic Constraints with `keyof`

`keyof` lets you refer to property names of another type, great for enforcing valid keys.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = { id: 1, name: "Ben", active: true };
getProperty(user, "name");   // OK - "Ben"
// getProperty(user, "email"); // Error - not a key of user
```

### Generic Utility Functions

Combining generics with built-in utilities is extremely powerful.

```typescript
function merge<T, U>(objA: T, objB: U): T & U {
  return { ...objA, ...objB };
}

const combined = merge({ name: "Ben" }, { age: 30 });
// combined: { name: string; age: number }
```

### Generic Type Aliases

You can create reusable type patterns:

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
};

const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Ben" },
  status: 200
};
```

---

## `keyof` Operator

The `keyof` operator creates a union type of all property names (keys) of an object type or interface. It's like saying: "Give me all the valid keys of this type."

### Basic Usage

```typescript
interface Person {
  id: number;
  name: string;
  active: boolean;
}

type PersonKeys = keyof Person;
// Equivalent to: "id" | "name" | "active"

let key: PersonKeys = "name";  // OK
// key = "email";              // Error - not a key of Person
```

Result: `keyof Person` gives you a type union of all keys in `Person`.

### Using with Index Access

You can use `keyof` with indexed access to create reusable, type-safe property getters.

```typescript
type PersonValue = Person[keyof Person];
// Equivalent to: number | string | boolean
```

### Generic Functions with `keyof`

A classic and safe pattern for accessing object properties dynamically:

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ben", active: true };

getValue(user, "name");   // OK - returns string
getValue(user, "active"); // OK - returns boolean
// getValue(user, "email"); // Error
```

This ensures you can only access keys that actually exist on `obj`.

### Dynamic Object Mapping

You can use `keyof` to loop through or transform an object safely:

```typescript
function logKeys<T>(obj: T) {
  (Object.keys(obj) as (keyof T)[]).forEach(key => {
    console.log(`${String(key)}: ${obj[key]}`);
  });
}

logKeys({ id: 1, name: "Ben", active: true });
```

Here, `Object.keys(obj)` normally returns `string[]`, but casting it to `(keyof T)[]` preserves type safety.

### Restricting Allowed Keys

Use `keyof` to constrain what keys are valid in a parameter or mapped type.

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(k => (result[k] = obj[k]));
  return result;
}

const user = { id: 1, name: "Ben", active: true };
const partialUser = pick(user, ["id", "name"]); // OK
```

### Combining `keyof` with `typeof`

You can extract keys directly from a runtime object using `typeof`.

```typescript
const settings = {
  theme: "dark",
  version: 2,
  beta: false
};

type SettingsKeys = keyof typeof settings;
// "theme" | "version" | "beta"

let key: SettingsKeys = "theme"; // OK
```

### `keyof` with Mapped Types

`keyof` powers many utility types in TypeScript (like `Pick`, `Omit`, and `Record`). Example of building your own simplified utility type:

```typescript
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Todo {
  title: string;
  done: boolean;
}

const todo: MyReadonly<Todo> = { title: "Learn TS", done: false };
// todo.done = true; // Error (readonly)
```

---

## Utility Types

TypeScript includes several built-in utility types that help transform other types, perfect for shaping interfaces, building partial models, or enforcing immutability.

### `Partial<T>`

Makes all properties in a type optional. Useful for updating or constructing objects gradually.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;

const updateUser: PartialUser = {
  name: "Ben" // OK - no need to include id or email
};
```

### `Required<T>`

Makes all properties mandatory, even optional ones in the base type.

```typescript
interface Settings {
  darkMode?: boolean;
  notifications?: boolean;
}

type StrictSettings = Required<Settings>;

const s: StrictSettings = {
  darkMode: true,
  notifications: false
}; // OK - must include all
```

### `Readonly<T>`

Makes all properties immutable (cannot be reassigned).

```typescript
interface Config {
  host: string;
  port: number;
}

const server: Readonly<Config> = {
  host: "localhost",
  port: 8080
};

// server.port = 3000; // Error - read-only
```

### `Pick<T, K>`

Selects a subset of properties from a type.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const t: TodoPreview = {
  title: "Learn TypeScript",
  completed: false
};
```

### `Omit<T, K>`

Removes specific properties from a type. Think of it as the opposite of `Pick`.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type SimpleTodo = Omit<Todo, "description">;

const s: SimpleTodo = {
  title: "Learn TypeScript",
  completed: true
};
```

### `Record<K, T>`

Creates an object type with keys of `K` and values of `T`.

```typescript
type Role = "admin" | "editor" | "viewer";

const accessLevels: Record<Role, number> = {
  admin: 3,
  editor: 2,
  viewer: 1
};
```

### Exclude and Extract

- `Exclude<T, U>` removes types from `T` that are assignable to `U`.
- `Extract<T, U>` keeps only types in `T` assignable to `U`.

```typescript
type Status = "success" | "error" | "loading";

type NonError = Exclude<Status, "error">; // "success" | "loading"
type OnlyError = Extract<Status, "error">; // "error"
```

### ReturnType and Parameters

Extract metadata from functions.

```typescript
function getUser() {
  return { id: 1, name: "Ben" };
}

type UserType = ReturnType<typeof getUser>; // { id: number; name: string; }

type FuncParams = Parameters<(x: string, y: number) => void>; // [string, number]
```

### InstanceType and ConstructorParameters

Extract metadata from classes.

```typescript
class Car {
  constructor(public make: string, public model: string) {}
}

type CarType = InstanceType<typeof Car>; // Car
type CarArgs = ConstructorParameters<typeof Car>; // [string, string]
```

---

## Conditional Types

Powerful for deriving new types from others.

```typescript
type IsString<T> = T extends string ? "yes" : "no";
type Test1 = IsString<string>; // "yes"
type Test2 = IsString<number>; // "no"
```

---

## Extending Types

### Using `extends` in Interfaces

You can build new interfaces on top of others.

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
}

const emp: Employee = {
  name: "Ben",
  age: 30,
  employeeId: "E123"
};
```

### Extending Types (with `&`)

Use intersection types (`&`) to merge multiple types.

```typescript
type Contact = { email: string };
type Employee = Person & Contact; // merge

const e: Employee = {
  name: "Ben",
  age: 30,
  email: "ben@example.com"
};
```

### Extending Generics

```typescript
function getAge<T extends { age: number }>(obj: T) {
  return obj.age;
}
getAge({ name: "Ben", age: 30 });
```

---

## Using `typeof` to Capture Types from Values

`typeof` lets you extract a type from an existing value.

```typescript
const defaultUser = {
  id: 1,
  name: "Ben",
  email: "ben@example.com"
};

type User = typeof defaultUser;

const newUser: User = { id: 2, name: "Alice", email: "alice@example.com" };
```

Common for syncing runtime objects with static types.

---

## Indexed Access Types

Access a specific property's type dynamically.

```typescript
type UserEmail = User["email"]; // string
type UserIdOrName = User["id" | "name"]; // number | string
```

---

## Mapped Types

Transform or iterate over keys in a type using the `in` operator.

```typescript
type OptionalUser = {
  [K in keyof User]?: User[K];
};
```

Equivalent to `Partial<User>`.

---

## Combining Tools - Real Example

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

type UserResponse = ApiResponse<User>;

// Extract type of `data`
type ResponseData = UserResponse["data"]; // User

// Pick only selected metadata from User
type MinimalUser = Pick<User, "id" | "email">;
```

---

## Decorators

Decorators are special functions that add metadata or behavior to classes, methods, properties, or parameters. They are executed at runtime and must be enabled with:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### Creating a Method Decorator

A method decorator lets you modify or wrap how a class method behaves.

#### Example: Logging Calls

```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = original.apply(this, args);
    console.log(`${propertyKey} returned`, result);
    return result;
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Calling add with [2, 3]
// add returned 5
```

Notes:
- `target` is the class prototype.
- `propertyKey` is the name of the method.
- `descriptor` lets you override or extend behavior.

### Creating Decorator Factories

A decorator factory is a function that returns a decorator, perfect when you need parameters.

#### Example: Log Level

```typescript
function LogLevel(level: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`[${level}] ${propertyKey} called with`, args);
      return original.apply(this, args);
    };
  };
}

class Greeter {
  @LogLevel("INFO")
  greet(name: string) {
    return `Hello, ${name}`;
  }
}

new Greeter().greet("Ben");
// Output: [INFO] greet called with ['Ben']
```

### Creating a Class Decorator

A class decorator can modify or replace an entire class definition.

#### Example: Add Metadata

```typescript
function WithTimestamp<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    timestamp = new Date();
  };
}

@WithTimestamp
class Report {
  title = "Monthly Report";
}

const report = new Report();
console.log(report.title, report.timestamp);
// Output: Monthly Report 2025-10-14T...
```

Notes:
- A class decorator takes the constructor as input.
- You can extend, wrap, or replace the class entirely.

### Creating a Property Decorator

A property decorator runs when a class property is defined, useful for validation or metadata tagging.

#### Example: Readonly Property

```typescript
function Readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Settings {
  @Readonly
  version = "1.0.0";
}

const config = new Settings();
console.log(config.version); // "1.0.0"
config.version = "2.0.0";    // TypeError in strict mode
```

#### Example: Add Metadata

```typescript
function Label(label: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("label", label, target, propertyKey);
  };
}

import "reflect-metadata";

class Form {
  @Label("Email Address")
  email: string = "";
}

console.log(Reflect.getMetadata("label", Form.prototype, "email"));
// Output: "Email Address"
```

---

## `using` Keyword for Resource Management

`using` lets you automatically dispose of resources when they go out of scope, ideal for database connections, file handles, or custom classes that manage external resources. The resource must have a `[Symbol.dispose]` or `[Symbol.asyncDispose]` method.

### Automatic Cleanup

```typescript
class FileHandle {
  constructor(private filename: string) {
    console.log(`Opening file: ${filename}`);
  }

  [Symbol.dispose]() {
    console.log(`Closing file: ${this.filename}`);
  }
}

function readFile() {
  using file = new FileHandle("data.txt");
  console.log("Reading file contents...");
  // When this function ends, [Symbol.dispose] is called automatically
}

readFile();

// Output:
// Opening file: data.txt
// Reading file contents...
// Closing file: data.txt
```

### Async Example

If your cleanup needs to be asynchronous, implement `[Symbol.asyncDispose]` and use `await using`.

```typescript
class AsyncConnection {
  constructor(private url: string) {
    console.log(`Connecting to ${url}`);
  }

  async [Symbol.asyncDispose]() {
    console.log(`Closing connection to ${this.url}`);
  }
}

async function fetchData() {
  await using conn = new AsyncConnection("https://api.example.com");
  console.log("Fetching data...");
}

await fetchData();

// Output:
// Connecting to https://api.example.com
// Fetching data...
// Closing connection to https://api.example.com
```

---

## Modules

### Module Basics

- Modules are files with their own scope.
- Anything declared in a module is private by default unless exported.
- Use `export` and `import` to share code across files.

```typescript
// mathUtils.ts
export const PI = 3.14;

export function add(a: number, b: number): number {
  return a + b;
}

// circle.ts
import { PI, add } from "./mathUtils";

console.log(add(PI, 2)); // 5.14
```

### Default Exports

Each module can have one default export.

```typescript
// logger.ts
export default function log(msg: string) {
  console.log(msg);
}

// app.ts
import log from "./logger";

log("Hello"); // "Hello"
```

### Export Variants

| Export Type | Syntax | Notes |
|---|---|---|
| Named Export | `export const x = ...` | Multiple per file |
| Default Export | `export default ...` | Only one per file |
| Re-export | `export { x } from "./file"` | Forward exports |
| Re-export all | `export * from "./file"` | Forward everything |

### Sharing Code with Imports and Exports

```typescript
// shapes.ts
export interface Shape { area(): number; }

// rectangle.ts
import { Shape } from "./shapes";

export class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  area() { return this.width * this.height; }
}

// main.ts
import { Rectangle } from "./rectangle";

const rect = new Rectangle(5, 10);
console.log(rect.area()); // 50
```

### Ambient Modules (Declaring Global Types)

Use ambient modules when importing libraries without type declarations. Syntax: `declare module "module-name"`;

```typescript
// typings/globals.d.ts
declare module "cool-library" {
  export function doSomething(): void;
}

// usage.ts
import { doSomething } from "cool-library";

doSomething();
```

Ambient modules can also define global types:

```typescript
declare global {
  interface Window {
    myAppVersion: string;
  }
}

window.myAppVersion = "1.0";
```

### Declaration Merging

TypeScript allows merging multiple declarations into one (interfaces, namespaces, functions).

```typescript
// user.ts
interface User {
  name: string;
}

// user-extended.ts
interface User {
  age: number;
}

const ben: User = { name: "Ben", age: 30 }; // OK - merged type
```

Works for namespaces, interfaces, functions, and enums.

### Executing Modular Code

Use a module loader (like Node.js or bundler) to run modules.

In Node.js with TypeScript:

```bash
tsc --module commonjs main.ts
node main.js
```

In ES Modules:

```typescript
// main.ts
import { PI } from "./mathUtils.js";
console.log(PI);
```

Modern TypeScript and Node.js supports ESNext module syntax and `.mts`/`.cts` extensions for ESM/CJS distinction.

### Module Resolution

- Relative paths (`./`, `../`) refer to local files
- Non-relative paths look in `node_modules`
- Controlled by `tsconfig.json` options:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": { "@utils/*": ["utils/*"] }
  }
}
```

---

## tsconfig.json (Common Settings)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## Working with JavaScript

Using a JS library with TypeScript - install types for it:

```bash
npm install --save-dev @types/lodash
```
