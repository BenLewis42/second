---
title: Data Cheatsheet
category: CS
tags:
  - data-engineering
  - databases
  - data-architecture
  - cheatsheet
date: '2025-10-09'
excerpt: 'Quick-reference guide covering core data engineering concepts including warehouses, lakes, pipelines, schemas, and distributed systems.'
stub: false
verified: false
notionId: 1b8a584d-bff3-801e-adf0-cdfdd3a98594
---

# Data Cheatsheet

---

## Publish–Subscribe Pattern (Pub/Sub)

(i.e. Kafka)

A messaging pattern in which message senders, called publishers, categorize messages into classes (or topics), and send them without needing to know which components will receive them. Message recipients, called subscribers, express interest in one or more classes and only receive messages in those classes, without needing to know the identity of the publishers.

---

## Data Warehouse

When you need consistent, structured data for regular reporting, BI tools, and when query performance is critical.

- Structured data organized in a schema-based format (typically relational)
- Optimized for analytical queries and business intelligence
- Contains processed, cleaned data ready for analysis
- Schema-on-write approach (data is transformed before loading)
- Usually more expensive and less scalable than data lakes

## Data Lake

When dealing with diverse data formats, when future use cases aren't fully defined, or when you need a cost-effective repository for all your organization's data.

- Can store structured, semi-structured, and unstructured data
- Stores raw data in its native format
- Schema-on-read approach (structure applied when data is read)
- Highly scalable and relatively low-cost storage
- Better for big data processing and exploratory analysis

---

## SQL JOIN Types

(e.g. customers, orders)

1. **INNER JOIN**: Returns only the matching rows from both tables.
   - Example: When you want to find only customers who have placed orders.
2. **LEFT JOIN**: Returns all rows from the left table and matching rows from the right table. If no match exists, NULL values appear in right table columns.
   - Example: When you want all customers, whether they've placed orders or not.
3. **RIGHT JOIN**: Returns all rows from the right table and matching rows from the left table. If no match exists, NULL values appear in left table columns.
   - Example: When you want all orders, even those without customer information.
4. **FULL OUTER JOIN**: Returns all rows from both tables. Where no match exists, NULL values appear.
   - Example: When you want a complete view of both customers and orders, showing all relationships and gaps.

---

## Data Partitioning

- Divides large datasets into smaller, more manageable chunks
- Based on certain criteria like date, geography, or ID ranges
- Improves query performance through:
  - **Reduced scan size**: Queries can skip irrelevant partitions (partition pruning)
  - **Parallel processing**: Different partitions can be processed simultaneously
  - **Better maintenance**: Operations like backup, archiving, or deletion can target specific partitions
- e.g. For a retail data system with billions of transaction records, partition by:
  - Date (year/month): Most queries filter by time periods
  - Store location: Regional queries become more efficient
  - Product category: For category-specific analysis
  - This allows queries like "sales of electronics in Northeast stores for January 2024" to scan only relevant partitions rather than the entire dataset.

---

## Slowly Changing Dimensions (SCDs)

Techniques used to track historical changes to dimension records in a data warehouse:

- **Type 0**: No tracking of changes (attribute values never change)
- **Type 1**: Overwrite the old value (no history kept)
- **Type 2**: Create a new row with the changed data, keeping historical records
- **Type 3**: Add new columns to store previous values (limited history)
- **Type 4**: Use separate history tables to track all changes

To implement Type 2 SCD:

1. Add tracking columns to the dimension table: `effective_start_date`, `effective_end_date`, and `is_current_flag`
2. When an attribute changes, set the end_date and is_current_flag on the existing record
3. Insert a new record with updated values, current start_date, NULL or far-future end_date, and is_current_flag = true
4. Queries for "current" values filter on `is_current_flag = true` or where current_date is between effective dates

---

## Normalization

The process of organizing database structures to reduce redundancy and improve data integrity through a series of forms (1NF, 2NF, 3NF, etc.). It involves:

- Eliminating redundant data
- Ensuring data dependencies make sense
- Breaking down tables into smaller, related tables

Best for transactional (OLTP) systems where data integrity and write performance are critical.

## Denormalization

Deliberately introduces redundancy to improve read performance by reducing the need for complex joins.

Best for analytical (OLAP) systems where read performance and query simplicity are priorities.

