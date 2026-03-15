---
title: JavaScript
category: CS
tags:
  - javascript
  - web
  - ecmascript
  - node
date: '2024-08-24'
excerpt: 'Overview of JavaScript, the core web programming language covering its runtime model, hoisting, Node.js, and falsy values.'
stub: false
verified: false
notionId: 9995630c-a7fd-402e-b727-2ecedfec90f4
---

JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.7% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries. All major web browsers have a dedicated JavaScript engine to execute the code on users' devices.

JavaScript is a high-level, often just-in-time compiled language that conforms to the ECMAScript standard. It has dynamic typing, prototype-based object-orientation, and first-class functions. It is multi-paradigm, supporting event-driven, functional, and imperative programming styles. It has application programming interfaces (APIs) for working with text, dates, regular expressions, standard data structures, and the Document Object Model (DOM).

The ECMAScript standard does not include any input/output (I/O), such as networking, storage, or graphics facilities. In practice, the web browser or other runtime system provides JavaScript APIs for I/O.

JavaScript engines were originally used only in web browsers, but are now core components of some servers and a variety of applications. The most popular runtime system for this usage is Node.js.

## Hoisting

Hoisting refers to the process whereby the interpreter appears to move the declaration of functions, variables, classes, or imports to the top of their scope, prior to execution of the code.

## Node.js

Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser.

Node.js lets developers use JavaScript to write command line tools and for server-side scripting. The ability to run JavaScript code on the server is often used to generate dynamic web page content before the page is sent to the user's web browser. Consequently, Node.js represents a "JavaScript everywhere" paradigm, unifying web-application development around a single programming language, as opposed to using different languages for the server- versus client-side programming.

Node.js has an event-driven architecture capable of asynchronous I/O. These design choices aim to optimize throughput and scalability in web applications with many input/output operations, as well as for real-time Web applications (e.g., real-time communication programs and browser games).

## Falsy Values

A falsy (sometimes written falsy) value is a value that is considered false when encountered in a Boolean context.

JavaScript uses type conversion to coerce any value to a Boolean in contexts that require it, such as conditionals and loops.

The following table provides a complete list of JavaScript falsy values:

| Value | Type | Description |
|---|---|---|
| `null` | Null | |
| `undefined` | Undefined | |
| `false` | Boolean | |
| `NaN` | Number | NaN — not a number |
| `0` | Number | The Number zero, also including 0.0, 0x0, etc. |
| `""` | String | Empty string value, also including `''` and `` `` |
| `document.all` | Object | The only falsy object in JavaScript is the built-in `document.all` |

The values `null` and `undefined` are also nullish.
