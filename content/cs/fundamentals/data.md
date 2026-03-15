---
title: Data
category: CS
tags:
  - data
  - data-engineering
  - databases
  - pipelines
  - warehousing
date: '2026-02-16'
excerpt: 'Comprehensive overview of data engineering fundamentals including storage types, modeling, pipelines, architecture patterns, and third-party tools.'
stub: false
verified: false
notionId: 1b8a584d-bff3-80f5-858a-da2336b11882
---

[[Certs]] | [[LeetCode Notes]] | [[SQL]]

---

[[Snowflake]]

---

## Core Concepts

**OLTP (Online Transaction Processing):**
- Designed for day-to-day operational tasks handling large volumes of short, fast transactions
- Handles inserting customer orders, updating account balances, processing payments
- Prioritizes speed, consistency, and reliability
- Database is normalized to minimize redundancy and ensure data integrity
- Queries are simple and affect small numbers of records
- Uses row-based storage optimized for reading and writing complete records quickly
- Maintains current data with frequent updates
- Examples: e-commerce checkout systems, banking applications, inventory management
- Focus is keeping current operational data accurate and available

**OLAP (Online Analytical Processing):**
- Serves analytical and reporting purposes
- Handles complex queries that aggregate and analyze large volumes of historical data
- Answers questions like "What were total sales by region for the last five years?"
- Data is denormalized or organized into dimensional models like star schemas
- Response times are slower than OLTP but acceptable for analysis workloads
- Uses column-based storage efficient for aggregating specific attributes across many records
- Works with snapshots of historical data periodically loaded from OLTP systems through ETL
- Optimized for read-heavy analytical queries

**Data Lake:**
- Centralized repository for storing both structured and unstructured data at scale in original raw format
- Data lakes ingest data from databases, sensors, social media, documents, applications without requiring upfront schema definitions
- Schema-on-read approach: apply structure when reading data rather than when storing it
- Flexibility supports big data analytics, machine learning, and AI workloads
- Before analysis, raw data undergoes transformations like cleansing, normalization, aggregation
- Common zones: raw/bronze layer (unprocessed), processed/silver layer (cleaned/validated), curated/gold layer (business-ready aggregated)
- Metadata management critical since lakes can become data swamps without proper cataloging and governance
- Excel at storing large volumes of diverse data cheaply, supporting exploratory analysis, serving as historical archive
- Struggle with data quality enforcement, complex permissions management, performance for structured analytical queries vs warehouses
- More cost-effective for large volumes of data
- Stores data in raw form first (ELT process)
- Greater flexibility but potentially slower query performance without optimization

**Data Warehouse:**
- Central repository of structured, processed data optimized for analytics
- Data flows in from business applications, databases, and other sources
- Uses predefined schema (schema-on-write approach) ensuring data quality at ingestion but reducing flexibility vs lakes
- Typically more expensive per TB of storage
- Used primarily for reporting, BI, and structured analytics
- Data is transformed before loading (ETL process)
- Optimized for fast query performance on structured data
- Powers reports, dashboards, and analytics tools by storing data efficiently
- Delivers query results quickly to hundreds or thousands of concurrent users
- Uses dimensional modeling with fact tables holding measurable events and dimension tables providing descriptive context
- Star schemas denormalize data for query performance while snowflake schemas normalize dimensions to reduce redundancy
- Slowly changing dimensions track how attributes change over time (type 1 overwrite, type 2 versioning, type 3 limited history)
- Warehouses optimize for read-heavy workloads with columnar storage, compression, materialized aggregations

