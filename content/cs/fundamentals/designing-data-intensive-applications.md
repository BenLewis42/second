---
title: Notes from Designing Data-Intensive Applications
category: Computer Science
tags:
  - databases
  - distributed-systems
  - data-engineering
  - system-design
  - software-architecture
date: '2026-02-16'
excerpt: 'Collected highlights and excerpts from Martin Kleppmann''s Designing Data-Intensive Applications, covering data models, storage engines, replication, partitioning, transactions, batch and stream processing, and ethics.'
stub: false
verified: false
notionId: 309a584d-bff3-80d2-b48b-c729e22385e3
---

# Notes from *Designing Data-Intensive Applications*

**Kleppmann, Martin** — O'Reilly Media Inc., 2017

---

## Foundations

We call an application *data-intensive* if data is its primary challenge — as opposed to compute-intensive.

The majority of the cost of software is not in its initial development, but in its ongoing maintenance — fixing bugs, keeping its systems operational, investigating failures, adapting it to new platforms, modifying it for new use cases, repaying technical debt, and adding new features.

Data models are perhaps the most important part of developing software, because they have such a profound effect: not only on how the software is written, but also on how we think about the problem that we are solving.

Each layer hides the complexity of the layers below it by providing a clean data model. These abstractions allow different groups of people — for example, the engineers at the database vendor and the application developers using their database — to work together effectively.

A good abstraction can hide a great deal of implementation detail behind a clean, simple-to-understand facade.

A software project mired in complexity is sometimes described as a *big ball of mud*.

Accidental complexity: Moseley and Marks define complexity as *accidental* if it is not inherent in the problem that the software solves (as seen by the users) but arises only from the implementation.

> A complex system that works is invariably found to have evolved from a simple system that works. The inverse proposition also appears to be true: A complex system designed from scratch never works and cannot be made to work.

> If the highest aim of a captain was to preserve his ship, he would keep it in port forever. — St. Thomas Aquinas

> The limits of my language mean the limits of my world. — Ludwig Wittgenstein

> For a successful technology, reality must take precedence over public relations, for nature cannot be fooled. — Richard Feynman

> We must state definitions and provide for priorities and descriptions of data. We must state relationships, not procedures. — Grace Murray Hopper, *Management and the Computer of the Future* (1962)

---

## Reliability, Scalability, Maintainability

### Reliability

A *fault* is not the same as a *failure*. Fault-tolerant or resilient systems prevent faults from causing failures. It is impossible to reduce the probability of a fault to zero; therefore it is usually best to design fault-tolerance mechanisms that prevent faults from causing failures.

Many critical bugs are actually due to poor error handling. By deliberately inducing faults, you ensure that the fault-tolerance machinery is continually exercised and tested. (The Netflix Chaos Monkey.)

Carefully thinking about assumptions and interactions in the system; thorough testing; process isolation.

Hardware faults (servers or network) played a role in only 10–25% of outages.

Thus, on a storage cluster with 10,000 disks, we should expect on average one disk to die per day.

Hard disks are reported as having a mean time to failure (MTTF) of about 10 to 50 years.

A runaway process that uses up some shared resource — CPU time, memory, disk space, or network bandwidth.

In those circumstances, it is revealed that the software is making some kind of assumption about its environment — and while that assumption is usually true, it eventually stops being true for some reason.

### Scalability

Rather, discussing scalability means considering questions like "If the system grows in a particular way, what are our options for coping with the growth?"

When you increase a load parameter and keep the system resources (CPU, memory, network bandwidth, etc.) unchanged, how is the performance of your system affected? When you increase a load parameter, how much do you need to increase the resources if you want to keep performance unchanged?

The best choice of parameters depends on the architecture of your system: it may be requests per second to a web server, the ratio of reads to writes in a database, the number of simultaneously active users in a chat room, the hit rate on a cache, or something else.

An architecture that is appropriate for one level of load is unlikely to cope with 10 times that load.

