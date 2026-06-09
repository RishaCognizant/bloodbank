# 🩸 Blood Bank Management System

A full-stack web application for managing blood donations, inventory, and requests — built with **Spring Boot 3** and **Angular 17**.

---

## Features

### Admin
- Dashboard with live statistics and charts (blood inventory bar chart, request status doughnut)
- Manage all users — activate / deactivate / delete
- Manage blood inventory across all 8 blood groups with low-stock alerts
- Approve or reject blood requests with a message to the user
- Record and complete blood donations (automatically updates inventory)
- Weekly scheduled low-stock email alert to all admins

### User
- Register and login with JWT-secured sessions
- Request blood for a patient — specify blood group, units, hospital
- Track all personal requests and their approval status
- Schedule blood donations and view donation history
- Edit personal profile (name, phone, blood group, address)

### Emails (HTML)
| Trigger | Recipient |
|---------|-----------|
| New registration | User — welcome email |
| Blood request submitted | User — confirmation with request details |
| Request approved | User — approval notice with admin message |
| Request rejected | User — rejection notice with reason |
| Donation recorded | User — thank-you with lives-saved count |
| Inventory below 10 units | All admins — low stock alert |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Java 17 |
| Security | Spring Security + JWT (jjwt 0.11) |
| Database | MySQL 8 + Spring Data JPA / Hibernate |
| Email | Spring Mail + Gmail SMTP (HTML templates) |
| Frontend | Angular 17, Angular Material 17 |
| Charts | Chart.js 4 via ng2-charts |
| Auth flow | JWT in `localStorage`, HTTP interceptor |

---

## Project Structure

```
bloodbank/
├── SETUP.md                                ← This file
│
├── bloodbank-backend/                      ← Spring Boot API (port 8080)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/bloodbank/
│       │   ├── config/          SecurityConfig, DataInitializer
│       │   ├── controller/      Auth, Admin, Inventory, Requests, Donations, User
│       │   ├── dto/             Request/Response POJOs
│       │   ├── model/           User, BloodInventory, BloodRequest, DonationRecord
│       │   ├── repository/      JPA repositories
│       │   ├── security/        JwtUtils, JwtFilter, UserDetailsServiceImpl
│       │   └── service/         Auth, Email, Inventory, Requests, Donations, Dashboard
│       └── resources/
│           └── application.properties      ← All config (DB, JWT, Mail)
│
└── bloodbank-frontend/                     ← Angular app (port 4200)
    ├── package.json
    ├── angular.json
    └── src/
        ├── environments/
        │   └── environment.ts              ← Single API URL variable
        └── app/
            ├── core/            Services, Guards, Interceptor
            ├── models/          TypeScript interfaces
            ├── shared/          MaterialModule
            └── features/
                ├── auth/        Login, Register
                ├── admin/       Dashboard, Users, Inventory, Requests, Donations
                └── user/        Dashboard, Request Blood, My Requests, Donations, Profile
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org/download |
| Node.js | 18+ | https://nodejs.org |
| Angular CLI | 17 | `npm install -g @angular/cli@17` |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/mysql |

### Verify everything is installed
```bash
java -version      # java version "17..."
mvn -version       # Apache Maven 3.8...
node -version      # v18...
npm -version       # 9...
ng version         # Angular CLI: 17...
mysql --version    # mysql  Ver 8...
```

---

## Setup

### 1 — MySQL

Start MySQL, then either let the app auto-create the database (recommended), or run manually:

```sql
CREATE DATABASE IF NOT EXISTS bloodbank_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

**Start MySQL on Windows:**
```bash
net start MySQL80
```
**Start MySQL on Mac:**
```bash
brew services start mysql
```

---

### 2 — Backend config

Open:
```
bloodbank-backend/src/main/resources/application.properties
```

Fill in every value marked below:

```properties
# ── DATABASE ──────────────────────────────────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/bloodbank_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD          # ← change

# ── JWT ───────────────────────────────────────────────────────────────────────
app.jwt.secret=ReplaceWithAnyLongRandomString32PlusChars!   # ← change
app.jwt.expiration=86400000                                  # 24 h in ms

# ── EMAIL (Gmail SMTP) ────────────────────────────────────────────────────────
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-gmail@gmail.com                # ← change
spring.mail.password=abcd efgh ijkl mnop                 # ← App Password (see below)
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=your-gmail@gmail.com                    # ← same as username

# ── APP ───────────────────────────────────────────────────────────────────────
app.frontend.url=http://localhost:4200
server.port=8080
```

| Property | What to put |
|----------|-------------|
| `spring.datasource.password` | Your MySQL password |
| `app.jwt.secret` | Any random string, **minimum 32 characters** |
| `app.jwt.expiration` | `86400000` = 24 h · `3600000` = 1 h · `604800000` = 7 days |
| `spring.mail.username` | Your Gmail address |
| `spring.mail.password` | Gmail **App Password** — 16 chars (see Section 3 below) |
| `spring.mail.from` | Same Gmail address |

---

### 3 — Gmail App Password