**Modern Data Architecture:**
- Combines scalability of data lakes with reliability and structure of data warehouses
- Built on five elements: scalable data lakes, purpose-built data services, seamless data movement, unified governance, cost-effective performance
- Uses managed services and purpose-built data stores for different workloads rather than forcing all data into one system
- Aims to minimize data movement while enabling convenient data storage, analysis, and transfer
- Unified governance ensures compliance, security, and access control across all data systems
- Lakehouse architecture merges lakes and warehouses by adding ACID transactions, schema enforcement, governance to data lake storage
- Technologies like Delta Lake, Apache Iceberg, Apache Hudi enable lakehouse patterns on S3 or cloud storage
- Provides low-cost storage and flexibility of lakes with reliability and performance of warehouses
- Eliminates redundant data copies between lake and warehouse
- Medallion architecture implements lakehouse patterns with bronze, silver, gold data tiers representing increasing quality and refinement

**Data Mesh:**
- Decentralized data architecture treating data as products managed by domain teams rather than central data team
- Each business unit or domain provisions own self-serve data platform and owns its data products
- Domain teams maintain own data lakes with proper cataloging and schemas
- Central IT provides shared infrastructure like catalogs, observability tools, governance policies but doesn't manage data itself
- Separation of producers, consumers, governance aims to increase organizational agility and analytical speed while maintaining consistency
- Four principles: domain-oriented decentralized data ownership, data as product with clear ownership and SLAs, self-serve data infrastructure platform, federated computational governance with automated policy enforcement
- Contrasts with centralized data teams that become bottlenecks as organizations scale
- Works well for large organizations with distinct business domains but adds complexity for smaller teams
- Requires cultural change not just technology since domains must take responsibility for data quality and availability

**Data Product:**
- Curated dataset provided by domain team to serve specific business needs within data mesh
- Beyond raw data includes value-added content like cleaned schemas, transformation code, quality metrics, documentation
- Emphasizes discoverability, quality, reusability across organization
- Should be discoverable through catalogs, addressable with stable interfaces, trustworthy with quality guarantees, self-describing with complete metadata, secure with built-in access controls, interoperable using standard formats
- Product thinking means treating data consumers as customers, monitoring usage and satisfaction, versioning interfaces carefully, maintaining backward compatibility
- Teams publish SLAs around freshness, completeness, accuracy
- Reduces friction of data access while maintaining governance and quality standards

**Data Pipelines:**
- Automated processes that extract data from sources, transform it, and load into target systems for analysis, reporting, or business uses
- Components: data sources, extraction, transformation (cleaning, enrichment, aggregation, normalization), loading, orchestration (scheduling, dependency management, monitoring), error handling, monitoring and logging
- Common architectures: batch processing at scheduled intervals, stream processing in real-time, lambda architecture combining both
- Modern pipelines increasingly follow ELT rather than traditional ETL patterns especially with cloud data warehouses and lakehouses
- Essential for moving data from operational systems to analytical platforms

**Federated Queries:**
- Allows executing SQL queries across multiple disparate databases or storage systems
- No need to move or copy data between systems
- Enables unified data access and analysis across distributed data sources
- Queries pull data from multiple sources and combine results
- Useful for querying across data silos without ETL overhead
- Adds latency compared to querying single system
- e.g.: Redshift querying S3 and RDS simultaneously, Snowflake querying external tables

---

## Data Modeling

- Process of creating conceptual representation of data objects, their relationships, and how data flows through system
- Fundamental step in designing databases and data warehouses
- Determines how data is stored, organized, and accessed
- Different approaches serve different purposes (transactional vs analytical)

**Normalization:**
- Organizing data to minimize redundancy and improve data integrity
- Structuring data into tables with relationships following specific rules called Normal Forms
- Goal: reduce redundancy, improve integrity, avoid anomalies during insert/update/delete operations
- First Normal Form (1NF): columns contain atomic indivisible values, each row is unique with primary key, no repeating groups
- Second Normal Form (2NF): meets 1NF and all non-key attributes depend on entire primary key, no partial dependencies
- Third Normal Form (3NF): meets 2NF and eliminates transitive dependencies where non-key attributes depend on other non-key attributes
- Higher forms (BCNF, 4NF, 5NF) address more complex dependencies, less commonly enforced in practice
- Pros: high data integrity, minimal redundancy, efficient data modification, clearer data structure, space efficient
- Cons: requires more tables, queries need joins which can be complex and slower for read operations
- Typical use: OLTP systems like order entry, banking, inventory management where data integrity and efficient writing/updating critical

