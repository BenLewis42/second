---
title: Computer Science
category: CS
tags:
  - computer-science
  - programming
  - algorithms
  - complexity
  - networking
  - oop
date: '2026-03-13'
excerpt: 'The fundamental concern of computer science is determining what can and cannot be automated. Notes on paradigms, complexity, Turing machines, networking, and more.'
stub: false
verified: false
notionId: f7ff93b0-c139-4659-9d23-c24917158212
---

*The fundamental concern of computer science is determining what can and cannot be automated.*

## Programming Paradigms

### Object-Oriented Programming

Organizes code around objects that bundle together data and the operations that work on that data. A Car object might store its color and model while providing methods to drive or stop. The key insight is **encapsulation**: keeping related data and behavior together in coherent units.

### Functional Programming

Takes a mathematical approach, treating computation as the evaluation of functions that transform inputs into outputs. These functions avoid changing state or producing side effects. Complex operations emerge from composing simple functions together. **Purely functional programming** represents the strictest form, where all functions are deterministic with no side effects.

### Procedural Programming

Organizes code as a series of procedures or routines that execute in sequence. The emphasis is on the explicit flow of control through the program.

### Imperative vs Declarative

- **Imperative**: explicitly describes *how* to achieve a result through step-by-step commands that modify program state
- **Declarative**: focuses on describing *what* you want without specifying the detailed steps

Data pipelines often use procedural approaches for ETL, object-oriented designs for architecture, and functional concepts for transformations (especially in Spark or SQL).

## State

A **stateful** system is designed to remember preceding events or user interactions. The set of states a system can occupy is known as its **state space**.

- **Imperative**: state is external to code
- **Object-oriented**: state is part of code
- **Functional**: state does not exist

## Complexity

### Time Complexity

As the input size grows, how much longer does the algorithm take to complete?

- **Constant time O(1)**: bounded by a value independent of input size (e.g., array element access)
- **Logarithmic time O(log n)**: input is being reduced by a percentage at every step (e.g., binary search)
- **Linear time O(n)**: running time increases at most linearly with input size

### Space Complexity

As the input size grows, how much more memory does the algorithm use?

### Big O Notation

Describes how operations scale with input. When calculating: ignore constants (8n = n), and for terms of the same variable, keep only the most powerful one. E.g., O(2^n + n^2 - 500n) = O(2^n).

## Turing Machines

A mathematical model of computation describing an abstract machine that manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, it is capable of implementing any computer algorithm.

**Turing completeness**: the ability for a computational model to simulate a Turing machine. Nearly all programming languages are Turing complete if the limitations of finite memory are ignored.

**Halting problem**: the problem of determining whether an arbitrary program will finish running or continue forever. It is undecidable — no general algorithm exists that solves it for all possible program-input pairs.

## Networking

**Internet Protocol (IP)**: the network layer communications protocol. IP delivers packets from source to destination based solely on IP addresses in packet headers.

**HTTP**: an application layer protocol, the foundation of data communication for the World Wide Web.

## Key Concepts

**Thread-safe**: will behave correctly when accessed concurrently by multiple threads.

**Race condition**: when a system's behavior depends on the sequence or timing of uncontrollable events. Prevented using mutual exclusion.

**Regex**: specifies a set of strings using patterns. Key operators: `|` (or), `?` (zero or one), `*` (zero or more), `+` (one or more), `.` (wildcard).

**Principle of least privilege**: every module must be able to access only the information and resources necessary for its legitimate purpose.

**Technical debt**: the implied cost of future reworking required when choosing an easy but limited solution.

**Worse is better** (Richard P. Gabriel): software quality does not necessarily increase with functionality. Software that is limited but simple to use may be more appealing than the reverse.

**Defensive programming**: developing programs capable of detecting potential security abnormalities and making predetermined responses.

**Short-circuit evaluation**: the second argument is evaluated only if the first doesn't suffice to determine the value (AND short-circuits on false, OR on true).

**Quine**: a program that takes no input and produces a copy of its own source code as its only output.

**Compile time** vs **runtime**: compile time converts statements into binary instructions; runtime is when code executes on the CPU.

## Connections

- [[Python]] — practical programming language reference
- [[Information Theory]] — theoretical foundations, Kolmogorov complexity
- [[Philosophy of Science]] — methodology of systematic inquiry
