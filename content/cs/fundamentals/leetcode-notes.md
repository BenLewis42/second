---
title: LeetCode Notes
category: Computer Science
tags:
  - algorithms
  - data-structures
  - python
  - sql
  - system-design
  - data-engineering
date: '2025-03-22'
excerpt: 'Notes on graph traversal, data structures, SQL, system design patterns, and data engineering concepts drawn from LeetCode-style problems.'
stub: false
verified: false
notionId: 1bea584d-bff3-8005-b0b2-c00534f75b0a
---

# LeetCode Notes

## Graph Traversal Algorithms

### Breadth-First Search (BFS)

Explores a graph level by level, visiting all neighbors of a node before moving to the next level of nodes.

**Key characteristics:**

- Uses a queue data structure
- Visits all nodes at current depth before going deeper
- Finds shortest path in unweighted graphs
- Good for finding closest elements or level-by-level processing

**Common BFS implementation in Python:**

```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result
```

---

### Depth-First Search (DFS)

DFS explores as far as possible along a branch before backtracking.

**Key characteristics:**

- Uses a stack data structure (or recursion)
- Good for pathfinding, topological sorting, cycle detection
- Uses less memory than BFS in wide graphs

Recursive implementation:

```python
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()

    visited.add(node)
    result = [node]

    for neighbor in graph[node]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))

    return result
```

Iterative:

```python
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)

            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result
```

### When to use which algorithm?

- Use **BFS** when:
  - Finding shortest path (unweighted graph)
  - Level-order traversal is needed
  - Nodes closer to the source need to be processed first
- Use **DFS** when:
  - Exploring all possible paths
  - Detecting cycles
  - Topological sorting
  - Solving mazes or puzzles

---

### Example: Simple Undirected Graph

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

bfs_result = bfs(graph, 'A')
# Output: ['A', 'B', 'C', 'D', 'E', 'F']

dfs_iter_result = dfs_iterative(graph, 'A')
# Output: ['A', 'B', 'D', 'E', 'F', 'C']

dfs_rec_result = dfs_recursive(graph, 'A')
# Output: ['A', 'B', 'D', 'E', 'F', 'C']
```

```
    A
   / \
  B   C
 / \   \
D   E---F
```

---

### Example: Directed Graph

```python
directed_graph = {
    1: [2, 3],
    2: [4, 5],
    3: [5],
    4: [6],
    5: [6],
    6: []
}

bfs_result = bfs(directed_graph, 1)
# Output: [1, 2, 3, 4, 5, 6]

dfs_iter_result = dfs_iterative(directed_graph, 1)
# Output: [1, 3, 5, 6, 2, 4]

dfs_rec_result = dfs_recursive(directed_graph, 1)
# Output: [1, 2, 4, 6, 5, 3]
```

```
  1
 / \
v   v
2   3
|\ /
v v
4 5
 \|
  v
  6
```

---

### Example: Disconnected Graph

```python
disconnected_graph = {
    'A': ['B'],
    'B': ['A'],
    'C': ['D'],
    'D': ['C', 'E'],
    'E': ['D'],
    'F': []
}

bfs_result = bfs(disconnected_graph, 'A')
# Output: ['A', 'B']

dfs_result = dfs_iterative(disconnected_graph, 'C')
# Output: ['C', 'D', 'E']

def traverse_all_nodes(graph, traverse_fn):
    all_nodes = set(graph.keys())
    visited = set()
    result = []

    for node in all_nodes:
        if node not in visited:
            traversal = traverse_fn(graph, node)
            visited.update(traversal)
            result.extend(traversal)

    return result

all_nodes_bfs = traverse_all_nodes(disconnected_graph, bfs)
# Output: ['A', 'B', 'C', 'D', 'E', 'F']
```

---

### Example: Number of Islands (LeetCode #200)

```python
def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'

        while queue:
            row, col = queue.popleft()
            directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1'):
                    queue.append((nr, nc))
                    grid[nr][nc] = '0'

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                bfs(r, c)

    return count

grid1 = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
print("Number of islands in grid1:", numIslands(grid1))
# Output: 1