**Denormalization:**
- Intentionally introducing redundancy to improve query performance
- Adding pre-calculated values or combining data from multiple tables into one
- Goal: improve read performance and simplify queries
- Methods: adding redundant columns, creating pre-aggregated or summary tables, combining tables
- Pros: faster query execution for specific read patterns, simpler queries
- Cons: increased data redundancy, potential for data inconsistency, more complex data modification logic, increased storage requirements
- Typical use: OLAP systems, data warehouses, reporting databases where read performance paramount and data updates less frequent

**Dimensional Modeling:**
- Design technique specifically optimized for data warehousing and business intelligence
- Structures data for intuitive analysis and high-performance querying
- Focuses on business metrics (facts) and their context (dimensions)
- Fact Table: typically at schema center, contains measures (numeric additive values like Sales Amount, Quantity Sold, Profit) and foreign keys linking to dimension tables
- Dimension Tables: contain descriptive attributes related to facts like Time, Product, Customer, Location; have primary key (often surrogate key) and attributes

**Star Schema:**
- Simplest dimensional model with single central fact table
- Several dimension tables directly connected to fact table like points of a star
- Dimension tables generally denormalized
- Pros: simple structure easy to understand and query, optimized for BI tools and query performance (fewer joins)
- Cons: dimension tables can have redundancy, can lead to large dimension tables
- Most common choice for data marts and data warehouses due to simplicity and performance benefits

**Snowflake Schema:**
- Variation of Star Schema where dimension tables are normalized
- Hierarchies within dimension broken out into separate related tables
- Pros: reduced redundancy within dimensions, easier maintenance of dimension hierarchies
- Cons: more complex structure, queries require more joins negatively impacting performance
- Use when dimension hierarchies are complex or storage space is major constraint

**Data Vault Modeling:**
- Hybrid approach combining normalization, denormalization, and historical tracking
- Components: Hubs (core business entities), Links (relationships between hubs), Satellites (attributes and historical data with start/end dates)
- Use cases: auditing, historical tracking, scalable data lakes
- Provides auditability and scalability for enterprise data lakes
- Especially useful when need to track complete history of data changes and maintain source system lineage

---

## Data Quality

**Key Dimensions:**
- Accuracy: data correctly represents the real-world entity or event
- Completeness: all required data fields are populated without missing values
- Consistency: data is uniform across different sources and systems
- Timeliness: data is up-to-date and available when needed
- Uniqueness: no duplicate records exist unless explicitly required
- Validity: data conforms to defined formats, standards, and rules
- Reliability: data remains accurate and trustworthy over time
- Integrity: relationships between datasets are correctly maintained

**Best Practices:**
- Data profiling: analyze datasets for inconsistencies, patterns, and anomalies
- Automated data validation: use rules and constraints in ETL processes to catch issues early
- Monitoring and alerts: implement data quality checks with logging and notifications
- Standardization: apply naming conventions and data governance policies consistently
- Deduplication and cleaning: use algorithms to merge duplicate records and clean malformed data
- Implement Great Expectations or AWS Deequ for automated testing
- Quarantine bad records for investigation rather than failing entire jobs
- Implement data contracts defining expectations between producers and consumers

---

## Data Movement Patterns