In an early-stage startup or an unproven product it's usually more important to be able to iterate quickly on product features than it is to scale to some hypothetical future load.

Vertical scaling (moving to a more powerful machine) and scaling out (horizontal scaling, distributing the load across multiple smaller machines).

Elastic: meaning that they can automatically add computing resources when they detect a load increase.

You're not Google or Amazon. Stop worrying about scale and just use a relational database.

#### Response Time & Percentiles

We need to think of response time not as a single number, but as a distribution of values that you can measure.

Response time is what the client sees: besides the actual time to process the request (the service time), it includes network delays and queueing delays.

Latency is the duration that a request is waiting to be handled — during which it is latent, awaiting service.

The median is also known as the 50th percentile (p50). The 95th, 99th, and 99.9th percentiles are common (abbreviated p95, p99, and p999).

Note that the median refers to a single request; if the user makes several requests, the probability that at least one of them is slower than the median is much greater than 50%.

This is because the customers with the slowest requests are often those who have the most data on their accounts because they have made many purchases — that is, they're the most valuable customers.

Queueing delays often account for a large part of the response time at high percentiles.

Due to this effect, it is important to measure response times on the client side.

Even if you make the calls in parallel, the end-user request still needs to wait for the slowest of the parallel calls to complete. (Tail latency amplification.)

An SLA may state that the service is considered to be up if it has a median response time of less than 200ms and a 99th percentile under 1s.

High percentiles become especially important in backend services that are called multiple times as part of serving a single end-user request.

Perhaps the average case is what matters for you, or perhaps your bottleneck is dominated by a small number of extreme cases. Premature optimization.

### Maintainability

Operability, Simplicity, Evolvability (extensibility, modifiability, or plasticity).

Good operations can often work around the limitations of bad (or incomplete) software, but good software cannot run reliably with bad operations.

Good documentation and an easy-to-understand operational model ("If I do X, Y will happen").

Good default behavior, but also giving administrators the freedom to override defaults when needed.

Self-healing where appropriate, but also giving administrators manual control over the system state when needed.

Visibility into the runtime behavior — as performance metrics and error rates (telemetry).

Preserving the organization's knowledge about the system, even as individual people come and go.

Anticipating future problems and solving them before they occur (e.g., capacity planning).

Particular, provide fully featured non-production sandbox environments where people can explore and experiment safely, using real data, without affecting real users.

Good support for automation and integration with standard tools.

Minimizing surprises. Implement good management practices and training.

> A system cannot be successful if it is too strongly influenced by a single person. Once the initial design is complete and fairly robust, the real test begins as people with many different viewpoints undertake their own experiments.

Allow quick and easy recovery from human errors. Decouple the places where people make the most mistakes from the places where they can cause failures.

From unit tests to whole-system integration tests and manual tests.

Make it fast to roll back configuration changes, roll out new code gradually (so that any unexpected bugs affect only a small subset of users).

---

## Data Models and Query Languages

Data is organized into relations (called tables in SQL), where each relation is an unordered collection of tuples (rows in SQL).

The relational model. The hierarchical model. The network model.

*Impedance mismatch* — the disconnect between object-oriented application code and the relational model.

Some developers feel that the JSON model reduces the impedance mismatch between the application code and the storage layer.

If the data in your application has a document-like structure (i.e., a tree of one-to-many relationships, where typically the entire tree is loaded at once), then it's probably a good idea to use a document model.

The document model has limitations: for example, you cannot refer directly to a nested item within a document.

Poor support for joins in document databases.

The locality advantage only applies if you need large parts of the document at the same time. The database typically needs to load the entire document, even if you access only a small portion of it, which can be wasteful on large documents.

The advantage of using an ID is that because it has no meaning to humans, it never needs to change. Everything that refers to it uses an ID (which only has meaning within the database). When you store the text directly, you are duplicating the human-meaningful information in every record that uses it. Whether you store an ID or a text string is a question of duplication.

Removing such duplication is the key idea behind normalization in databases.

