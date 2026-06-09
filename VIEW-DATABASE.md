# How to Seed Test Data & View the Database

---

## Step 1 — Seed Test Data

Open `bloodbank-backend/src/main/resources/application.properties` and change one line:

```properties
# Change false → true
app.seed-test-data=true
```

Start (or restart) the backend:
```bash
cd bloodbank-backend
mvn spring-boot:run
```

You will see this in the terminal:
```
>>> Seeding test data...
  Created user: ravi@test.com
  Created user: priya@test.com
  ...
  Inventory A+ → 45 units
  ...
>>> Test data seeded. All user passwords: Test@123
```

**After seeding, set it back to false** so data is not duplicated on next restart:
```properties
app.seed-test-data=false
```

---

## What Gets Seeded

### Users (password for all: `Test@123`)

| Name | Email | Blood Group | City | Status |
|------|-------|-------------|------|--------|
| Ravi Kumar | ravi@test.com | A+ | Chennai | Active |
| Priya Sharma | priya@test.com | B+ | Mumbai | Active |
| Anita Singh | anita@test.com | O+ | Delhi | Active |
| Mohammed Ali | mohammed@test.com | AB+ | Bangalore | Active |
| Sunita Patel | sunita@test.com | A- | Hyderabad | Active |
| Karthik Nair | karthik@test.com | O- | Kochi | **Inactive** |
| Admin | admin@bloodbank.com | O+ | HQ | Active |

### Blood Inventory

| Group | Units | Level |
|-------|-------|-------|
| A+ | 45 | ✅ Good |
| A- | 8 | ⚠️ Low |
| B+ | 32 | ✅ Good |
| B- | 5 | ⚠️ Low |
| AB+ | 18 | ✅ Good |
| AB- | 3 | ⚠️ Low |
| O+ | 60 | ✅ Good |
| O- | 7 | ⚠️ Low |

### Blood Requests

| User | Patient | Blood | Units | Status |
|------|---------|-------|-------|--------|
| Ravi | Ravi Kumar | A+ | 2 | ✅ APPROVED |
| Priya | Rajesh Sharma | B+ | 3 | 🕐 PENDING |
| Anita | Anita Singh | A+ | 1 | ❌ REJECTED |
| Mohammed | Fatima Ali | AB+ | 2 | 🕐 PENDING |
| Sunita | Deepak Patel | O+ | 4 | ✅ APPROVED |

### Donation Records

| User | Blood Group | Date | Status |
|------|-------------|------|--------|
| Ravi | A+ | 60 days ago | ✅ COMPLETED |
| Priya | B+ | 30 days ago | ✅ COMPLETED |
| Mohammed | AB+ | 10 days ago | ✅ COMPLETED |
| Sunita | A- | 5 days ahead | 📅 SCHEDULED |
| Anita | O+ | 2 days ahead | 📅 SCHEDULED |

---

## Step 2 — View the Database

You have three options. Pick whichever you prefer.

---

### Option A — MySQL Workbench (Visual, Recommended)

1. Open **MySQL Workbench**
2. Click your local connection (e.g. `Local instance MySQL80`)
3. Enter your root password
4. In the left panel under **Schemas**, expand `bloodbank_db`
5. Expand **Tables** — you'll see: `users`, `blood_inventory`, `blood_requests`, `donation_records`
6. Right-click any table → **Select Rows – Limit 1000**

---

### Option B — Command Line (MySQL CLI)

Open a new terminal (PowerShell or CMD):

```bash
mysql -u root -p
```
Enter your password when prompted, then:

```sql
-- Switch to the database
USE bloodbank_db;

-- List all tables
SHOW TABLES;

-- View all users (no passwords shown)
SELECT id, first_name, last_name, email, blood_group, city, role, active
FROM users;

-- View blood inventory
SELECT blood_group, units, last_updated FROM blood_inventory ORDER BY blood_group;

-- View blood requests
SELECT br.id, u.email, br.patient_name, br.blood_group, br.units, br.status, br.request_date
FROM blood_requests br
JOIN users u ON br.user_id = u.id
ORDER BY br.request_date DESC;

-- View donations
SELECT dr.id, u.email, dr.blood_group, dr.units, dr.donation_date, dr.status
FROM donation_records dr
JOIN users u ON dr.user_id = u.id
ORDER BY dr.donation_date DESC;

-- Count summary
SELECT
  (SELECT COUNT(*) FROM users WHERE role = 'USER')        AS total_users,
  (SELECT COUNT(*) FROM blood_requests)                   AS total_requests,
  (SELECT COUNT(*) FROM blood_requests WHERE status = 'PENDING')   AS pending,
  (SELECT COUNT(*) FROM blood_requests WHERE status = 'APPROVED')  AS approved,
  (SELECT COUNT(*) FROM donation_records)                 AS total_donations;
```

---

### Option C — IntelliJ IDEA Database Tool

1. Open the project in IntelliJ IDEA
2. Click **Database** tab on the right side panel
3. Click **+** → **Data Source** → **MySQL**
4. Fill in:
   - Host: `localhost`
   - Port: `3306`
   - Database: `bloodbank_db`
   - User: `root`
   - Password: your MySQL password
5. Click **Test Connection** → **OK**
6. Expand the schema in the tree → double-click any table to open it as a spreadsheet

---

### Option D — DBeaver (Free, works with any DB)

Download: https://dbeaver.io/download

1. Open DBeaver → **New Database Connection** → choose **MySQL**
2. Host: `localhost` · Port: `3306` · Database: `bloodbank_db`
3. Username: `root` · Password: your password
4. Click **Test Connection** → **Finish**
5. Expand the connection tree → right-click a table → **View Data**

---

## Useful SQL Queries

```sql
-- Check if a specific user exists
SELECT * FROM users WHERE email = 'ravi@test.com';

-- See which blood groups are low (under 10 units)
SELECT blood_group, units FROM blood_inventory WHERE units < 10;

-- All pending requests with requester info
SELECT u.first_name, u.last_name, br.blood_group, br.units, br.hospital
FROM blood_requests br
JOIN users u ON br.user_id = u.id
WHERE br.status = 'PENDING';

-- Total units donated per blood group
SELECT blood_group, SUM(units) AS total_donated
FROM donation_records
WHERE status = 'COMPLETED'
GROUP BY blood_group;

-- Reset all test data (CAUTION — deletes everything)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE donation_records;
TRUNCATE TABLE blood_requests;
DELETE FROM users WHERE email != 'admin@bloodbank.com';
SET FOREIGN_KEY_CHECKS = 1;
```

---

## Login to the App

After seeding, log in at **http://localhost:4200**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bloodbank.com | Admin@123 |
| User | ravi@test.com | Test@123 |
| User | priya@test.com | Test@123 |
| User | anita@test.com | Test@123 |
| User | mohammed@test.com | Test@123 |
| User | sunita@test.com | Test@123 |