In data engineering specifically:

- Use normalization for source systems and staging areas
- Use denormalization for data warehouses, especially star/snowflake schemas
- Consider the query patterns: if users frequently need data from multiple sources together, denormalization may be preferable

---

## Data Streaming vs Batch Processing

**Data Streaming:**

- Processes data continuously as it arrives
- Handles individual records or micro-batches
- Focuses on low-latency processing
- Suitable for real-time applications and monitoring

**Batch Processing:**

- Processes data in large chunks at scheduled intervals
- Handles complete datasets
- Optimized for throughput rather than latency
- Suitable for complex analytics not requiring immediate results

**Technologies:**

- **Streaming**: Apache Kafka, Apache Flink, Apache Spark Streaming, AWS Kinesis, Google Pub/Sub
- **Batch**: Apache Hadoop, Apache Spark, AWS EMR, Google Dataflow (batch mode), Databricks

The choice depends on requirements:

- Use streaming for real-time dashboards, fraud detection, or IoT applications
- Use batch for daily reports, complex analytics, or when perfect accuracy is critical

Hybrid approaches like Lambda or Kappa architectures combine both paradigms.

---

## Data Modeling

The process of creating a conceptual representation of data objects, their relationships, and the rules governing them.

### Common Data Warehouse Schemas

1. **Star Schema**:
   - Central fact table connected to dimension tables
   - **Pros**: Simple to understand, optimized for read performance, works well with BI tools
   - **Cons**: Data redundancy, not as flexible for changing requirements
2. **Snowflake Schema**:
   - Fact table connected to dimension tables that are further normalized
   - **Pros**: Reduces redundancy, better data integrity, saves storage
   - **Cons**: More complex queries, potentially slower performance due to more joins
3. **Galaxy Schema (Fact Constellation)**:
   - Multiple fact tables sharing dimension tables
   - **Pros**: Models complex business processes, reuses dimensions
   - **Cons**: Complex to design and manage
4. **Data Vault**:
   - Separated into hubs (business keys), links (relationships), and satellites (descriptive attributes)
   - **Pros**: Highly adaptable to change, tracks history well, scales effectively
   - **Cons**: Complex implementation, steeper learning curve, requires more transformation for reporting

---

## Data Pipeline Orchestration

Involves managing and coordinating the execution of dependent tasks within data workflows to ensure reliable data movement and transformation.

**Common orchestration tools**: Apache Airflow, AWS Step Functions

**Factors for robust pipeline design:**

1. **Idempotency**: Pipelines should produce the same result regardless of how many times they're run
2. **Fault tolerance**: Ability to handle failures gracefully with proper error handling
3. **Monitoring and alerting**: Visibility into pipeline performance and failures
4. **Scalability**: Handling growing data volumes without redesign
5. **Parameterization**: Configurable without code changes
6. **Dependency management**: Clear task dependencies and execution order
7. **Data quality checks**: Validation at critical points in the pipeline
8. **Backfilling capability**: Processing historical data when needed
9. **Resource management**: Efficient use of compute resources
10. **Documentation**: Clear documentation of pipeline purpose and components

When designing pipelines, focus on breaking processes into atomic, reusable tasks that can be independently tested and monitored, while ensuring clear data lineage.

---

## Data Quality

Refers to the fitness of data for its intended purpose, measured across dimensions including:

- **Accuracy**: Data correctly represents reality
- **Completeness**: Required data is present and not missing
- **Consistency**: Data agrees across different systems
- **Timeliness**: Data is current and available when needed
- **Validity**: Data conforms to defined formats and constraints
- **Uniqueness**: No unexpected duplicates exist

To ensure high data quality in pipelines:

1. **Profiling**: Analyze source data characteristics before transformation
2. **Schema validation**: Verify data structure matches expectations
3. **Business rule validation**: Apply domain-specific validation rules
4. **Data quality metrics**: Define and track key metrics over time
5. **Automated testing**: Build test cases for critical transformations
6. **Exception handling**: Create processes for addressing quality issues
7. **Data lineage tracking**: Understand data origins and transformations
8. **Monitoring**: Set up alerts for quality threshold violations
9. **Self-service data quality tools**: Enable domain experts to define rules
10. **Quality gates**: Prevent low-quality data from flowing downstream

These approaches should be implemented at pipeline ingestion, transformation, and delivery phases.