The relational technique of shredding — splitting a document-like structure into multiple tables — can lead to cumbersome schemas and unnecessarily complicated application code.

Even CODASYL committee members admitted that this was like navigating around an n-dimensional data space.

### Declarative vs. Imperative

An imperative language tells the computer to perform certain operations in a certain order.

In a declarative query language, like SQL or relational algebra, you just specify the pattern of the data you want — what conditions the results must meet, and how you want the data to be transformed (e.g., sorted, grouped, and aggregated) — but not how to achieve that goal.

SQL is an abstraction. The fact that SQL is more limited in functionality gives the database much more room for automatic optimizations.

Declarative languages have a better chance of getting faster in parallel execution because they specify only the pattern of the results, not the algorithm that is used to determine the results.

### Schema-on-Read vs. Schema-on-Write

More accurate term is *schema-on-read* (as opposed to *schema-on-write*, the traditional approach of relational databases, where the schema is explicit and the database ensures all written data conforms to it).

Most document databases, and the JSON support in relational databases, do not enforce any schema on the data in documents.

The schema-on-read approach is advantageous if the items in the collection don't all have the same structure for some reason (i.e., the data is heterogeneous).

By contrast, schema-on-read ("schemaless") databases don't enforce a schema, so the database can contain a mixture of older and newer data formats written at different times.

It therefore seems likely that in the foreseeable future, relational databases will continue to be used alongside a broad variety of nonrelational datastores — an idea that is sometimes called *polyglot persistence*.

---

## Storage and Retrieval

How we can store the data that we're given, and how we can find it again when we're asked for it.

Similarly to what `db_set` does, many databases internally use a log, which is an append-only data file.

In order to efficiently find the value for a particular key in the database, we need a different data structure: an *index*. The general idea behind them is to keep some additional metadata on the side, which acts as a signpost and helps you to locate the data you want.

Any kind of index usually slows down writes, because the index also needs to be updated every time data is written.

Usually implemented as a hash map (hash table). Key-value stores are quite similar to the dictionary type that you can find in most programming languages.

If you want to delete a key and its associated value, you have to append a special deletion record to the data file (sometimes called a *tombstone*).

### LSM-Trees and SSTables

LSM-trees: all writes first go to an in-memory store, where they are added to a sorted structure and prepared for writing to disk. When enough writes have accumulated, they are merged with the column files on disk and written to new files in bulk.

The log-structured school, which only permits appending to files and deleting obsolete files. But an append-only design turns out to be good for several reasons.

### B-Trees

The most widely used indexing structure is quite different: the B-tree.

B-trees break the database down into fixed-size blocks or pages, traditionally 4KB in size (sometimes bigger), and read or write one page at a time. Each page can be identified using an address or location — similar to a pointer, but on disk instead of in memory.

The number of references to child pages in one page of the B-tree is called the branching factor.

Eventually we get down to a page containing individual keys (a leaf page).

This algorithm ensures that the tree remains balanced: a B-tree with *n* keys always has a depth of O(log n). Most databases can fit into a B-tree that is three or four levels deep. (A four-level tree of 4KB pages with a branching factor of 500 can store up to 256TB.)

A write-ahead log (WAL, also known as a redo log).

### OLTP vs. OLAP

In most OLTP databases, storage is laid out in a row-oriented fashion.

The basic access pattern: an application typically looks up a small number of records by some key, using an index. Records are inserted or updated based on the user's input — online transaction processing (OLTP).

OLTP systems are typically user-facing, which means that they may see a huge volume of requests.

There was a trend for companies to stop using their OLTP systems for analytics purposes, and to run the analytics on a separate database instead. This separate database was called a *data warehouse*.

Data warehouses now exist in almost all large enterprises, but in small companies they are almost unheard of.

Data is extracted from OLTP databases (using either a periodic data dump or a continuous stream of updates), transformed into an analysis-friendly schema, cleaned up, and then loaded into the data warehouse. This process is known as Extract–Transform–Load (ETL).