**Batch Processing:**
- Moves data in scheduled chunks at regular intervals like hourly, daily, or weekly
- Processes finite, bounded datasets on a schedule
- Higher latency but often higher throughput
- Often simpler to implement and debug
- Excels at processing large volumes efficiently and provides clear checkpoints for monitoring and recovery
- Typically runs during off-peak hours to avoid impacting operational systems
- Full loads copy entire datasets while incremental loads only move changed records since last run
- Incremental strategies: timestamp-based, append-only, merge patterns
- Use when: reporting doesn't need real-time data, processing large volumes of historical data, complex transformations computationally intensive
- Technologies: Apache Spark, SQL-based ETL tools, AWS Glue

**Stream Processing:**
- Handles data continuously as it's generated
- Processes unbounded, continuous data streams
- Runs continuously processing data as it arrives
- Lower latency but sometimes lower throughput
- Enables immediate reactions to events like fraud detection, real-time recommendations, operational monitoring
- Windowing groups events into time buckets for aggregation
- Watermarks handle late-arriving data
- State management tracks information across events
- Backpressure prevents overwhelming downstream systems
- Use when: real-time analytics needed, fraud detection, system monitoring, anomaly detection
- Technologies: Apache Kafka, Kafka Streams, Apache Flink, Kinesis Data Analytics

**Micro-Batch Processing:**
- Processes small batches at frequent intervals like every few minutes
- Blends batch and streaming characteristics
- Spark Structured Streaming uses micro-batches internally
- Provides near-real-time latency without full streaming complexity
- Balance freshness requirements against processing overhead

**Change Data Capture (CDC):**
- Identifies and captures changes in source databases rather than moving entire datasets
- Tracks inserts, updates, deletes as they occur in transaction log
- Only changed records flow downstream reducing data volume and enabling near-real-time replication
- Tools: Debezium, AWS DMS, Oracle GoldenGate
- Works well for keeping data warehouses synchronized with operational databases without full extracts

**Full Load vs Incremental Load:**
- Full loads: copy entire datasets regardless of what changed, simple to implement
- Use full loads for: small dimension tables, initial loads, when change tracking unreliable
- Incremental loads: only move new or modified records
- Incremental patterns: append-only, upsert, merge, delta
- Most production pipelines use incremental loading after initial full loads

**Replication:**
- Maintains synchronized copies of data across systems
- Synchronous replication: waits for confirmation from replicas, ensures consistency but adds latency
- Asynchronous replication: completes writes immediately, reduces latency but allows temporary inconsistency
- Logical replication: copies data changes using SQL statements
- Physical replication: copies binary data blocks
- Use for: disaster recovery, geographic distribution, offloading read queries

**Data Partitioning:**
- Divides large datasets into smaller manageable pieces called partitions
- Benefits: improved query performance, parallel processing, scalability, data lifecycle management, load balancing
- Year/month/day hierarchical partitioning suits time-series data
- Avoid over-partitioning which creates metadata overhead
- Hive-style partitioning uses folder structures like year=2024/month=01/

---

## Storage Types

**Block Storage:**
- Raw storage with hardware devices formatted into predefined continuous segments called blocks
- Provides foundation that other storage types build upon
- Delivers high performance with low latency since provides direct access to storage blocks
- Common use cases: database storage, virtual machine file systems, frequent read-write operations
- AWS offers Elastic Block Store (EBS) for EC2 instances
- Typically only attaches to one compute instance at a time

**File Storage:**
- Built on top of block storage and organized by operating system
- Data stored as files in directory tree hierarchy
- Supports shared access from multiple systems simultaneously using protocols like NFS or SMB
- AWS Elastic File System (EFS) provides managed file storage
- Works well for traditional file system interfaces, shared content repositories

**Object Storage:**
- Stores data within binary objects of predetermined sizes
- Objects identified by unique keys in flat namespace though key prefixes simulate folder hierarchies
- Metadata is extensible allowing custom attributes
- Excels at massive scale: S3 stores trillions of objects
- Suits: write-once-read-many patterns, archival data, unstructured data, data lake storage
- HTTP-based access model works across networks but adds latency vs block storage

---

## Third-Party Tools

