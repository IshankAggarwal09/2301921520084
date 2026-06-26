# Notification System Design
# Stage 1

# Notification System Design

## Overview

The Notification Service is responsible for delivering notifications to authenticated users. It supports fetching notifications, marking them as read/unread, deleting notifications, retrieving unread counts, and receiving real-time notifications.

**Base URL**

```
/api/v1
```

---

# Notification Object

```json
{
  "id": "notif_12345",
  "userId": "user_1001",
  "title": "New Message",
  "message": "John sent you a message.",
  "type": "MESSAGE",
  "priority": "MEDIUM",
  "isRead": false,
  "createdAt": "2026-06-26T08:30:00Z",
  "updatedAt": "2026-06-26T08:30:00Z",
  "metadata": {
    "senderId": "user_2002",
    "conversationId": "conv_500"
  }
}
```

---

# Supported Notification Types

- MESSAGE
- SYSTEM
- ALERT
- ORDER
- PAYMENT
- PROMOTION
- REMINDER
- SOCIAL

---

# Core REST APIs

## 1. Get All Notifications

### Endpoint

```
GET /notifications
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Default 1 |
| limit | integer | Default 20 |
| isRead | boolean | Optional |
| type | string | Optional |
| sort | string | asc / desc |

### Response

```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 56,
  "notifications": [
    {
      "id": "notif_123",
      "title": "Order Delivered",
      "message": "Your order has been delivered.",
      "type": "ORDER",
      "priority": "HIGH",
      "isRead": false,
      "createdAt": "2026-06-26T10:30:00Z"
    }
  ]
}
```

---

## 2. Get Notification By ID

### Endpoint

```
GET /notifications/{notificationId}
```

### Response

```json
{
  "success": true,
  "notification": {
    "id": "notif_123",
    "title": "New Message",
    "message": "John sent a message.",
    "type": "MESSAGE",
    "priority": "MEDIUM",
    "isRead": false,
    "createdAt": "2026-06-26T10:20:00Z"
  }
}
```

---

## 3. Create Notification

> Used internally by backend services.

### Endpoint

```
POST /notifications
```

### Request

```json
{
  "userId": "user_1001",
  "title": "Payment Successful",
  "message": "₹1200 payment completed.",
  "type": "PAYMENT",
  "priority": "HIGH",
  "metadata": {
    "paymentId": "pay_123"
  }
}
```

### Response

```json
{
  "success": true,
  "message": "Notification created successfully.",
  "notificationId": "notif_789"
}
```

---

## 4. Mark Notification as Read

### Endpoint

```
PATCH /notifications/{notificationId}/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## 5. Mark Notification as Unread

### Endpoint

```
PATCH /notifications/{notificationId}/unread
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as unread."
}
```

---

## 6. Mark All Notifications as Read

### Endpoint

```
PATCH /notifications/read-all
```

### Response

```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

## 7. Delete Notification

### Endpoint

```
DELETE /notifications/{notificationId}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted."
}
```

---

## 8. Delete All Notifications

### Endpoint

```
DELETE /notifications
```

### Response

```json
{
  "success": true,
  "message": "All notifications deleted."
}
```

---

## 9. Get Unread Notification Count

### Endpoint

```
GET /notifications/unread/count
```

### Response

```json
{
  "success": true,
  "unreadCount": 12
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Notification not found."
  }
}
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted Successfully |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# Real-Time Notification Mechanism

## Technology

Use **WebSockets (Socket.IO)** for real-time notification delivery.

---

## Connection

```
ws://server.com/notifications
```

Client connects after login using JWT authentication.

---

## Events

### Client → Server

#### Authenticate

```json
{
  "event": "authenticate",
  "token": "<JWT_TOKEN>"
}
```

---

### Server → Client

#### New Notification

```json
{
  "event": "notification",
  "data": {
    "id": "notif_789",
    "title": "Friend Request",
    "message": "Alice sent you a friend request.",
    "type": "SOCIAL",
    "priority": "LOW",
    "createdAt": "2026-06-26T12:30:00Z"
  }
}
```

---

#### Notification Updated

```json
{
  "event": "notification_updated",
  "notificationId": "notif_123",
  "isRead": true
}
```

---

#### Notification Deleted

```json
{
  "event": "notification_deleted",
  "notificationId": "notif_456"
}
```