They are usually reluctant to let business analysts run ad hoc analytic queries on an OLTP database, since those queries are often expensive. A data warehouse, by contrast, is a separate database that analysts can query to their hearts' content, without affecting OLTP operations.

The data model of a data warehouse is most commonly relational, because SQL is generally a good fit for analytic queries.

### Column-Oriented Storage

Although fact tables are often over 100 columns wide, a typical data warehouse query only accesses 4 or 5 of them at one time.

Column-oriented storage is simple: don't store all the values from one row together, but store all the values from each column together instead.

The column-oriented storage layout relies on each column file containing the rows in the same order.

Column-oriented storage often lends itself very well to compression. Vectorized processing.

A row-oriented storage engine still needs to load all of those rows from disk into memory, parse them, and filter out those that don't meet the required conditions. That can take a long time.

Disk seek time is often the bottleneck here (OLTP). Disk bandwidth (not seek time) is often the bottleneck here (OLAP).

### Star and Snowflake Schemas

As each row in the fact table represents an event, the dimensions represent the who, what, where, when, how, and why of the event.

Other columns in the fact table are foreign key references to other tables, called *dimension tables*.

The name "star schema" comes from the fact that when the table relationships are visualized, the fact table is in the middle, surrounded by its dimension tables.

A variation is the *snowflake schema*, where dimensions are further broken down into subdimensions.

### Materialized Views

A *materialized view* is an actual copy of the query results, written to disk, whereas a virtual view is just a shortcut for writing queries.

A common special case is known as a *data cube* or OLAP cube — a grid of aggregates grouped by different dimensions.

The advantage of a materialized data cube is that certain queries become very fast because they have effectively been precomputed.

---

## Encoding and Evolution

The translation from the in-memory representation to a byte sequence is called *encoding* (also known as serialization or marshalling). The reverse is called *decoding* (parsing, deserialization, unmarshalling).

In memory, data is kept in objects, structs, lists, arrays, hash tables, trees, and so on. When you want to write data to a file or send it over the network, you have to encode it as some kind of self-contained sequence of bytes.

The encoding is often tied to a particular programming language, and reading the data in another language is very difficult. Java has `java.io.Serializable`. Python has `pickle`. For these reasons it's generally a bad idea to use your language's built-in encoding for anything other than very transient purposes.

If an attacker can get your application to decode an arbitrary byte sequence, they can instantiate arbitrary classes, which in turn often allows them to do terrible things such as remotely executing arbitrary code.

XML is often criticized for being too verbose. JSON's popularity is mainly due to its built-in support in web browsers. There is a lot of ambiguity around the encoding of numbers.

The JSON returned by Twitter's API includes tweet IDs twice, once as a JSON number and once as a decimal string, to work around the fact that the numbers are not correctly parsed by JavaScript applications.

You can add new fields to the schema, provided that you give each field a new tag number. If old code tries to read data written by new code, it can simply ignore that field.

Backward compatibility: newer code can read data that was written by older code. Forward compatibility: older code can read data that was written by newer code. Forward compatibility can be trickier, because it requires older code to ignore additions made by a newer version of the code.

Thus, it is important that all data flowing around the system is encoded in a way that provides backward and forward compatibility.

*Data outlives code.*

A value in the database may be written by a newer version of the code, and subsequently read by an older version of the code. Thus, forward compatibility is also often required for databases.

---

## Services: REST and RPC

REST is not a protocol, but rather a design philosophy that builds upon the principles of HTTP. Simple data formats, using URLs for identifying resources and using HTTP features for cache control, authentication, and content type negotiation. (RESTful.) A definition format such as OpenAPI (Swagger).

Part of the appeal of REST is that it doesn't try to hide the fact that it's a network protocol.

Remote procedure call (RPC) has been around since the 1970s. The RPC model tries to make a request to a remote network service look the same as calling a function — this is called *location transparency*.

When you call a local function, you can efficiently pass it references to objects in local memory. When you make a network request, all those parameters need to be encoded into a sequence of bytes.

