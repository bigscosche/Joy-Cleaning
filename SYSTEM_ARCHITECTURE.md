# Joy Cleaning — System Architecture

This document defines the data model for the Joy Cleaning business operating system. Everything you see in `admin.html` reads from this structure (via mock data today, via Supabase later).

---

## High-Level Flow

```
    Website (index.html, quote.html) ──► leads
                                           │
                                   (qualify / book)
                                           ▼
                                        clients ──► jobs ──► job_workers
                                                      │
                                                      ├──► expenses   (e.g. gas tied to a job)
                                                      └──► gas_logs   (fill-ups + miles)
```

Leads become clients. Clients get jobs. Jobs are staffed by workers. Every trip creates expenses and mileage. The admin dashboard aggregates all of it.

---

## Tables

### `leads`
Incoming quote requests from the website, phone, or referrals.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `created_at` | timestamp | When the lead came in |
| `first_name`, `last_name` | text | Contact |
| `phone`, `email` | text | Contact |
| `town` | text | Which service area |
| `service_interest` | enum (`standard`, `deep`, `move_in`, `move_out`, `recurring`, `apartment`, `office`, `post_event`) | What they're asking about |
| `frequency` | enum (`once`, `weekly`, `biweekly`, `monthly`) | How often |
| `bedrooms`, `bathrooms` | int | Home size for quoting |
| `notes` | text | Free-form details from the form |
| `status` | enum (`new`, `contacted`, `quoted`, `booked`, `lost`) | Where this lead is in the pipeline |
| `quoted_amount` | numeric | Dollar quote given (if any) |
| `source` | enum (`website`, `phone`, `referral`, `walk_in`) | Attribution |
| `converted_client_id` | uuid → `clients.id` | Non-null once they become a client |

**Lifecycle:** `new` → `contacted` → `quoted` → `booked` → (converts to client) OR → `lost`

---

### `clients`
Customers with active or past relationships.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `created_at` | timestamp | First engagement |
| `first_name`, `last_name` | text | |
| `phone`, `email` | text | |
| `address`, `town` | text | Service location |
| `preferred_frequency` | enum (`once`, `weekly`, `biweekly`, `monthly`) | Default cadence |
| `notes` | text | Preferences, access codes, pets, allergies |
| `active` | boolean | Currently an active client |

**Relationships:** A client has many `jobs`.

---

### `jobs`
Scheduled or completed cleaning visits.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `created_at` | timestamp | When booked |
| `client_id` | uuid → `clients.id` | Which client |
| `service_type` | enum | What kind of clean |
| `scheduled_date` | date | When |
| `duration_minutes` | int | Actual time spent |
| `price` | numeric | What the client pays |
| `status` | enum (`scheduled`, `in_progress`, `completed`, `paid`, `cancelled`) | Where it's at |
| `notes` | text | Job-specific details |
| `vehicle` | text | Which company vehicle went |
| `miles_driven` | int | Round-trip miles (feeds gas/tax calc) |

**Relationships:** A job has many `job_workers` (who did it).

---

### `job_workers`
Join table. Tells us who worked each job and how much they're paid.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `job_id` | uuid → `jobs.id` | Which job |
| `worker_id` | uuid → `workers.id` | Which worker |
| `hours` | decimal | Actual hours on site |
| `pay_rate` | numeric | Hourly pay for this worker on this job |
| `pay_total` | numeric | `hours × pay_rate` (stored for reporting speed) |

---

### `workers`
Cleaners + owners.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `first_name`, `last_name` | text | |
| `phone` | text | |
| `role` | enum (`owner`, `lead_cleaner`, `cleaner`) | Pay grade + permissions |
| `default_rate` | numeric | Standard hourly rate |
| `active` | boolean | Currently employed |
| `hired_date` | date | |

---

### `expenses`
Every business cost: supplies, gas, insurance, marketing, payroll, etc.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `date` | date | When it was spent |
| `category` | enum (`supplies`, `gas`, `insurance`, `marketing`, `payroll`, `other`) | For reporting |
| `description` | text | What it was |
| `amount` | numeric | Dollar cost |
| `payment_method` | enum (`business_card`, `auto_pay`, `cash`, `check`) | How paid |
| `receipt_status` | enum (`saved`, `pending`, `missing`) | For taxes |
| `related_job_id` | uuid → `jobs.id` (nullable) | If tied to a specific job |

---

### `gas_logs`
Every vehicle fill-up. Separate from `expenses` so we can also track gallons, price per gallon, and odometer.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `date` | date | |
| `vehicle` | text | (Later: fk `vehicles.id`) |
| `driver_id` | uuid → `workers.id` | Who fueled up |
| `station` | text | Where |
| `gallons` | decimal | |
| `price_per_gallon` | decimal | |
| `total_cost` | decimal | |
| `odometer` | int | For mileage tracking / IRS deduction |
| `receipt_status` | enum (`saved`, `pending`, `missing`) | |

---

## Relationships Summary

```
leads (status=booked) ──► clients ──┐
                                    │
                                    ├─► jobs ──► job_workers ──► workers
                                    │              │
                                    │              └──► gas_logs (via vehicle + date)
                                    │
                                    └─► expenses (optionally linked to a job)
```

---

## Where Each Table Drives the UI

| Admin view | Tables read |
|---|---|
| Dashboard (overview) | `jobs`, `leads`, `clients` |
| Leads | `leads` |
| Jobs | `jobs`, `clients`, `job_workers`, `workers` |
| Clients | `clients`, `jobs` (for LTV) |
| Workers | `workers`, `job_workers`, `jobs` (for month's hours) |
| Revenue | `jobs` |
| Expenses | `expenses`, `jobs` (for net profit) |
| Gas Tracker | `gas_logs`, `jobs` (for miles per job), `workers` (driver name) |

---

## Swap-to-Supabase Checklist

When you're ready to go live:

1. Create the seven tables above in Supabase (matching field types).
2. Copy a few seed rows from `js/admin-data.js` into each table to sanity-check.
3. In `js/admin.js`, replace each `dataSource` method:
   ```js
   async getLeads() {
     const { data } = await supabase.from('leads').select('*');
     return data;
   }
   ```
4. Delete `js/admin-data.js` (optional) — nothing else references it.
5. Wire up the hook points (`onNewLead`, `onJobCompleted`, `onExpenseAdded`) to real automations.

No renderers, no HTML, no CSS needs to change.