grid2 = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
print("Number of islands in grid2:", numIslands(grid2))
# Output: 3
```

---

## SQL and Database Problems

```sql
SELECT
    d.name AS department,
    e.name AS employee,
    e.salary
FROM
    Employee e
JOIN
    Department d ON e.departmentId = d.id
WHERE
    (e.departmentId, e.salary) IN (
        SELECT
            departmentId,
            MAX(salary)
        FROM
            Employee
        GROUP BY
            departmentId
    )
```

**Key SQL Skills:**

- **Complex JOINs**: Understanding when to use INNER, LEFT, RIGHT, FULL OUTER joins
- **Aggregation**: GROUP BY with HAVING clauses for filtering grouped results
- **Window Functions**: ROW_NUMBER(), RANK(), DENSE_RANK() for sophisticated analysis
- **CTEs and Subqueries**: For breaking down complex problems into manageable parts
- **Query Optimization**: Understanding execution plans and adding proper indexes

---

## Data Processing Algorithms

### Map-Reduce Pattern

Map-Reduce is a programming model for processing large datasets in parallel across distributed systems.

```python
def word_count_map_reduce(documents):
    # Map phase
    mapped = []
    for doc_id, text in documents:
        for word in text.split():
            word = word.lower().strip('.,!?')
            if word:
                mapped.append((word, 1))

    # Shuffle/Group phase
    grouped = {}
    for word, count in mapped:
        if word not in grouped:
            grouped[word] = []
        grouped[word].append(count)

    # Reduce phase
    results = []
    for word, counts in grouped.items():
        total = sum(counts)
        results.append((word, total))

    return results

documents = [
    (1, "hello world hello"),
    (2, "world of data engineering"),
    (3, "hello data world")
]
word_counts = word_count_map_reduce(documents)
# Result: [('hello', 3), ('world', 3), ('of', 1), ('data', 2), ('engineering', 1)]
```

### Stream Processing

Handles continuous data streams in real-time, often with limited memory.

```python
from collections import deque

class MovingAverage:
    def __init__(self, size):
        self.size = size
        self.queue = deque()
        self.sum = 0

    def next(self, val):
        self.queue.append(val)
        self.sum += val

        if len(self.queue) > self.size:
            self.sum -= self.queue.popleft()

        return self.sum / len(self.queue)

movingAvg = MovingAverage(3)
print(movingAvg.next(1))    # 1.0
print(movingAvg.next(10))   # 5.5
print(movingAvg.next(3))    # 4.67
print(movingAvg.next(5))    # 6.0
```

---

## Data Structures for Data Engineering

### Trie (Prefix Tree)

Essential for efficient string operations, especially in search systems and autocompletion features.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

trie = Trie()
trie.insert("data")
trie.insert("database")
trie.insert("dataframe")
trie.insert("dataflow")
print(trie.search("data"))        # True
print(trie.search("datum"))       # False
print(trie.starts_with("dataf"))  # True
```

### Heap/Priority Queue

Heaps are crucial for priority-based operations and top-k problems common in data analytics.

```python
import heapq

def top_k_frequent(nums, k):
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1

    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)

    return [item[1] for item in sorted(heap, reverse=True)]

nums = [1, 1, 1, 2, 2, 3]
k = 2
print(top_k_frequent(nums, k))  # [1, 2]
```

---

## Graph Algorithms for Data Pipeline Design

### Topological Sort

Topological sorting is critical for scheduling dependent tasks in data pipelines.

```python
def topological_sort(graph):
    visited = set()
    temp_mark = set()
    ordered = []

    def visit(node):
        if node in temp_mark:
            raise ValueError("Not a DAG - cycle detected")

        if node not in visited:
            temp_mark.add(node)
            for neighbor in graph.get(node, []):
                visit(neighbor)
            temp_mark.remove(node)
            visited.add(node)
            ordered.append(node)

    for node in graph:
        if node not in visited:
            visit(node)

    return list(reversed(ordered))

pipeline_graph = {
    'extract_data': ['clean_data'],
    'clean_data': ['transform_data'],
    'transform_data': ['load_to_warehouse'],
    'load_to_warehouse': ['generate_reports'],
    'generate_reports': []
}

ordered_tasks = topological_sort(pipeline_graph)
# Output: ['extract_data', 'clean_data', 'transform_data', 'load_to_warehouse', 'generate_reports']
```