Network problems are common, so you have to anticipate them, for example by retrying a failed request. There are two popular approaches to web services: REST and SOAP. They are almost diametrically opposed in terms of philosophy.

Clients and servers. The API exposed by the server is known as a *service*. Moreover, a server can itself be a client to another service. This approach is often used to decompose a large application into smaller services by area of functionality. Often associated with *microservices architecture*.

Services (online systems): a service waits for a request, handles it as quickly as possible, and sends a response back. Response time is usually the primary measure of performance, and availability is often very important.

With server-side applications you may want to perform a *rolling upgrade* (also known as a staged rollout).

We can make a simplifying assumption in the case of dataflow through services: it is reasonable to assume that all the servers will be updated first, and all the clients second.

---

## Replication

Three popular algorithms for replicating changes between nodes: single-leader, multi-leader, and leaderless replication.

Leader-based replication (also known as active/passive or master–slave replication). When clients want to write to the database, they must send their requests to the leader, which first writes the new data to its local storage.

Each node that stores a copy of the database is called a *replica*.

Copy the snapshot to the new follower node. The follower connects to the leader and requests all the data changes that have happened since the snapshot was taken.

The advantage of synchronous replication is that the follower is guaranteed to have an up-to-date copy. The disadvantage is that if the synchronous follower doesn't respond, the write cannot be processed. In practice, if you enable synchronous replication on a database, it usually means that one of the followers is synchronous, and the others are asynchronous.

Unfortunately, if an application reads from an asynchronous follower, it may see outdated information. This is known as *eventual consistency*.

*Read-after-write consistency* (also known as read-your-writes consistency). *Monotonic reads*: after users have seen the data at one point in time, they shouldn't later see the data from some earlier point in time. *Consistent prefix reads*: if a sequence of writes happens in a certain order, then anyone reading those writes will see them appear in the same order.

If one operation happened before another, the later operation should overwrite the earlier operation, but if the operations are concurrent, we have a conflict that needs to be resolved.

In fact, we can simply say that two operations are *concurrent* if neither happens before the other (i.e., neither knows about the other).

Anti-entropy process: a background process that constantly looks for differences in the data between replicas.

Normally, replication is quite fast: most database systems apply changes to followers in less than a second. However, there is no guarantee of how long it might take.

Leader failure: Failover.

There is a strong connection between consistency of replication and consensus (getting several nodes to agree on a value).

---

## Partitioning

The main reason for wanting to partition data is scalability.

Normally, partitions are defined in such a way that each piece of data (each record, row, or document) belongs to exactly one partition.

Our goal with partitioning is to spread the data and the query load evenly across nodes.

If the partitioning is unfair, so that some partitions have more data or queries than others, we call it *skewed*. A partition with disproportionately high load is called a *hot spot*.

Key range partitioning, where keys are sorted, and a partition owns all the keys from some minimum up to some maximum. Hash partitioning, where a hash function is applied to each key, and a partition owns a range of hashes. This method destroys the ordering of keys, making range queries inefficient, but may distribute load more evenly.

Partitioning by Hash of Key: a good hash function takes skewed data and makes it uniformly distributed. Unfortunately, by using the hash of the key for partitioning we lose the ability to do efficient range queries.

A secondary index can easily be constructed from a key-value index. The main difference is that keys are not unique.

A particular problem in partitioned (sharded) databases.

---

## Transactions

ACID — Atomicity, Consistency, Isolation, and Durability.

*Atomicity*: if a client wants to make several writes, but a fault occurs after some of the writes have been processed, then the transaction is aborted and the database must discard or undo any writes it has made so far.

*Consistency*: the idea of ACID consistency is that you have certain statements about your data (invariants) that must always be true.

*Durability*: the promise that once a transaction has committed successfully, any data it has written will not be forgotten.

In order to provide a durability guarantee, a database must wait until these writes or replications are complete before reporting a transaction as successfully committed.

The term *transaction* nevertheless stuck, referring to a group of reads and writes that form a logical unit. If it fails, the application can safely retry.