**Snowflake:**
- Cloud-based data platform providing data warehouse-as-a-service
- Architecture: multi-cluster shared data with three distinct layers (storage, compute, services)
- Complete separation of storage and compute allowing independent scaling
- Zero administration: no indexing, partitioning, tuning required
- Micro-partitions automatically partitioned on ingestion
- Time Travel accesses historical data up to 90 days back
- Virtual warehouses are compute clusters sized from X-Small to 6X-Large
- Multi-cluster warehouses automatically scale during concurrency spikes
- Snowpipe continuously loads data from stages as files arrive
- Streams track changes to tables for CDC patterns
- Tasks schedule SQL statements to run periodically
- Data sharing enables publishing data to other Snowflake accounts without copying
- Zero-copy cloning creates table/database clones without duplicating data
- Supports semi-structured data: JSON, Avro, Parquet, XML
- Runs on AWS, Azure, Google Cloud

**Apache Spark:**
- Unified analytics engine for large-scale data processing
- In-memory processing dramatically faster than traditional disk-based systems
- Handles batch processing, interactive queries, streaming, machine learning, graph processing
- Multiple language support: Java, Scala, Python, R, SQL
- Key components: Spark Core (RDD abstraction), Spark SQL, Spark Streaming, MLlib, GraphX
- DataFrames and Datasets provide higher-level APIs with optimization
- Catalyst optimizer generates efficient execution plans

**Apache Kafka:**
- Distributed event streaming platform designed for high-throughput, fault-tolerant handling of real-time data feeds
- Publisher-subscriber model decouples data producers from consumers
- Core concepts: Topics, Partitions, Producers, Consumers, Brokers, Consumer Groups
- Messages retained based on time or size allowing replay
- Kafka Connect framework for integrating with external systems
- Kafka Streams library for stream processing applications
- Guarantees: at-least-once, at-most-once, or exactly-once delivery semantics depending on configuration

**Elasticsearch:**
- Distributed search and analytics engine built on Apache Lucene
- Stores data in indices optimized for full-text search and aggregations
- Commonly used for log analytics, application search, real-time analytics dashboards
- Inverted indices map terms to documents for fast full-text search
- Documents are JSON objects stored in indices
- Queries use Query DSL, a JSON-based language
- Aggregations compute statistics like sums, averages, histograms
- Index lifecycle management automatically ages out old data
- Hot-warm architecture separates frequently accessed data from historical data
- Use cases: full-text search, log aggregation, real-time monitoring, security analytics

---

## Architecture Patterns

**Lambda Architecture:**
- Combines batch layer for accuracy with stream layer for speed
- Batch layer processes complete datasets for historical accuracy
- Speed layer provides low-latency updates for recent data
- Serving layer merges results from batch and speed layers
- Creates complexity maintaining two separate processing paths

**Kappa Architecture:**
- Uses only stream processing for both real-time and batch workloads
- Simplifies by maintaining single processing path
- Reprocesses historical data through same streaming pipeline when needed
- Everything is treated as stream: batch is just bounded stream

**Lakehouse Architecture:**
- Merges data lakes and data warehouses into unified platform
- Adds ACID transactions, schema enforcement, governance to data lake storage
- Technologies: Delta Lake, Apache Iceberg, Apache Hudi
- Medallion architecture: bronze (raw), silver (cleaned), gold (business-ready) tiers

**Compression:**
- Snappy offers good compression speed with moderate ratio
- Gzip achieves better compression ratios with slower processing
- Choose compression based on read-to-write ratio and CPU availability

**Schema Evolution:**
- Plan for schema changes as sources evolve
- Schema-on-read systems like Athena and Spark handle missing columns gracefully
- Use nullable fields for new columns to handle old data
- Consider using schema registries for formal schema management

**Incremental Processing:**
- Process only new or changed data in subsequent runs
- Glue bookmarks track processed files
- Implement idempotent processing to handle reruns safely

