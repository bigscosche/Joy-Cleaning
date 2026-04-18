# Site Template — What Customizes, What Stays

When applying this system to a new client (roofer, HVAC, landscaper, plumber, etc.), ~90% of the work is already done. Only the visible layer changes.

This is the reusability guide.

---

## Stays the same (the skeleton)

### Design system (`css/styles.css`)
- Typography (Plus Jakarta Sans, or swap one line to change)
- Color palette (every color is a CSS variable — one edit to rebrand)
- Spacing, radii, shadows
- Button styles, form styles, card styles
- Nav, dropdown, footer, sticky mobile CTA

### Page layouts
- **Homepage:** hero → services → about → testimonials → CTA → trust → footer
- **Service page:** hero → description → what's included → related services → CTA
- **Location page:** hero → local intro → services available here → trust → CTA
- **Blog post:** hero → body → sidebar → related → CTA
- **Quote form page:** hero → form + sidebar → trust → footer

### Quote form logic (`js/quote-form.js`)
- Same fields, validation, submission flow
- Same success screen
- Same Supabase insert
- Same `onNewLead()` hook trigger

### Admin dashboard (`admin.html` + `js/admin.js`)
- Identical structure for every client
- Same seven tables
- Same renderers, formulas, hook points
- Only business name and branding change in the sidebar

### SEO skeleton
- Service × location × blog structure
- Hub-and-spoke internal linking
- Same meta description patterns
- Same schema markup

---

## Customizes per client

### Identity

| Field | Example (cleaning) | Example (roofing) | Example (landscaping) |
|---|---|---|---|
| Business name | Joy Cleaning LLC | Apex Roofing Co | Evergreen Lawn Care |
| Logo wordmark | "Joy Cleaning" | "Apex Roofing" | "Evergreen" |
| Phone | (203) 555-0100 | (203) 555-8800 | (203) 555-4200 |
| Email | hello@joycleaningllc.com | hello@apexroofing.com | info@evergreenlawn.com |
| Accent color | Lavender #7B62DF | Crimson #DC2626 | Forest #15803D |
| Hero photo/emoji | ✨ clean kitchen | 🏠 fresh roof | 🌿 manicured lawn |
| Tagline | "Premium House Cleaning" | "Roofs That Last" | "Lawn Care, Done Right" |

### Services (the list + copy)
For each service offered:
- **Name** (e.g. "Deep Cleaning" vs "Roof Repair" vs "Spring Cleanup")
- **Tagline** (one line)
- **Description** (2–3 sentences)
- **What's included** (6–10 bullet items)
- **Who it's for** (3–4 buyer personas)
- **Starting price** (optional — can be hidden with "starts at / custom quote")

### Service areas
List of towns served. For each town:
- Town name
- 3–5 local signals (road names, landmarks, neighborhoods, nearby towns)
- Town-specific positioning if relevant (lakefront, historic, suburban, rural)
- Types of homes or buildings common to the area

### Trust signals
- Years in business
- Approximate number of customers / jobs completed
- Star rating + source (Google, Yelp)
- License / insurance / bonding status
- Certifications, awards, press mentions (if any)

### Testimonials (minimum 3, ideal 6)
Each one: name (or initial), town, service they bought, quote, rating. Short beats long.

### Photos
- Hero image (or keep emoji)
- Service-specific photos (emoji fallback works)
- Team photo(s)
- Before/after shots (especially valuable for cleaning, roofing, landscaping, contracting)

### Blog topics
Universal 5-post launch pack, tuned per industry:
1. **Pricing guide** — *"How much does <service> cost in <town>?"*
2. **Frequency guide** — *"How often should you <get service>?"*
3. **Comparison** — *"<Service A> vs <Service B>"*
4. **Trust builder** — *"What to expect from a professional <service>"*
5. **Prep guide** — *"How to prepare for a <service> appointment"*

Every industry has all five. Only the title and body copy change.

### Backend config
- Supabase project URL + anon key (per client)
- Slack webhook URL (per client, dedicated channel)
- Domain name + DNS pointed to hosting

---

## The 90/10 split

For any local service business (cleaner, roofer, landscaper, HVAC, plumber, electrician, pest, mover, paver, contractor), roughly:

- **90% of the build is the template** — find/replace + drop in copy + swap photos
- **10% is customization** — their specific services, areas, words, photos

That's the economics that let this be sold as a productized service instead of a custom $20K build each time.

---

## Customization checklist (per new client)

Use this as the intake → build checklist.

**Identity**
- [ ] Business name + tagline
- [ ] Phone + email + address
- [ ] Domain
- [ ] Accent color (or use default)
- [ ] Logo mark (wordmark fallback if none)
- [ ] Hero imagery

**Services (3–6)**
- [ ] Names + taglines
- [ ] Descriptions
- [ ] Inclusion checklists
- [ ] Buyer personas
- [ ] Starting prices (optional)

**Locations (5–10)**
- [ ] Town list, priority order
- [ ] Local signals per town
- [ ] County/region hub name

**Trust**
- [ ] Years in business
- [ ] Customer / job count
- [ ] Rating + source
- [ ] Licensing / insurance
- [ ] Certifications

**Testimonials (min 3)**
- [ ] Name, town, service, quote, rating

**Photos**
- [ ] Hero
- [ ] Service shots
- [ ] Team
- [ ] Before/after pairs

**Blog (5 posts)**
- [ ] Pricing guide
- [ ] Frequency guide
- [ ] Comparison
- [ ] Trust builder
- [ ] Prep guide

**Backend**
- [ ] Supabase project created
- [ ] Schema applied
- [ ] Keys added to quote form
- [ ] Slack webhook created + wired
- [ ] Test lead submitted end-to-end
- [ ] Admin dashboard login issued

When every box is ticked, you're ready to launch.