In relational databases, that is typically done based on the client's TCP connection to the database server.

Systems that do not meet the ACID criteria are sometimes called BASE (Basically Available, Soft state, and Eventual consistency).

The most basic level of transaction isolation is *read committed*: no dirty reads, no dirty writes.

*Snapshot isolation*: each transaction reads from a consistent snapshot of the database — that is, the transaction sees all the data that was committed at the start of the transaction.

Race conditions between clients can cause surprising bugs. Concurrency issues.

For example, in multi-threaded programming, if one thread executes an atomic operation, that means there is no way that another thread could see the half-finished result of the operation.

In general, the application defines what data is valid or invalid — the database only stores it.

---

## Batch and Stream Processing

### Batch Processing

Batch processing systems (offline systems): take a large amount of input data, run a job to process it, and produce some output data. The primary performance measure of a batch job is usually *throughput*.

Periodically crunch a large amount of accumulated data.

Unix philosophy. A Unix shell like bash. Another characteristic feature of Unix tools is their use of standard input (stdin) and standard output (stdout). Pipes let you attach the stdout of one process to the stdin of another process.

MapReduce. Hadoop. Spark. The working set of the job (the amount of memory to which the job needs random access).

The process of writing out this intermediate state to files is called *materialization*.

Data needs to be replicated to multiple machines anyway. You might as well store that redundant data sorted in different ways so that when you're processing a query, you can use the version that best fits the query pattern.

Thus, Hadoop has often been used for implementing ETL processes: data from transaction processing systems is dumped into the distributed filesystem in some raw form, and then MapReduce jobs clean up, transform, and import it into an MPP data warehouse. Data modeling still happens, but it is a separate step, decoupled from the data collection.

Batch processing — techniques that read a set of files as input and produce a new set of output files. The output is a form of *derived data*.

This approach has been dubbed the sushi principle: "raw data is better."

### Stream Processing

A "stream" refers to data that is incrementally made available over time. In reality, a lot of data is unbounded because it arrives gradually over time — this process never ends, and so the dataset is never "complete" in any meaningful way.

In a filesystem, a filename identifies a set of related records; in a streaming system, related events are usually grouped together into a *topic* or stream.

In batch processing, a file is written once and then potentially read by multiple jobs. Analogously, in streaming, an event is generated once by a producer and then potentially processed by multiple consumers.

Stream processing systems (near-real-time). Stream analytics. Event time versus processing time.

*Change data capture* (CDC): observing all data changes written to a database and extracting them in a form in which they can be replicated to other systems.

*Event sourcing*: a technique that was developed in the domain-driven design (DDD) community.

### Message Brokers

Message brokers: a widely used alternative to direct network communication. A message broker is essentially a kind of database optimized for handling message streams.

Two types of message brokers. What happens if the producers send messages faster than the consumers can process them? Three options: drop messages, buffer messages in a queue, or apply *backpressure* (flow control).

In order to ensure that the message is not lost, message brokers use *acknowledgments*.

A messaging system allows multiple producer nodes to send messages to the same topic and allows multiple consumer nodes to receive messages in a topic.

Using logs for message storage: a producer sends a message by appending to the end of the log, and a consumer receives messages by reading the log sequentially.

Within each partition, the broker assigns a monotonically increasing sequence number, or *offset*, to every message. Consumer offsets — all messages with an offset less than a consumer's current offset have already been processed.

The log can be partitioned. Different partitions can then be hosted on different machines.

The broker does not need to track acknowledgments for every single message — it only needs to periodically record the consumer offsets.

Effectively, the log implements a bounded-size buffer (circular buffer or ring buffer) on disk.

Apache Kafka, Amazon Kinesis Streams, and Twitter's DistributedLog are log-based message brokers.

Message queues with database-like durability guarantees (Apache Kafka). Datastores that are also used as message queues (Redis).

### Derived Data Systems

On a high level, systems that store and process data can be grouped into two broad categories: *Systems of record* and derived data systems.