---

#### Unread Count Updated

```json
{
  "event": "unread_count",
  "count": 5
}
```

---

# API Naming Conventions

- Use plural resource names.
- Use HTTP methods according to REST standards.
- Use PATCH for partial updates.
- Use DELETE for deletions.
- Use nouns instead of verbs in endpoints.
- Use camelCase for JSON fields.
- Use ISO 8601 format for timestamps.

---

# Authentication

Every request must include:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Summary of Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /notifications | List notifications |
| GET | /notifications/{id} | Get notification |
| POST | /notifications | Create notification |
| PATCH | /notifications/{id}/read | Mark as read |
| PATCH | /notifications/{id}/unread | Mark as unread |
| PATCH | /notifications/read-all | Mark all as read |
| DELETE | /notifications/{id} | Delete notification |
| DELETE | /notifications | Delete all notifications |
| GET | /notifications/unread/count | Unread count |
| WebSocket | /notifications | Real-time notifications |


# Stage 2

# Persistent Storage Design

## Recommended Database

I recommend **MongoDB (NoSQL)** as the primary database.

### Why MongoDB?

Notifications are semi-structured and can have different metadata depending on their type (payment, message, reminder, order, etc.). MongoDB provides:

- Flexible schema for different notification types
- High write throughput
- Horizontal scaling using sharding
- Fast document retrieval
- Easy storage of nested metadata
- Good support for indexing
- Native TTL indexes for automatic expiration (if required)

Since notifications are mostly **write-heavy** and **read by user**, MongoDB is a suitable choice.

---

# Collection Schema

## notifications

```json
{
  "_id": ObjectId,

  "notificationId": "notif_12345",

  "userId": "user_1001",

  "title": "Payment Successful",

  "message": "₹1200 payment completed.",

  "type": "PAYMENT",

  "priority": "HIGH",

  "isRead": false,

  "metadata": {
      "paymentId": "pay_123",
      "orderId": "ord_456"
  },

  "createdAt": ISODate(),

  "updatedAt": ISODate()
}
```

---

# Indexes

### Primary Index

```
notificationId
```

---

### Secondary Indexes

```
userId
```

Used for fetching user notifications.

---

```
userId + createdAt
```

Used for paginated notification listing.

---

```
userId + isRead
```

Used for unread notifications and unread count.

---

```
createdAt
```

Used for cleanup jobs or notification expiration.

---

# Data Flow

```
Backend Service
        │
        ▼
Notification Service
        │
        ▼
MongoDB
        │
        ▼
WebSocket Server
        │
        ▼
Connected User
```

---

# Sample MongoDB Queries

## 1. Create Notification

```javascript
db.notifications.insertOne({
    notificationId: "notif_101",
    userId: "user_1",
    title: "Order Delivered",
    message: "Your order has been delivered.",
    type: "ORDER",
    priority: "HIGH",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
});
```

---

## 2. Get User Notifications

```javascript
db.notifications.find(
    { userId: "user_1" }
)
.sort({ createdAt: -1 })
.limit(20);
```

---

## 3. Get Unread Notifications

```javascript
db.notifications.find({
    userId: "user_1",
    isRead: false
});
```

---

## 4. Get Unread Count

```javascript
db.notifications.countDocuments({
    userId: "user_1",
    isRead: false
});
```

---

## 5. Mark Notification as Read

```javascript
db.notifications.updateOne(
{
    notificationId: "notif_101"
},
{
    $set: {
        isRead: true,
        updatedAt: new Date()
    }
});
```

---

## 6. Mark All Notifications as Read

```javascript
db.notifications.updateMany(
{
    userId: "user_1",
    isRead: false
},
{
    $set: {
        isRead: true,
        updatedAt: new Date()
    }
});
```

---

## 7. Delete Notification

```javascript
db.notifications.deleteOne({
    notificationId: "notif_101"
});
```

---

## 8. Delete All Notifications

```javascript
db.notifications.deleteMany({
    userId: "user_1"
});
```

---

# Scalability Challenges

## 1. Large Number of Notifications

### Problem

Millions of notifications can slow down queries.

### Solution

- Pagination
- Indexes
- Fetch latest notifications only
- Archive old notifications

---

## 2. High Write Traffic

### Problem

Thousands of notifications may be created every second.

### Solution