---

## String Processing and Pattern Matching

### Regular Expression Implementation

```python
def is_match(text, pattern):
    dp = [[False] * (len(pattern) + 1) for _ in range(len(text) + 1)]
    dp[0][0] = True

    for j in range(1, len(pattern) + 1):
        if pattern[j-1] == '*':
            dp[0][j] = dp[0][j-2]

    for i in range(1, len(text) + 1):
        for j in range(1, len(pattern) + 1):
            if pattern[j-1] == '*':
                dp[i][j] = dp[i][j-2]
                if pattern[j-2] == '.' or pattern[j-2] == text[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif pattern[j-1] == '.' or pattern[j-1] == text[i-1]:
                dp[i][j] = dp[i-1][j-1]

    return dp[len(text)][len(pattern)]

print(is_match("aa", "a*"))      # True
print(is_match("ab", ".*"))      # True
print(is_match("aab", "c*a*b"))  # True
```

---

## System Design for Data Engineers

### Data Partitioning Strategy

```python
def hash_partition(data, partition_count):
    partitions = [[] for _ in range(partition_count)]
    for item in data:
        key = item['id']
        partition_index = hash(key) % partition_count
        partitions[partition_index].append(item)
    return partitions

def range_partition(data, key_field, ranges):
    partitions = [[] for _ in range(len(ranges))]
    for item in data:
        value = item[key_field]
        for i, (lower, upper) in enumerate(ranges):
            if lower <= value < upper:
                partitions[i].append(item)
                break
    return partitions
```

### ETL Pipeline Design

```python
def etl_pipeline(source_data, destination):
    def extract():
        return source_data

    def transform(raw_data):
        transformed_data = []
        for record in raw_data:
            clean_record = {k: v.strip() if isinstance(v, str) else v
                           for k, v in record.items()}
            if not all(k in clean_record for k in ['id', 'name', 'value']):
                continue
            if 'value' in clean_record:
                clean_record['normalized_value'] = clean_record['value'] / 100
            clean_record['processed_date'] = '2025-03-22'
            transformed_data.append(clean_record)
        return transformed_data

    def load(transformed_data):
        destination.extend(transformed_data)

    try:
        raw_data = extract()
        transformed_data = transform(raw_data)
        load(transformed_data)
        return True
    except Exception as e:
        print(f"ETL pipeline failed: {str(e)}")
        return False
```

### Batch vs. Stream Processing

```python
class BatchProcessor:
    def __init__(self, batch_size=10):
        self.batch_size = batch_size
        self.data_buffer = []
        self.processed_data = []

    def add_data(self, data_point):
        self.data_buffer.append(data_point)
        if len(self.data_buffer) >= self.batch_size:
            self.process_batch()

    def process_batch(self):
        if not self.data_buffer:
            return
        result = {
            "batch_sum": sum(self.data_buffer),
            "batch_avg": sum(self.data_buffer) / len(self.data_buffer),
            "batch_min": min(self.data_buffer),
            "batch_max": max(self.data_buffer),
            "batch_size": len(self.data_buffer)
        }
        self.processed_data.append(result)
        self.data_buffer = []

    def force_process(self):
        if self.data_buffer:
            self.process_batch()


class StreamProcessor:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.data_window = deque(maxlen=window_size)
        self.running_stats = {"count": 0, "sum": 0, "min": float('inf'), "max": float('-inf')}
        self.alerts = []

    def process_data_point(self, data_point):
        self.running_stats["count"] += 1
        self.running_stats["sum"] += data_point
        self.running_stats["min"] = min(self.running_stats["min"], data_point)
        self.running_stats["max"] = max(self.running_stats["max"], data_point)

        self.data_window.append(data_point)

        if data_point > 100:
            self.alerts.append(f"Alert: High value detected: {data_point}")

        if len(self.data_window) == self.window_size:
            window_avg = sum(self.data_window) / self.window_size
            if all(self.data_window[i] < self.data_window[i+1]
                   for i in range(len(self.data_window)-1)):
                pass  # trend alert: consistently increasing values

        return self.running_stats
```
