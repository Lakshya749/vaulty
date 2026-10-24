# CHAPTER 6: DATABASE MANAGEMENT

### 6.1 Introduction
A reliable database layer is critical for any financial management system. Vaulty utilizes a relational database architecture hosted on **PostgreSQL** (managed via Supabase). The schema enforces relational integrity, data type constraints, and strict cryptographic data isolation across multi-user environments.

---

### 6.2 Database Design & Schema Architecture
The database schema consists of five core relational entities structured to prevent data redundancy and optimize query performance:

```
+--------------------+            +------------------------+
|      PROFILES      |            |       CATEGORIES       |
+--------------------+            +------------------------+
| id (UUID, PK)      |<---+       | id (UUID, PK)          |<---+
| email (text)       |    |       | name (text, unique)    |    |
| name (text)        |    |       | color_code (text)      |    |
| currency_pref      |    |       | is_default (bool)      |    |
| default_reminder   |    |       +------------------------+    |
| role (text)        |    |                   ^                 |
| created_at         |    |                   | 1:N             |
+--------------------+    |                   |                 |
          |               |       +------------------------+    |
          | 1:N           +-------|     SUBSCRIPTIONS      |----+
          |                       +------------------------+
          |                       | id (UUID, PK)          |
          |                       | user_id (UUID, FK)     |
          |                       | category_id (UUID, FK) |
          |                       | service_name (text)    |
          |                       | cost (numeric 10,2)    |
          |                       | currency (text)        |
          |                       | billing_cycle (text)   |
          |                       | next_billing_date      |
          |                       | status (text)          |
          |                       | is_free_trial (bool)   |
          |                       | trial_end_date         |
          |                       | reminder_days (int)    |
          |                       | cancel_url (text)      |
          |                       | last_used_at           |
          |                       +------------------------+
          |                                   |
          +-------------------+               | 1:N
          | 1:N               | 1:N           |
          v                   v               v
+--------------------+  +--------------------+  +--------------------+
|       ALERTS       |  |   PRICE_HISTORY    |  |    AUDIT_LOGS      |
+--------------------+  +--------------------+  +--------------------+
| id (UUID, PK)      |  | id (UUID, PK)      |  | id (UUID, PK)      |
| sub_id (UUID, FK)  |  | sub_id (UUID, FK)  |  | user_id (UUID, FK) |
| user_id (UUID, FK) |  | cost (numeric)     |  | action (text)      |
| type (text)        |  | effective_date     |  | timestamp          |
| message (text)     |  +--------------------+  +--------------------+
| is_read (bool)     |
+--------------------+
```
<div align="center"><b>Figure 6.1: Entity-Relationship (ER) Diagram of the Database</b></div>

<div align="center">24</div>

<br><hr><br>

### 6.3 Subscription & Alert Records Management
Each table is defined with precise check constraints and foreign key relationships:

1. **`profiles`:** Extends Supabase `auth.users`. Stores user display names, preferred reporting currency (default `INR`), and reminder intervals.
2. **`categories`:** Contains normalized category definitions (*Streaming*, *Gym/Health*, *Cloud*, *Gaming*, *AI Tools*, *Work*, *Utilities*, *Other*) with dedicated hexadecimal color codes.
3. **`subscriptions`:** The central operational entity. Stores plan financial attributes with constraints ensuring `cost >= 0`, `billing_cycle IN ('weekly','monthly','quarterly','yearly')`, and `status IN ('active','paused','cancelled')`.
4. **`price_history`:** Maintains temporal pricing records, allowing the application to track price hikes across successive billing cycles.
5. **`alerts`:** Stores deduplicated, actionable notifications tagged with specific alert types (`trial`, `renewal`, `zombie`, `price_hike`).

---

### 6.4 Database Operations (CRUD & Triggers)
Automated database functions and triggers reduce application complexity:

* **Automatic Profile Creation Trigger:**
  ```sql
  create function handle_new_user() returns trigger as $$
  begin
    insert into profiles (id, email, name)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
    return new;
  end; $$ language plpgsql security definer;

  create trigger on_auth_user_created after insert on auth.users
    for each row execute procedure handle_new_user();
  ```
* **Cascading Deletions:** Deleting a user profile automatically purges all associated subscriptions, price histories, and alerts via `ON DELETE CASCADE`.

---

### 6.5 Advantages of Database Integration with Row Level Security
Traditional web applications often rely exclusively on backend application logic to enforce data permissions, making them vulnerable to query injection or broken object-level authorization.

Vaulty integrates PostgreSQL **Row Level Security (RLS)** at the database kernel level:
```sql
alter table subscriptions enable row level security;

create policy "Users can only access own subscriptions"
  on subscriptions for all
  using (auth.uid() = user_id);
```
Under this architecture, even if an unauthorized API call attempts to query or alter another user’s record, PostgreSQL rejects the transaction at the database engine level. This guarantees complete confidentiality of personal financial records.

<div align="center">25</div>
