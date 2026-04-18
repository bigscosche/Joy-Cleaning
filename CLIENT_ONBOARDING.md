# Client Onboarding

A predictable process from "yes, let's do this" to "your site is live and taking leads."

Two weeks, start to finish. Five stages.

---

## What to collect from the client (intake)

Send the whole thing as a single form (Google Form, Typeform, or Tally). **Do NOT email questions piecemeal** — it kills momentum and drags onboarding to 6+ weeks.

### Business basics
- Legal business name
- Domain (or help them pick one)
- Phone number — the one that rings when a lead comes in
- Email for customer replies
- Physical address (optional, but helps local SEO)
- Years in business
- Licensed / insured / bonded status

### Services (3–6)
For each service:
- Name
- 2-sentence description in their own words
- What's included (6–10 bullets)
- Who typically books this
- Typical price range (if they're comfortable sharing)

### Service areas (5–10 towns)
- Towns served, in priority order (their best-performing town first)
- For each: any local detail they'd mention in a pitch — landmarks, road names, neighborhood nicknames, the kinds of homes common there

### Trust proof
- Number of customers / jobs completed (rough count is fine)
- Star rating + source (Google, Yelp, Facebook)
- Certifications, awards, press
- 3–6 testimonials (name + town + service + quote)

### Assets
- Logo (any format)
- 3–10 photos of their recent work
- Team photos (if available)
- Brand color preference (optional)

### Access
- Will they own the domain or you? **Always recommend they own it.**
- Who gets the admin dashboard login
- Slack channel to notify (or SMS phone number for fallback)

---

## 5-Step Build Process

### Step 1 — Collect  (Day 1–3)

- Send the intake form
- Book a 30-min kickoff call to walk it through together
- Answer their questions, set expectations (2 weeks)
- Collect the logo + photos

**Exit criteria:** every field on the intake form filled. Assets received.

### Step 2 — Generate  (Day 3–7)

- Clone your master template (based on Joy Cleaning)
- Find / replace business name, phone, email, brand color
- Swap services — update the service pages, homepage services section, nav dropdown
- Swap areas — update the area pages and county hub
- Drop in photos, testimonials, trust numbers
- Write 5 blog posts using the universal topic pack (see `SITE_TEMPLATE.md`)

**Exit criteria:** every page loads; content is final; client has approved a preview.

### Step 3 — Deploy  (Day 7–8)

- Push to Netlify / Cloudflare Pages / Vercel (free tier)
- Point the client's domain at the deploy
- Verify SSL is live
- QA every page on mobile + desktop
- Run Lighthouse; fix anything under 90 on mobile performance

**Exit criteria:** live on their domain, SSL green, mobile-fast.

### Step 4 — Connect Backend  (Day 8–10)

- Create Supabase project for them
- Run the schema SQL from `SYSTEM_ARCHITECTURE.md` (all 7 tables)
- Add their Supabase URL + anon key to the quote form JS
- Create a dedicated Slack channel (or webhook)
- Wire `onNewLead()` to post to Slack with Call / Text / Mark Contacted buttons
- Submit a real test lead end-to-end; verify the Slack ping lands on their phone
- Issue admin dashboard login
- Run one test render of the admin dashboard with their mock data

**Exit criteria:** test lead travels from form → table → Slack → dashboard successfully.

### Step 5 — Launch  (Day 10–14)

- Submit sitemap to Google Search Console
- Create or claim Google Business Profile
- 30-min training call: how to use admin dashboard, how to reply to leads from Slack, how to mark jobs completed
- Send launch email for them to blast to their customer list (existing happy customers leaving reviews = compounding authority)
- Hand over a 1-page "How to use your new site" cheat sheet
- Schedule the 30-day check-in

**Exit criteria:** owner has logged in, received at least one test lead, and can operate the dashboard without help.

---

## Total timeline

| Day | Milestone |
|---|---|
| 1 | Kickoff call |
| 3 | Intake complete, assets received |
| 7 | Site built, preview approved |
| 8 | Live on their domain |
| 10 | Backend + Slack connected, test lead confirmed |
| 14 | Trained, launched, sitemap submitted |

Working back-to-back you can onboard **2–3 clients per month solo**, **8–12 with a small team** (writer + designer + you).

---

## What happens after launch (the 30/60/90 loop)

The onboarding ends at day 14. The relationship starts there.

- **Day 21** — Check-in text: "any leads come through? Anything weird?" Fix anything broken.
- **Day 30** — Send a stat snapshot: leads received, response time, top pages, status of their pipeline.
- **Day 45** — Ask for a referral. "If you know 2 other local businesses who'd benefit, I'll take $500 off their monthly."
- **Day 60** — Review page performance, update blog posts, check for missing service or area pages.
- **Day 90** — Decision point for performance tier renewal. Share the full scorecard — leads, jobs, revenue impact.

---

## Red flags — clients to pass on

Spotting these early saves weeks of pain.

- Won't share current revenue or cost-per-customer (can't price the offer fairly)
- Wants custom design before business value is proven
- Doesn't own their phone number (can't port it if needed)
- Multiple competing "web people" already involved
- Refuses to take the admin dashboard training
- Keeps postponing the kickoff call
- Brand new business with no real customers yet — they need to get revenue first
- Asks you to lower your price before the first call

Any two of these = pass. Any one that's about power/control = pass immediately. Right-fit clients pay on time, ship fast, and refer.

---

## Ideal-fit client profile

- Local service business with ~$200K+/year revenue
- Already doing *some* jobs consistently; just wants more
- Owner is accessible, mobile-first, texts back fast
- Existing site is a brochure (1–5 pages, no lead form or a weak one)
- Operations already runs on some tool (Jobber / HCP / Service Fusion) — we're not replacing it
- Has at least 5 reviews and a few testimonials to work with
- Serves 3+ towns they can name without thinking

Businesses matching this profile pay $500–$2,000/month happily because they can directly tie the spend to booked jobs.