- Horizontal sharding
- Load balancing
- Asynchronous processing using a message queue (Kafka/RabbitMQ)

---

## 3. Slow Read Performance

### Problem

Unread count and notification history become slower.

### Solution

- Compound indexes
- Cache unread counts using Redis
- Optimize frequently used queries

---

## 4. Storage Growth

### Problem

Database size increases continuously.

### Solution

- TTL indexes for temporary notifications
- Archive old notifications to cold storage
- Scheduled cleanup jobs

---

## 5. Real-Time Delivery

### Problem

Maintaining WebSocket connections for thousands of users.

### Solution

- Multiple WebSocket servers behind a load balancer
- Redis Pub/Sub for message broadcasting
- Sticky sessions or centralized session management

---

# Future Improvements

- Redis caching for frequently accessed notifications
- Kafka/RabbitMQ for asynchronous event processing
- Push notification integration (FCM/APNs)
- Email and SMS notification channels
- Notification preferences (mute, priority, categories)
- Scheduled notifications
- Notification batching to reduce network traffic
- Delivery status tracking (Sent, Delivered, Read)

---

# Why MongoDB Over SQL?

| Feature | MongoDB | SQL |
|----------|----------|-----|
| Flexible Schema | ✅ | ❌ |
| Nested Metadata | ✅ | Limited |
| Horizontal Scaling | ✅ Easy | More Complex |
| Write Performance | High | Moderate |
| JSON Support | Native | Limited |
| Notification Use Case | Excellent | Good |

---

# Conclusion

MongoDB is well suited for a notification system due to its flexible document model, high write throughput, and scalability. By combining proper indexing, pagination, sharding, Redis caching, and asynchronous processing with Kafka/RabbitMQ, the system can efficiently handle millions of notifications while providing low-latency reads and real-time delivery.

# Stage 3

# Query Optimization and Performance Analysis

## Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

# Is the Query Accurate?

Yes. The query correctly fetches all unread notifications for student `1042` and sorts them by creation time in ascending order.

However, while functionally correct, it is **not optimized** for a large-scale database.

Current Database Size:

- Students: **50,000**
- Notifications: **5,000,000**

---

# Why is the Query Slow?

If no suitable index exists, the database performs a **Full Table Scan**.

### Steps Performed

1. Scan all 5,000,000 rows.
2. Check `studentID`.
3. Check `isRead`.
4. Sort matching rows using `createdAt`.

The sorting operation becomes expensive when many rows satisfy the condition.

---

# Time Complexity

Without indexes:

```
Filtering : O(N)

Sorting : O(K log K)

Total : O(N + K log K)
```

Where:

- **N** = Total notifications (5,000,000)
- **K** = Matching unread notifications

---

# Optimized Solution

Create a **Composite Index**.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

### Why This Index?

The query filters by:

- studentID
- isRead

and sorts by:

- createdAt

The database can use the index directly without performing an additional sort.

---

# Optimized Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

No change is required in the SQL query itself because the optimizer will automatically use the composite index.

---

# Expected Complexity

With the composite index:

```
Index Lookup : O(log N)

Fetch Results : O(K)

Total : O(log N + K)
```

This is significantly faster than scanning the entire table.

---

# Should We Add Indexes on Every Column?

**No.**

Adding indexes to every column is not a good practice.

### Reasons

1. Increased Storage

Every index occupies additional disk space.

2. Slower INSERT Operations

Whenever a new notification is inserted, every index must also be updated.

3. Slower UPDATE Operations

Updating indexed columns requires updating all corresponding indexes.

4. Slower DELETE Operations

Indexes must be maintained when rows are deleted.

5. Low Selectivity Columns

Columns like `isRead` have very few distinct values (`true` or `false`), making standalone indexes on them ineffective.

Indexes should only be created for columns that are frequently used in filtering, sorting, joining, or searching.

---

# Recommended Indexes

```sql
CREATE INDEX idx_student
ON notifications(studentID);
```

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

```sql
CREATE INDEX idx_notification_type
ON notifications(notificationType);
```

These indexes cover the most common query patterns efficiently.

---

# Query: Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

