---
title: Python
category: CS
tags:
  - python
  - programming
  - data-structures
  - algorithms
  - computer-science
date: '2025-09-23'
excerpt: 'A high-level, general-purpose programming language emphasizing readability. Comprehensive reference covering data structures, algorithms, and common patterns.'
stub: false
verified: false
notionId: fd6821c7-1a74-4c75-942b-17184eacfc77
---

## Overview

A high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured, object-oriented and functional programming. Often described as a "batteries included" language due to its comprehensive standard library. Has gained widespread use in the machine learning community.

Python uses whitespace **indentation** rather than curly brackets or keywords to delimit blocks. The recommended indent size is four spaces.

**Mutability**: the ability of an object to be modified after creation. Mutable objects can have their content altered without creating a new object.

## Time and Space Complexity

| Notation | Name |
|----------|------|
| O(1) | Constant |
| O(log n) | Logarithmic |
| O(n) | Linear |
| O(n log n) | Linearithmic |
| O(n^2) | Quadratic |
| O(2^n) | Exponential |

### Common Operation Costs

- **List**: append O(1), insert(0) O(n), pop() O(1), pop(0) O(n), `in` O(n)
- **Dictionary**: get/set/in all O(1)
- **Set**: add/remove/in all O(1)

## Core Data Structures

**List (array)**: Mutable, ordered collection. Defined with `[]`. O(n) lookups. Ordered arrays allow binary search.

**Tuple**: Immutable, ordered collection. Defined with `()`.

**Dictionary (hashmap)**: Mutable key-value pairs, unique keys. Defined with `{}`. O(1) for insertion, deletion, lookup via hashing.

**Set**: Unordered collection of unique elements. Defined with `{}` or `set()`.

## Algorithms Reference

*(Full code examples for each pattern are preserved in the Notion source page. Key patterns include:)*

- **Two Sum** — hash map lookup
- **Binary Search** — standard, first/last occurrence, rotated array
- **Linked Lists** — reversal, merge sorted
- **Trees** — DFS traversals (inorder, preorder, postorder), BFS level order, max depth, BST validation
- **Graphs** — adjacency list/matrix, DFS, BFS, Union-Find
- **Dynamic Programming** — fibonacci, unique paths, knapsack, LCS
- **Sorting** — quick sort, merge sort, heap sort
- **Bit Manipulation** — AND, OR, XOR, count bits, power of 2
- **Backtracking** — template pattern, generate parentheses

## Key Patterns

- **Frequency Counter**: `Counter(s1) == Counter(s2)` for anagram check
- **Multiple Pointers**: sorted array problems (three sum, etc.)
- **Sliding Window**: subarray/substring problems
- **Divide and Conquer**: max subarray via recursive halving

## Connections

- [[Computer Science]] — programming fundamentals and paradigms
- [[Artificial Intelligence]] — Python is the primary language for ML/AI