**Cost Optimization:**
- Use spot instances for EMR and Glue jobs when appropriate
- Partition data to reduce Athena scan costs
- Archive old data to cheaper storage tiers
- Right-size warehouses based on workload
- Turn off idle resources

**Monitoring and Alerting:**
- Monitor pipeline execution, data freshness, data quality
- Track data lineage to understand dependencies
- Set up dashboards showing pipeline health and performance
- Monitor SLAs for data freshness and completeness

**Security and Governance:**
- Encrypt data at rest and in transit
- Use IAM roles instead of access keys for service authentication
- Implement least privilege access
- Catalog sensitive data and apply appropriate protection
- Implement data retention policies based on compliance requirements

**Testing:**
- Test ETL logic with sample data before production deployment
- Validate schema conversions and transformations
- Use version control for pipeline code
- Implement CI/CD for automated testing and deployment
- Unit test transformation logic, integration test end-to-end pipelines

---

## Common Challenges

**Late-Arriving Data:**
- Streaming systems may receive out-of-order events
- Windowing with watermarks accommodates late data within acceptable bounds
- Use event time rather than processing time for windowing
- Consider using sessions or grace periods

**Schema Drift:**
- Source schemas change as applications evolve
- Maintain schema registries documenting expected schemas
- Add monitoring to detect schema changes early
- Build in schema flexibility where appropriate

**Data Skew:**
- Uneven data distribution creates hot spots
- In Spark salting adds randomness to keys for better distribution
- Broadcast joins send small tables to all nodes
- Use adaptive query execution in Spark to handle skew dynamically

**Complex Joins:**
- Broadcast small dimension tables rather than shuffling
- Partition tables on join keys for co-location
- Pre-aggregate data before joins when possible
- Consider denormalization for frequently joined tables

**Pipeline Failures and Recovery:**
- Implement retry logic with exponential backoff
- Make jobs idempotent so reruns don't duplicate data
- Checkpoint progress to resume from failures
- Design for partial failures in distributed systems

**Data Freshness vs Cost:**
- Real-time pipelines cost more than batch processing
- Micro-batching provides middle ground
- Consider whether users actually need real-time data
- Implement tiered freshness based on use case importance

**Multi-Cloud and Hybrid Environments:**
- Data gravity makes moving data expensive and slow
- Use cloud-agnostic formats like Parquet and tools like Apache Spark
- Process data where it lives when possible
- Consider data residency and compliance requirements

---

## Choosing the Right Approach

**Data Modeling:**
- Transactional databases (OLTP): normalization (3NF, BCNF) for data integrity
- Fast analytical queries (OLAP): denormalization (star schema) for performance
- Storage-efficient warehousing: snowflake schema when dimension size matters
- Large auditable data lakes: data vault for historical tracking
- With decreasing storage costs and increasing compute power star schemas generally preferred over snowflake

**Pipeline Architecture:**
- Source systems usually OLTP databases
- Extract data from OLTP, transform, load into OLAP systems like warehouses
- Analysts query warehouses without impacting operational performance
- Consider latency requirements, data volume, transformation complexity when choosing batch vs streaming
- Lakehouse architectures increasingly popular for unified analytics

---

## ACID Transactions

Four key properties to guarantee database operations are processed reliably and accurately, ensuring data integrity even during failures:

- **Atomicity (All or Nothing):** Treats a series of database operations as a single, indivisible unit. If any part of the transaction fails, the entire transaction is aborted and rolled back, leaving the database unchanged.
- **Consistency (Valid State):** Ensures that a transaction brings the database from one valid state to another, maintaining all predefined rules, constraints, and data integrity.
- **Isolation (Concurrent Control):** Guarantees that concurrent transactions do not interfere with each other, preventing partial or uncommitted data from being visible to other operations.
- **Durability (Permanent):** Guarantees that once a transaction is committed, it remains in the system, even in the event of power loss, crashes, or errors.
