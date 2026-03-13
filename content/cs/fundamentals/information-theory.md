---
title: Information Theory
category: CS
tags:
  - information-theory
  - computer-science
  - complexity
  - coding
  - entropy
date: '2024-08-12'
excerpt: 'The study of codes, data processing inequality, Kolmogorov complexity, and the limits of computational understanding.'
stub: false
verified: false
notionId: 894818bd-4a8f-46a4-8f2e-579fb653a136
---

## Codes

A **code** is a system of rules to convert information — such as a letter, word, sound, image, or gesture — into another form for communication or storage. An early example is the invention of language; writing extended communication across space and time.

**Encoding** converts information from a source into symbols. **Decoding** is the reverse process.

### Prefix Codes (Huffman Codes)

A type of code system with the "prefix property": no whole code word is a prefix of any other code word. For example, {9, 55} has the prefix property; {9, 5, 59, 55} does not, because "5" is a prefix of "59" and "55."

A prefix code is uniquely decodable: a receiver can identify each word without requiring a special marker between words. Although Huffman coding is just one of many algorithms for deriving prefix codes, prefix codes are widely referred to as "Huffman codes."

## Data Processing Inequality

The information content of a signal cannot be increased via a local physical operation. Concisely: "post-processing cannot increase information."

## Kolmogorov Complexity

The Kolmogorov complexity of an object is the length of the shortest computer program that produces the object as output. It is a measure of the computational resources needed to specify the object.

The notion can be used to state and prove impossibility results akin to Cantor's diagonal argument, Godel's incompleteness theorem, and Turing's halting problem. No single program can compute the exact Kolmogorov complexity for infinitely many texts.

## Yann LeCun on AGI and Complexity

LeCun argues the phrase "AGI" should be retired in favor of "human-level AI," because even human intelligence is very specialized. We do not realize this because all the intelligent tasks we can think of are tasks we can apprehend — but that is a tiny subset of all tasks.

By Kraft's inequality, only an exponentially small number of symbol sequences of a given length have a description significantly shorter than themselves. If intelligence is related to efficient representation of data with predictive power, then *any* intelligent entity can only "understand" a tiny sliver of its universe. What is not understandable appears random — called noise by engineers, entropy by physicists, and heat by most people.

As Einstein famously said: "the most incomprehensible thing about the world is that it is comprehensible."

## Connections

- [[Computer Science]] — Turing machines, halting problem
- [[Artificial Intelligence]] — foundations of learning and representation