For PostgreSQL:

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= CURRENT_TIMESTAMP - INTERVAL '7 days';
```

---

# Index for the Above Query

```sql
CREATE INDEX idx_type_created_student
ON notifications(notificationType, createdAt, studentID);
```

This index allows the database to:

1. Filter by notification type.
2. Filter by recent dates.
3. Retrieve student IDs efficiently.
4. Reduce disk I/O and avoid unnecessary table scans.

---

# Additional Performance Improvements

## 1. Pagination

Instead of loading all notifications:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;
```

This reduces response time and memory usage.

---

## 2. Select Required Columns Only

Instead of:

```sql
SELECT *
```

Use:

```sql
SELECT notificationID,
       title,
       message,
       createdAt,
       isRead
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

Fetching only necessary columns minimizes I/O and network transfer.

---

## 3. Archive Old Notifications

Move notifications older than a defined retention period (e.g., one year) to an archive table to keep the active table smaller and improve query performance.

---

## 4. Partition Large Tables

Partition the table by `createdAt` (monthly or yearly) so queries scanning recent notifications only access relevant partitions.

---

## 5. Cache Frequently Requested Data

Use Redis to cache:

- Unread notification count
- Latest notifications

This reduces repeated database reads.

---

# Final Recommendation

The original query is logically correct but inefficient at scale because it can trigger a full table scan and sorting. A **composite index on `(studentID, isRead, createdAt)`** enables efficient filtering and ordering, reducing the complexity from **O(N + K log K)** to approximately **O(log N + K)**. Rather than indexing every column, indexes should be created based on actual query patterns to balance read performance, write performance, and storage usage. Additional optimizations such as pagination, selecting only required columns, table partitioning, archiving old data, and Redis caching will ensure the notification system remains performant as the dataset continues to grow.

# Stage 4

# Improving Notification Fetch Performance

## Problem Statement

Currently, the frontend fetches all notifications from the database every time a student loads any page.

This leads to:

- A large number of repeated database queries.
- Increased response time.
- High database CPU and I/O utilization.
- Poor user experience due to slower page loads.
- Reduced scalability as the number of users grows.

Instead of querying the database on every page load, multiple optimization techniques should be combined.

---

# Proposed Solutions

## 1. Redis Caching (Recommended)

### Approach

Store recently fetched notifications and unread counts in Redis.

Flow:

```
User Request
      │
      ▼
Check Redis Cache
      │
 ┌────┴────┐
 │         │
Hit       Miss
 │         │
 ▼         ▼
Return   Query Database
Data         │
             ▼
      Store in Redis
             │
             ▼
         Return Data
```

### Benefits

- Extremely fast response times (milliseconds).
- Reduces database load significantly.
- Handles repeated requests efficiently.

### Trade-offs

**Pros**

- Very low latency.
- Reduced database traffic.
- Easy to scale.

**Cons**

- Additional infrastructure.
- Cached data may become temporarily stale.
- Cache invalidation logic is required when notifications are updated.

---

## 2. Lazy Loading with Pagination

Instead of fetching every notification, fetch only the first page.

Example:

```
GET /notifications?page=1&limit=20
```

Load more notifications only when the user scrolls.

### Benefits

- Smaller payloads.
- Faster initial page load.
- Lower memory usage.
- Fewer database reads.

### Trade-offs

**Pros**

- Better user experience.
- Lower network usage.
- Simple implementation.

**Cons**

- Additional API requests when loading more data.

---

## 3. Fetch Only Unread Count Initially

Most users only need to know whether they have new notifications.

Example API:

```
GET /notifications/unread/count
```

The full notification list should only be requested when the notification panel is opened.

### Benefits

- Minimal database work.
- Smaller API responses.
- Faster page rendering.

### Trade-offs

**Pros**

- Very efficient.
- Greatly reduces unnecessary queries.

**Cons**

- Requires an additional request when the user opens the notification panel.

---

## 4. Real-Time Notifications (WebSockets)

After login, establish a WebSocket connection.

```
Client
    │
    ▼
WebSocket Server
    │
    ▼