---

## OLTP vs OLAP

**OLTP (Online Transaction Processing):**

- Manages day-to-day transactions and business operations
- High volume of small, simple transactions (inserts/updates)
- Few records accessed per transaction
- Sub-second response time requirements
- Highly normalized data model
- Current data focus

**OLAP (Online Analytical Processing):**

- Supports complex analysis, reporting, and decision-making
- Low volume of complex analytical queries
- Large datasets scanned per query
- Longer response times acceptable
- Denormalized data model
- Historical data focus

**Data Modeling Differences:**

- OLTP: Entity-Relationship (ER) modeling, normalized (3NF+) to minimize redundancy
- OLAP: Dimensional modeling (star/snowflake schemas) optimized for query performance

**Example Systems:**

- OLTP: CRM systems, banking applications, order processing
- OLAP: Data warehouses, business intelligence platforms, reporting systems

---

## Row-Oriented vs Column-Oriented Databases

**Row-oriented databases:**

- Store data contiguously by row
- Efficient for retrieving complete records
- Good for write-heavy workloads with frequent inserts/updates
- Ideal for operational databases with predictable access patterns
- Examples: MySQL, PostgreSQL, Oracle

**Column-oriented databases:**

- Store data contiguously by column
- Highly efficient for analytical queries on specific columns
- Excellent compression capabilities (similar values grouped together)
- Better I/O efficiency for large analytical queries
- Examples: Apache Parquet, Apache Cassandra, Google BigQuery, Snowflake

**When to choose which:**

- **Row-oriented**: For transactional systems (OLTP) requiring frequent writes and whole-row retrievals
- **Column-oriented**: For analytical systems (OLAP) with queries that access a subset of columns, perform aggregations over large datasets, require high compression for storage efficiency, and need analytical performance without complex indexing

---

## CAP Theorem

States that a distributed database system can only guarantee two of these three properties simultaneously:

1. **Consistency**: All nodes see the same data at the same time; reads return the most recent write
2. **Availability**: Every request receives a response, without guaranteeing it contains the most recent data
3. **Partition Tolerance**: The system continues to operate despite network partitions (nodes unable to communicate)

Since network partitions are unavoidable in distributed systems, we must choose between:

- **CP systems**: Prioritize consistency over availability by becoming unavailable during partitions
- **AP systems**: Prioritize availability over consistency by allowing nodes to return potentially stale data

**Real-world applications:**

- **CP databases**: HBase, MongoDB (with strict consistency settings), Neo4j
- **AP databases**: Cassandra, DynamoDB (with eventual consistency settings), CouchDB

The choice depends on business requirements — financial systems typically prioritize consistency, while content delivery or product catalogs might prioritize availability.

---

## Apache Spark vs Hadoop MapReduce

**Apache Spark** is an open-source distributed computing framework designed for big data processing with in-memory computation capabilities.

**Comparison with Hadoop MapReduce:**

- **Performance**: Spark can be 10-100x faster due to in-memory processing vs. MapReduce's disk-based approach
- **Ease of use**: Spark offers higher-level APIs in multiple languages vs. MapReduce's more complex Java implementation
- **Versatility**: Spark supports diverse workloads (batch, streaming, ML) vs. MapReduce's batch-only focus
- **Iteration**: Spark excels at iterative algorithms by caching data in memory, while MapReduce reads/writes to disk each iteration

**Key Components:**

1. **Spark Core**: Foundation providing distributed task execution, scheduling, and basic I/O
2. **Spark SQL**: SQL and structured data processing with DataFrames API
3. **Spark Streaming**: Processing of real-time data streams (micro-batch architecture)
4. **MLlib**: Machine learning library with common algorithms and utilities
5. **GraphX**: Graph processing and computation library

**Key Capabilities:**

- Lazy evaluation for optimization
- Resilient Distributed Datasets (RDDs) for fault tolerance
- DataFrames and Datasets for structured processing
- Catalog API for metadata management
- Multiple language support (Scala, Java, Python, R)
- Advanced DAG (Directed Acyclic Graph) execution engine

Spark is particularly valuable for data engineering pipelines that combine different processing paradigms (ETL + ML) or require iterative processing.

---

## Data Versioning

The practice of tracking changes to datasets over time, similar to how code versioning works for software.