Your normal Gmail password does **not** work for SMTP. Generate an App Password:

1. Go to → <https://myaccount.google.com/security>
2. Enable **2-Step Verification** (required)
3. Go to → <https://myaccount.google.com/apppasswords>
4. App: `Mail` · Device: `Other` → name it `BloodBank` → click **Generate**
5. Copy the 16-character code (e.g. `abcd efgh ijkl mnop`) into `spring.mail.password`

#### Skip email for now (development)
Add this line to `application.properties` — the app runs fine without email:
```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration
```

---

### 4 — Frontend config

Install dependencies:
```bash
cd bloodbank-frontend
npm install
```

#### Change the API URL (one place only)

All Angular services read the backend URL from a **single variable**:

```
bloodbank-frontend/src/environments/environment.ts
```

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:7777/api',  // ← change only this line
};
```

For a production build, also update `src/environments/environment.prod.ts`.

---

## Running

Open **two terminals** side by side:

```bash
# ── Terminal 1 — Backend ──────────────────────────────
cd bloodbank-backend
mvn spring-boot:run
```
```
Started BloodBankApplication in X.XXX seconds
Default admin created: admin@bloodbank.com / Admin@123
Blood inventory initialized for all blood groups.
```

```bash
# ── Terminal 2 — Frontend ─────────────────────────────
cd bloodbank-frontend
ng serve
```
```
✔ Compiled successfully.
  ➜  Local:   http://localhost:4200
```

Open **http://localhost:4200** in your browser.

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@bloodbank.com` | `Admin@123` |
| User | register at `/register` | your choice |

The admin account is created automatically on first startup.

---

## API Reference

Base URL: `http://localhost:7777`

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login — returns JWT token |
| POST | `/api/auth/register` | Register new user |

### Admin only (`ROLE_ADMIN`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/{id}/toggle-status` | Activate / deactivate |
| DELETE | `/api/admin/users/{id}` | Delete user |

### Blood Inventory (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | All blood groups + units |
| GET | `/api/inventory/{bloodGroup}` | Single blood group |
| PUT | `/api/inventory/update` | Update units (Admin) |

### Blood Requests (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Submit request (User) |
| GET | `/api/requests` | All requests (Admin) |
| GET | `/api/requests/my` | My requests (User) |
| PUT | `/api/requests/{id}/action` | Approve / Reject (Admin) |
| DELETE | `/api/requests/{id}` | Delete request |

### Donations (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations/schedule` | Schedule donation (User) |
| POST | `/api/donations/admin/add` | Record donation (Admin) |
| GET | `/api/donations` | All donations (Admin) |
| GET | `/api/donations/my` | My donations (User) |
| PUT | `/api/donations/{id}/complete` | Mark complete (Admin) |
| PUT | `/api/donations/{id}/cancel` | Cancel donation |

### Profile (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get my profile |
| PUT | `/api/user/profile` | Update profile |

**All authenticated requests must include:**
```
Authorization: Bearer <jwt-token>
```

---

## Troubleshooting

### Backend

| Error | Cause | Fix |
|-------|-------|-----|
| `Access denied for user 'root'@'localhost'` | Wrong DB password | Update `spring.datasource.password` |
| `Communications link failure` | MySQL not running | `net start MySQL80` |
| `Port 7777 already in use` | Port conflict | Set a different `server.port` in `application.properties`, then update `apiUrl` in `environment.ts` to match |
| `AuthenticationFailedException` | Wrong mail password | Use Gmail App Password, not regular password |
| `Connection timed out` (mail) | Port 587 blocked | Allow port 587 outbound, or switch to port 465 with `spring.mail.properties.mail.smtp.ssl.enable=true` |

### Frontend

| Error | Cause | Fix |
|-------|-------|-----|
| `ng: command not found` | Angular CLI not installed | `npm install -g @angular/cli@17` |
| `Cannot find module 'ng2-charts'` | Dependencies missing | Run `npm install` inside `bloodbank-frontend/` |
| `CORS policy blocked` | Angular not on port 4200 | Ensure `ng serve` uses port 4200, or update `corsConfigurationSource()` in `SecurityConfig.java` |
| `Invalid email or password` | Backend not running | Check Terminal 1 — backend must show "Started BloodBankApplication" |
| `EACCES: permission denied` | npm global install | Use `sudo npm install -g @angular/cli@17` (Mac/Linux) |

---

## Pre-flight Checklist

Before your first run, confirm:

- [ ] MySQL is running
- [ ] `spring.datasource.password` is set correctly
- [ ] `app.jwt.secret` is at least 32 characters
- [ ] `spring.mail.username` and `spring.mail.password` are set (or email is disabled)
- [ ] `npm install` has been run in `bloodbank-frontend/`

---

## Quick Start (after first setup)

```bash
# Terminal 1
cd bloodbank-backend && mvn spring-boot:run

# Terminal 2
cd bloodbank-frontend && ng serve

# Browser
http://localhost:4200
```

---

*Spring Boot 3.2 · Angular 17 · MySQL 8 · JWT · Gmail SMTP*
