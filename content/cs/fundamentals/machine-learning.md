---
title: Machine Learning
category: CS
tags:
  - artificial-intelligence
  - neural-networks
  - gradient-descent
  - optimization
  - data-mining
date: '2024-08-12'
excerpt: A field of AI concerned with statistical algorithms that learn from data and generalize to unseen data.
stub: false
verified: false
notionId: fdeb0169-8c11-4910-8347-4d64fc6b0224
---

# Machine Learning

A field of study in [[artificial intelligence]] concerned with the development and study of statistical algorithms that can learn from data and generalize to unseen data and thus perform tasks without explicit instructions. Recently, artificial [[neural networks]] have been able to surpass many previous approaches in performance.

ML finds application in many fields, including [[natural language processing]], [[computer vision]], speech recognition, email filtering, agriculture, and medicine. When applied to business problems, it is known under the name **predictive analytics**. Although not all machine learning is statistically based, computational statistics is an important source of the field's methods.

The mathematical foundations of ML are provided by [[mathematical optimization]] (mathematical programming) methods. [[Data mining]] is a related (parallel) field of study, focusing on exploratory data analysis (EDA) through unsupervised learning.

From a theoretical viewpoint, probably approximately correct (PAC) learning provides a framework for describing machine learning.

---

## Gradient Descent

A method for unconstrained mathematical optimization. It is a first-order iterative algorithm for finding a local minimum of a differentiable multivariate function.

The idea is to take repeated steps in the opposite direction of the gradient (or approximate gradient) of the function at the current point, because this is the direction of steepest descent. Conversely, stepping in the direction of the gradient will lead to a local maximum of that function; the procedure is then known as **gradient ascent**. It is particularly useful in machine learning for minimizing the cost or loss function. Gradient descent should not be confused with local search algorithms, although both are iterative methods for optimization.

A simple extension of gradient descent, **stochastic gradient descent**, serves as the most basic algorithm used for training most [[deep learning|deep networks]] today.