**Importance:**

1. **Reproducibility**: Ensures analyses can be reproduced with the exact same data
2. **Auditability**: Provides historical record for compliance and governance
3. **Rollback capability**: Allows recovery from errors or corrupted data
4. **Experimentation**: Enables testing different data processing approaches
5. **Collaboration**: Facilitates team work on shared datasets

**Implementation approaches:**

1. **Immutable storage with timestamps**:
   - Append-only tables with effective dates
   - Partitioning by date/version
   - Example: `customer_v1`, `customer_v2` or `customer_20240521`
2. **Delta Lake / Iceberg / Hudi approach**:
   - Transaction logs tracking changes
   - Time travel queries using version identifiers
   - Example: `SELECT * FROM customers VERSION AS OF 123`
3. **Database-specific versioning**:
   - Temporal tables in SQL Server
   - System-versioned tables in PostgreSQL
   - Example: `SELECT * FROM customers FOR SYSTEM_TIME AS OF '2024-01-01'`
4. **Metadata-driven versioning**:
   - Tracking dataset versions in a catalog
   - Pointer-based approach where metadata points to physical data
5. **Git-like approaches for data**:
   - Tools like Data Version Control (DVC)
   - lakeFS for data lake versioning

In practice, combine immutable storage patterns with metadata tracking, ensuring each dataset has clear lineage and version identifiers that can be referenced in pipeline runs.

---

## Lambda and Kappa Architectures

### Lambda Architecture

A hybrid system with three layers:

1. **Batch Layer**: Processes complete datasets periodically for accurate results
2. **Speed Layer**: Processes streaming data in real-time for low-latency views
3. **Serving Layer**: Combines batch and speed layer outputs for query serving

**Advantages:**
- Provides both accurate batch results and low-latency stream processing
- Fault tolerance through recomputation capability
- Clear separation of concerns

**Disadvantages:**
- Maintaining parallel processing pipelines (batch and streaming)
- Code duplication across layers
- Operational complexity
- Resource intensive

### Kappa Architecture

A simplified approach using a single stream processing path:

1. **Stream Processing**: All data (both real-time and historical) flows through a streaming system
2. **Serving Layer**: Query results produced by the stream processor

**Advantages:**
- Simplified maintenance (single codebase)
- Reduced operational complexity
- More consistent processing logic
- Often lower overall cost

**Disadvantages:**
- Reprocessing can be challenging
- May require more complex stream processing logic
- Limited by streaming system capabilities

**When to use which:**
- **Lambda**: When exact results are critical, when batch and stream processing needs differ significantly
- **Kappa**: When simplified operations are a priority, when streaming can handle all processing needs

Modern systems often use modified versions of these architectures, with technologies like Apache Spark allowing unified batch and streaming APIs.

---

## Columnar File Formats

Store data by column rather than by row, enabling efficient compression and query performance for analytics.

### Apache Parquet

- Columnar storage format designed for Hadoop ecosystem
- **Advantages**: Excellent compression (10-20x reduction vs raw formats), schema evolution support, predicate pushdown for efficient queries, good ecosystem integration (Spark, Hive, Presto)
- **Best for**: Data warehousing, analytics workloads, complex nested data

### Apache ORC (Optimized Row Columnar)

- Columnar format originally created for Hive
- **Advantages**: Highly efficient compression (slightly better than Parquet in some cases), built-in indexes for improved performance, ACID transaction support in Hive, strong type support
- **Best for**: Hive workloads, data requiring ACID properties

### Apache Avro

- Row-based (not columnar) data serialization format
- **Advantages**: Rich data structures with schema evolution, compact binary format, language-independent serialization, schema stored with data
- **Best for**: Data exchange between systems, streaming data, cases where read/write balance matters

**Comparison:**
- **Query Performance**: ORC and Parquet significantly outperform Avro for analytical queries
- **Write Performance**: Avro generally faster for writes, making it better for data ingestion
- **Compression**: Both ORC and Parquet offer superior compression vs. Avro
- **Schema Evolution**: All three support schema evolution, but Avro has the most robust support
- **Ecosystem**: Parquet has broadest adoption across modern data tools

In practice: Parquet for data warehousing and analytics, Avro for data ingestion and system integration, ORC when working primarily with Hive or when its indexing features are valuable.

---

## Data Mesh