Notification Service
```

Instead of polling the server, new notifications are pushed to the client immediately.

### Benefits

- No repeated polling.
- Instant notification delivery.
- Reduced API traffic.

### Trade-offs

**Pros**

- Excellent user experience.
- Lower network overhead.
- Real-time updates.

**Cons**

- More complex infrastructure.
- Persistent connections consume server resources.
- Requires handling reconnections.

---

## 5. Background Synchronization

When the application loads:

1. Load cached notifications.
2. Display them immediately.
3. Fetch the latest notifications in the background.
4. Update the UI only if new notifications are available.

### Benefits

- Faster perceived loading.
- Users see content instantly.
- Better responsiveness.

### Trade-offs

**Pros**

- Smooth user experience.
- Lower perceived latency.

**Cons**

- Slightly more complex frontend logic.
- Temporary display of stale data until synchronization completes.

---

## 6. Database Optimization

Ensure efficient indexing for common queries.

Recommended composite index:

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

Additional improvements:

- Archive old notifications.
- Partition large tables by date.
- Optimize frequently used queries.
- Retrieve only required columns instead of `SELECT *`.

### Trade-offs

**Pros**

- Faster database queries.
- Better scalability.

**Cons**

- Increased storage for indexes.
- Slight overhead during inserts and updates.

---

## Recommended End-to-End Architecture

```
                    +----------------+
                    |     Client     |
                    +----------------+
                            │
                            ▼
                     Notification API
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
          ▼                                   ▼
      Redis Cache                     WebSocket Server
          │                                   │
          ▼                                   ▼
                   Notification Service
                            │
                            ▼
                      SQL Database
```

### Request Flow

1. User loads the application.
2. API checks Redis.
3. If data exists, return cached notifications.
4. If not, fetch from the database, cache the result, and return it.
5. New notifications are delivered instantly through WebSockets.
6. Only fetch additional notifications when the user opens the notification panel or scrolls.

---

# Comparison of Strategies

| Strategy | Performance | Complexity | Best Use Case |
|----------|-------------|------------|---------------|
| Redis Cache | Very High | Medium | Frequently accessed notifications |
| Pagination | High | Low | Large notification history |
| Unread Count API | Very High | Low | Initial page load |
| WebSockets | Very High | High | Real-time notification delivery |
| Background Sync | High | Medium | Better user experience |
| Database Indexing | High | Low | Faster query execution |

---

# Final Recommendation

The best solution is to combine multiple strategies rather than relying on a single optimization:

1. **Redis Cache** to serve frequently accessed notifications and unread counts with minimal latency.
2. **Pagination/Lazy Loading** so only a small set of notifications is fetched initially.
3. **Unread Count API** on page load instead of fetching the complete notification list.
4. **WebSockets** to push new notifications in real time, eliminating continuous polling.
5. **Proper Database Indexing** to optimize query execution.
6. **Background Synchronization** to keep the UI responsive while refreshing data.

This hybrid architecture minimizes database load, reduces response times, scales efficiently to millions of notifications, and provides a smooth real-time user experience.

# Stage 5

# Reliable and Scalable "Notify All" System Design

## Existing Implementation

```python
function notify_all(student_ids, message):

    for student_id in student_ids:

        send_email(student_id, message)

        save_to_db(student_id, message)

        push_to_app(student_id, message)
```

---

# Shortcomings of the Existing Implementation

The above implementation works for a small number of users but does not scale for **50,000 students**.

### 1. Sequential Processing

Each student is processed one after another.

- Email API call
- Database insert
- Push notification

Only after one student completes does the next begin.

This leads to very high execution time.

---

### 2. Single Point of Failure

If `send_email()` fails for one student, the remaining students are never processed.

Example:

```
Student 1 ✔
Student 2 ✔
...
Student 200 ✔
Student 201 ❌ Email API Failure

Students 202–50000 never receive notifications.
```

---

### 3. No Retry Mechanism

Temporary failures such as:

- Network timeout
- Email provider downtime
- Database timeout

result in permanent notification loss.

---

### 4. Tight Coupling

The email, database, and push notification operations are tightly coupled.

A failure in one step blocks all subsequent steps.

---

### 5. Slow Response to HR

The HR user must wait until all 50,000 notifications are processed.

This may take several minutes.

---

### 6. Poor Scalability

The application server performs all work itself.

As the number of students increases, execution time increases linearly.

---

# Should Database Save and Email Sending Happen Together?

**No.**

The database is the **source of truth** and should be updated first.

Email delivery depends on external services that may fail or be delayed.

Saving to the database and sending emails should be independent operations.

### Why?

Suppose:

```
Email succeeds

Database insert fails
```

The student receives an email, but the notification is missing from the application.

Now consider:

```
Database insert succeeds