Source of truth — holds the authoritative version of your data. If there is any discrepancy, the value in the system of record is (by definition) the correct one.

Remember the result of an expensive operation, to speed up reads (caches). Allow users to search data by keyword or filter it in various ways (search indexes). Send a message to another process, to be handled asynchronously (stream processing).

The result of taking some existing data from another system and transforming or processing it in some way. Denormalized values, indexes, and materialized views also fall into this category.

When new data comes in, it is first written here. Each fact is represented exactly once (the representation is typically normalized).

The traditional approach to database design is based on the fallacy that data must be written in the same form as it will be queried. Debates about normalization and denormalization become largely irrelevant if you can translate data from a write-optimized event log to read-optimized application state.

The dataflow across an entire organization starts looking like one huge database. Whenever a batch, stream, or ETL process transports data from one place and form to another place and form, it is acting like the database subsystem that keeps indexes or materialized views up to date.

In particular, reprocessing existing data provides a good mechanism for maintaining a system, evolving it to support new features and changed requirements.

Provide tools to recompute data.

An idempotent operation is one that you can perform multiple times, and it has the same effect as if you performed it only once.

Having continuous end-to-end integrity checks gives you increased confidence about the correctness of your systems, which in turn allows you to move faster.

Designing for auditability. Analytic queries and integrity checks. Trust, but Verify.

---

## Ethics and Responsibility

It seems ridiculous to believe that an algorithm could somehow take biased data as input and produce fair and impartial output from it.

Machine learning is like money laundering for bias.

If the past is discriminatory, they codify that discrimination. If we want the future to be better than the past, moral imagination is required, and that's something only humans can provide. Data and models should be our tools, not our masters.

Whether something is "undesirable" or "inappropriate" is of course down to human judgment; algorithms are oblivious to such notions unless we explicitly program them to respect human needs. As engineers of these systems we must be humble, accepting and planning for such failings.

In our attempts to make software "eat the world," we have built the greatest mass surveillance infrastructure the world has ever seen.

This kind of large-scale transfer of privacy rights from individuals to corporations is historically unprecedented.

When data is extracted from people through surveillance infrastructure, privacy rights are not necessarily eroded, but rather transferred to the data collector.

Moreover, data is extracted from users through a one-way process, not a relationship with true reciprocity, and not a fair value exchange. The terms are set by the service, not by the user.

Perhaps you feel you have nothing to hide — in other words, you are totally in line with existing power structures, you are not a marginalized minority, and you needn't fear persecution. Not everyone is so fortunate.

For a user who does not consent to surveillance, the only real alternative is simply not to use a service. But this choice is not free either: if a service is so popular that it is "regarded by most people as essential for basic social participation," then it is not reasonable to expect people to opt out — using it is de facto mandatory.

> Knowledge is power. And furthermore, to scrutinize others while avoiding scrutiny oneself is one of the most important forms of power.

When collecting data, we need to consider not just today's political environment, but all possible future governments. "It is poor civic hygiene to install technologies that could someday facilitate a police state."

The movement sensor in a smartwatch or fitness tracker can be used to work out what you are typing (for example, passwords) with fairly good accuracy.

In countries that respect human rights, the criminal justice system presumes innocence until proven guilty; on the other hand, automated systems can systematically and arbitrarily exclude a person from participating in society without any proof of guilt, and with little chance of appeal.

> Almost all computers produce information. It stays around, festering. How we deal with it — how we contain it and how we dispose of it — is central to the health of our information economy.

As a thought experiment, try replacing the word *data* with *surveillance*, and observe if common phrases still sound so good.

As software and data are having such a large impact on the world, we engineers must remember that we carry a responsibility to work toward the kind of world that we want to live in: a world that treats people with humanity and respect.

---

*All Excerpts From: Martin, Kleppmann. "Designing Data-Intensive Applications." O'Reilly Media Inc., 2017-03-17. Apple Books. This material may be protected by copyright.*
