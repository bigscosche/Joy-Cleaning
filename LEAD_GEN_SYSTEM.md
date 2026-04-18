# Local Service Lead Generation System

A productized system for local service businesses — cleaning, roofing, landscaping, HVAC, plumbing, electrical, pest, moving, paving, construction.

**Joy Cleaning LLC is the live build of this system.** Every piece below is already implemented in this codebase and documented in `SYSTEM_ARCHITECTURE.md` and `BUSINESS_LOGIC.md`.

---

## What this system does

Most local service businesses have a website that acts as a business card: logo, services, phone number. It confirms they exist when someone Googles their name. It doesn't generate leads.

This system is different. The site is the **front door of a lead machine**.

> Services × locations × blog content ranks on Google → visitors hit a quote form → leads land in Supabase → owner gets a Slack ping on their phone → owner calls back in minutes → dashboard tracks the money.

Six parts, one flow.

---

## Part 1 — Public Website

Built for SEO and conversion, not branding. Static HTML/CSS/JS — no build step, no framework. Hosts for $0/month on Netlify, Cloudflare Pages, or Vercel.

**Core pages:**
- `/index.html` — homepage (hero → services → about → testimonials → CTA → trust)
- `/services.html` — all services on one page
- `/about.html` — story, values, team
- `/quote.html` — the lead form (the conversion page)

**SEO engine (the multiplier):**
- One page per major **service** (e.g. `deep-cleaning.html`, `recurring-cleaning.html`)
- One page per **town** served (e.g. `areas/ridgefield.html`)
- One **regional hub** linking all towns (e.g. `areas/fairfield-county.html`)
- A **blog** with 5+ posts targeting informational searches

Every page funnels to the quote form. Every dropdown cross-links services and areas. Google reads the whole site as one topic cluster: *this business does X, in Y places, and helps people solve Z.*

---

## Part 2 — SEO Structure

Three keyword buckets. Each attacks a different search intent.

### a. Service pages
- Target: `"<service> <town> <state>"` — e.g. *"deep cleaning Danbury CT"*
- Contains: local headline, service description, what's included checklist, who-it's-for, trust signals, CTA
- Purpose: capture bottom-of-funnel buyers ready to book

### b. Location pages
- Target: `"<service type> <town> <state>"` — e.g. *"house cleaning Bethel CT"*
- Contains: local copy with neighborhood references (road names, landmarks), services available in that town, town-specific testimonials
- Purpose: dominate the local pack; fast to rank for small towns with low competition

### c. Blog posts
- Target: informational long-tail — *"how much does house cleaning cost in Danbury CT"*, *"deep vs standard cleaning"*
- Contains: real answers, price ranges, comparisons, prep guides
- Purpose: catch researchers earlier in the buying process

**Internal linking pattern:**
Hub → all town pages. Each town page → hub + service pages + blog. Each blog post → matching service + quote. Every service and town page → the quote form.

---

## Part 3 — Lead Capture Flow

Every page funnels to one form. That form is the single most important page on the site.

**Fields (kept short — <2 min to complete):**
- First + last name
- Phone + email
- Address or town
- Service type + frequency
- Home size (bedrooms/bathrooms, or equivalent)
- Free-form notes

**On submit:**
1. Form inserts a row in Supabase `leads` table.
2. `onNewLead()` hook fires.
3. Slack webhook posts to the owner's channel → phone notification.
4. Success screen shown to lead ("We'll be in touch shortly — check your phone; we often text first").
5. Admin dashboard updates in real time.

No pre-qualification quiz. No autoresponder. No 7-step funnel. **Speed-to-lead is the only thing that matters.** Response time within 10 minutes ~3× the conversion of same-day response.

---

## Part 4 — Backend (Supabase)

Seven tables, all documented in `SYSTEM_ARCHITECTURE.md`:

| Table | Purpose |
|---|---|
| `leads` | Incoming quote requests |
| `clients` | Customers once booked |
| `jobs` | Scheduled / completed work |
| `job_workers` | Who worked which job, hours, pay |
| `workers` | The team |
| `expenses` | Every business cost |
| `gas_logs` | Fill-ups + mileage (for IRS deduction) |

Supabase provides: Postgres database, Auth (admin login), Edge Functions (automations), storage (photos), realtime (dashboard live updates). Free tier handles a small business until ~$50K MRR.

Row-level security isolates each client's data — a single Supabase project can host multiple clients if needed, or each client gets their own project.

---

## Part 5 — Slack Notification System

The hook between the website and the owner's pocket.

When `onNewLead()` fires:
- Slack webhook posts to a dedicated channel (e.g. `#joy-leads`)
- Message includes: **name · phone · town · service · size · notes · submission time**
- Action buttons: `📞 Call` (deep-links to dialer), `💬 Text`, `✅ Mark contacted`
- The "Mark contacted" button toggles `lead.status = 'contacted'`

**Why Slack (not email):**
- Phone push notification, not buried in inbox
- Whole team sees at once
- Mobile-first — owners are in the field, not at a desk
- Replies stay in-thread; full history per lead

**Why this is the most revenue-impacting part of the entire system:**
Reducing response time from 1 day to 10 minutes typically triples conversion. A site that drives 30 leads a month means nothing if 25 of them ghost. Fast reply → booked job → real money.

---

## Part 6 — Admin Dashboard

`/admin.html` — internal tool, owner-only.

**Views:**
| View | Shows |
|---|---|
| Dashboard | Today/week/month revenue, new leads, recent activity |
| Leads | Pipeline: `new → contacted → quoted → booked → lost` |
| Jobs | Schedule: `scheduled → in_progress → completed → paid` |
| Clients | Directory + lifetime value per client |
| Workers | Hours + pay per month |
| Revenue | Breakdown by service type |
| Expenses | Log + net profit + ratio |
| Gas Tracker | Mileage + IRS deduction |

Every number is derived from the seven tables. See `BUSINESS_LOGIC.md` for every formula.

**Why this matters commercially:** nobody else selling websites includes this. The dashboard turns you from "the web guy" into "the person who runs our business on one screen."

---

## How the parts work together

```
    Google / Bing / phone assistant search
                  │
                  ▼
    Service / Town / Blog page (SEO)
                  │
                  ▼
    Quote form  (Conversion)
                  │
                  ▼
    Supabase `leads` table ──► onNewLead() ──► Slack ping to owner's phone
                  │
                  ▼
    Owner calls/texts within minutes
                  │
                  ▼
    Lead → client → job booked → job completed → paid
                  │
                  ▼
    Admin dashboard aggregates it all into one number: profit this month.
```

**Every piece is replaceable.** Swap Supabase for another Postgres — the front end doesn't care. Swap Slack for SMS — the hook doesn't care. Swap the design for a different vertical — the backend doesn't care.

**What's not replaceable is the shape of the system:** pages → form → table → notification → dashboard. That's the product. That's what gets sold.

---

## What makes this system different

| Typical local business site | This system |
|---|---|
| 5 pages, no form strategy | 15–30 pages, every one funneling to a single form |
| Contact form emails the owner | Leads in a database, notifications to Slack, status-tracked |
| No visibility beyond Google Analytics | Dashboard shows every lead, job, dollar, and cost |
| Rebuilt every 3–5 years | Backend persists; only design refreshes |
| Marketing tool | Operational tool |

This is not a nicer website. It's an operating system for the business.