Email fails
```

The notification is still available in the app and the email can be retried later.

This approach guarantees data consistency and improves reliability.

---

# Recommended Architecture

```
                 HR clicks "Notify All"
                          │
                          ▼
                 Notification API
                          │
                          ▼
                Save Notifications to DB
                          │
                          ▼
                  Publish Event to Queue
                  (Kafka / RabbitMQ)
                          │
        ┌─────────────────┴──────────────────┐
        ▼                                    ▼
 Email Worker                         Push Worker
        │                                    │
        ▼                                    ▼
 Email Provider                     WebSocket Server
```

---

# Processing Flow

1. HR submits the notification.
2. Notification records are stored in the database.
3. A notification event is published to a message queue.
4. Multiple worker services consume the queue.
5. Email workers send emails.
6. Push workers send in-app notifications.
7. Failed jobs are retried automatically.
8. Successful jobs are acknowledged and removed from the queue.

---

# Why Use a Message Queue?

A message broker such as **Kafka** or **RabbitMQ** enables asynchronous processing.

### Benefits

- Decouples services.
- Prevents API blocking.
- Supports retries.
- Enables horizontal scaling.
- Improves fault tolerance.

---

# Retry Strategy

If an email fails:

```
Retry 1 → after 30 seconds

Retry 2 → after 2 minutes

Retry 3 → after 10 minutes

Move to Dead Letter Queue (DLQ)
```

The failed notification can later be inspected and retried manually if needed.

---

# Revised Pseudocode

```python
function notify_all(student_ids, message):

    batch = []

    for student_id in student_ids:

        notification = {
            "studentId": student_id,
            "message": message,
            "status": "PENDING",
            "createdAt": now()
        }

        batch.append(notification)

    # Save all notifications in one database operation
    db.insert_many(batch)

    # Publish jobs to the message queue
    for notification in batch:
        queue.publish(notification)

    return {
        "status": "SUCCESS",
        "message": "Notification request accepted."
    }
```

---

## Email Worker

```python
while True:

    job = queue.consume()

    try:

        send_email(job.studentId, job.message)

        db.update_status(job.studentId, "EMAIL_SENT")

        queue.ack(job)

    except Exception:

        queue.retry(job)
```

---

## Push Notification Worker

```python
while True:

    job = queue.consume()

    try:

        websocket.send(job.studentId, job.message)

        db.update_status(job.studentId, "PUSH_SENT")

        queue.ack(job)

    except Exception:

        queue.retry(job)
```

---

# Additional Optimizations

## Batch Database Inserts

Instead of:

```text
50,000 INSERT statements
```

Use:

```text
1 bulk INSERT (or multiple batches of 500–1000 records)
```

This significantly reduces database overhead.

---

## Parallel Worker Instances

Deploy multiple worker processes.

Example:

```
Queue

 ├── Worker 1
 ├── Worker 2
 ├── Worker 3
 ├── Worker 4
 └── Worker 5
```

Jobs are processed concurrently, greatly improving throughput.

---

## Rate Limiting

Most email providers impose sending limits.

Workers should send emails at a controlled rate to avoid throttling.

---

## Delivery Status Tracking

Each notification should have a status field:

```
PENDING

EMAIL_SENT

PUSH_SENT

FAILED

RETRYING
```

This allows monitoring, retries, and reporting.

---

# Comparison

| Existing Design | Improved Design |
|-----------------|-----------------|
| Sequential processing | Parallel workers |
| Synchronous | Asynchronous |
| One failure stops processing | Failures isolated and retried |
| No retries | Automatic retries with DLQ |
| Slow API response | Immediate acknowledgement |
| One DB insert per user | Bulk inserts |
| Difficult to scale | Horizontally scalable |
| No delivery tracking | Status tracking |

---

# Final Recommendation

The original implementation is simple but unsuitable for notifying **50,000 students** because it is sequential, tightly coupled, and vulnerable to failures. A production-ready design should:

1. Persist notifications in the database first (system of record).
2. Publish notification jobs to a message queue (Kafka/RabbitMQ).
3. Process email and in-app notifications asynchronously using independent worker services.
4. Use bulk database inserts, retries with exponential backoff, dead-letter queues, and delivery status tracking.
5. Scale horizontally by adding more workers as demand increases.

This architecture is reliable, fault-tolerant, and capable of handling large notification campaigns efficiently while providing a fast response to the HR user.