A sociotechnical approach to data architecture that shifts from centralized, monolithic data platforms to a distributed, domain-oriented, self-serve data ecosystem.

**Key principles:**

1. **Domain-oriented ownership**: Data is owned by the business domains that generate it, not a central data team
2. **Data as a product**: Each domain treats its data as a product with quality, documentation, and SLAs
3. **Self-serve data infrastructure**: Platform teams provide tools and capabilities for domains to publish and consume data
4. **Federated computational governance**: Standards and policies ensure interoperability while allowing domain autonomy

**vs. Data Lake/Warehouse approach:**
- Decentralized vs. centralized ownership
- Multiple smaller repositories vs. single monolithic repository
- Domain experts as data producers vs. central data team
- Distributed governance vs. central governance

**vs. Data Lake House:**
- Focus on organizational structure vs. technical capabilities
- Domain boundaries vs. technology boundaries
- Products vs. datasets as first-class citizens

**When it's appropriate:**
- For large organizations with distinct business domains
- When domain knowledge is critical for data context
- When centralized data teams become bottlenecks
- When organization is mature enough to handle distributed ownership

---

## Data Governance

The framework of policies, processes, and standards that ensure data is accurate, consistent, secure, and properly managed throughout its lifecycle.

**Importance in data engineering:**
- Ensures regulatory compliance (GDPR, CCPA, HIPAA, etc.)
- Establishes data quality standards
- Creates clear ownership and accountability
- Enables proper data security and privacy controls
- Improves discoverability and understanding of data assets
- Reduces duplication and inconsistency across systems

**Key components:**

1. **Metadata management**: Documenting data definitions, lineage, and technical metadata
2. **Data quality management**: Establishing and monitoring data quality standards
3. **Master data management**: Ensuring consistent representation of business entities
4. **Data security and privacy**: Implementing controls for sensitive data
5. **Policy management**: Creating and enforcing data policies

**Implementation practices:**
- Establish a data governance council with cross-functional representation
- Define clear data ownership (data stewards, custodians, owners)
- Create and maintain a business glossary for common terminology
- Implement data classification based on sensitivity and importance
- Develop automated data quality monitoring
- Create clear data lifecycle policies (retention, archiving, deletion)

**Tools and technologies:**
- **Data catalogs**: Alation, Collibra, Atlan, DataHub
- **Data quality**: Great Expectations, dbt tests, Soda, Monte Carlo
- **Lineage tracking**: OpenLineage, Marquez, native cloud tools
- **Privacy and security**: Immuta, Privacera, cloud-native controls
- **Metadata management**: Apache Atlas, Amundsen, DataHub

Effective governance balances control with enablement, focusing on making high-quality data available to appropriate users while maintaining necessary protections.

---

## Data Lake Design

**Key considerations:**

1. **Storage technology selection**: Object storage (S3, Azure Blob, GCS) for scalability and cost; HDFS for on-premise solutions with high throughput needs
2. **Data organization strategy**: Directory/folder structure design, partitioning strategy, naming conventions
3. **Security and access control**: Authentication, authorization (role-based access), encryption (at-rest and in-transit), data masking
4. **Data quality and governance**: Metadata management, data catalogs, quality validation processes
5. **Scalability and performance**: Data volume projections, query performance requirements, concurrency needs

### Multi-Layer Architecture

1. **Landing zone (Bronze)**: Raw data as ingested with minimal processing; immutable storage for audit and replay; organized by source system and ingestion date
2. **Standardized zone (Silver)**: Cleansed, validated, and conformed data; common data model applied; proper data types and formats enforced; organized by business domain and entity
3. **Curated zone (Gold)**: Business-ready, aggregated datasets; optimized for specific analytical use cases; organized by business function or analytical domain
4. **Sandbox zones**: Exploration areas for data scientists; temporary storage with clear expiration policies

### Data Lifecycle Management

- **Ingestion policies**: Frequency, completeness checks
- **Retention policies**: Time-based or business rule-based
- **Archival strategy**: Moving cold data to lower-cost tiers
- **Purging process**: Compliant deletion of obsolete data
- **Version control**: Managing changes to datasets over time

Use automated tagging for metadata, implement data expiration based on classification, create clear ownership definitions, build monitoring for usage and growth, and establish a governance committee for policy decisions.
