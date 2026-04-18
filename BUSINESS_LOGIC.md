# Joy Cleaning — Business Logic

This is the working math for the business. Every number on the admin dashboard derives from one of these formulas. Keep it simple, keep it practical.

---

## 1. Profit Per Job

> **Net profit** = `price` − `worker pay` − `gas cost` − `supplies share`

**Breakdown:**

- **Price** — from `jobs.price` (what the client pays).
- **Worker pay** — sum of `job_workers.pay_total` for that job.
- **Gas cost** — `jobs.miles_driven × avg_cost_per_mile`, where `avg_cost_per_mile = this_month_gas_spend / total_miles_driven`.
- **Supplies share** — allocate monthly supplies expense across all jobs. Quick formula: `monthly_supplies / number_of_jobs_this_month`.

**Example — Job #441 (Karen L., recurring, $175):**

| Line | Amount |
|---|---|
| Price | $175 |
| Worker pay (Maria 2.25h × $40 + Ana 2.25h × $25) | −$146.25 |
| Gas (18 miles × $0.17) | −$3.06 |
| Supplies share ($425 / 41 jobs) | −$10.37 |
| **Net profit** | **$15.32** |

> **Rule of thumb:** a healthy cleaning job nets 10–25% of the price. Recurring jobs net less per visit but compound (see below).

---

## 2. Recurring Customer Value

> **Lifetime value (LTV)** = sum of `jobs.price` for all jobs where `client_id = X` AND `status IN ('completed', 'paid')`.

**Projected annual value** for a still-active recurring client:

| Frequency | Visits per year | Formula |
|---|---|---|
| Weekly | 52 | `avg_visit_price × 52` |
| Bi-weekly | 26 | `avg_visit_price × 26` |
| Monthly | 12 | `avg_visit_price × 12` |

**Why this matters:** a $175 bi-weekly client is worth ~$4,550/year. Losing one of them is the equivalent of losing 25 one-time jobs. This justifies spending more on retention (24-hr guarantee, same cleaner each visit, personal check-ins) than on any acquisition channel.

---

## 3. Weekly / Monthly Revenue

> **Revenue** = sum of `jobs.price` where `status IN ('completed', 'paid')` AND the job's `scheduled_date` falls within the period.

- **Daily** — `scheduled_date = today`
- **Weekly** — `scheduled_date ≥ start_of_week`
- **Monthly** — `scheduled_date` starts with `YYYY-MM`
- **YTD** — `scheduled_date` starts with `YYYY`

Scheduled-but-not-completed jobs are excluded from revenue (they're in the backlog, not the books).

---

## 4. Gas Cost Per Job

Two ways, use whichever is more accurate for the situation:

### A. Actual (preferred)
> `gas_per_job = (monthly_gas_total / monthly_miles_total) × job.miles_driven`

Example: April gas = $210, April miles = 1,248. Cost per mile = $0.168. A 22-mile job costs $3.70 in gas.

### B. IRS Standard (for tax deduction, NOT for P&L)
> `deduction = miles × IRS_rate` (2025 rate = $0.67/mile)

Use **A** for the profit-per-job calc. Use **B** when filing taxes — it's almost always a bigger deduction than actual gas cost, because it covers depreciation, maintenance, and insurance too.

---

## 5. Worker Pay

> `worker_pay_for_job = hours × pay_rate`

`pay_rate` is set per `job_workers` row (defaults to `workers.default_rate`), so it can be adjusted for individual jobs (e.g., holiday pay, hard jobs, specific client premium).

**Monthly payroll for a worker:**
> sum of `job_workers.pay_total` where `worker_id = X` AND the linked job's `scheduled_date` starts with current month.

**Payroll as % of revenue** is the single most important ratio for this business. Target:

- **≤ 45%** — healthy. Business keeps enough to cover overhead + owner margin.
- **45–55%** — watch closely. Usually caused by overstaffing jobs or underpricing.
- **> 55%** — price increase, staffing cut, or operational fix needed.

---

## 6. Expense Ratio & Net Profit

> `net_profit_monthly = monthly_revenue − monthly_expenses − monthly_worker_pay`
> `expense_ratio = monthly_expenses / monthly_revenue` (target: < 15%, excluding payroll)
> `profit_margin = net_profit / monthly_revenue` (target: > 30% after payroll)

Expenses here means everything **except** worker pay: supplies, gas, insurance, marketing, equipment. Payroll is tracked separately because it scales linearly with revenue while the others don't.

---

## 7. Conversion Rate (Leads → Clients)

> `conversion_rate = leads_with_status='booked' / total_leads_this_month`

Target: **> 55%**. If conversion drops, the problem is upstream — response time, quote price, or lead quality — not the cleaning.

**Response time matters more than price.** A lead contacted within 2 hours converts ~3× better than one contacted the next day.

---

## 8. Quick Daily Health Check

These five numbers tell you if the business is OK on any given day. The admin Dashboard view shows all five up top.

1. **Today's revenue** — is money coming in?
2. **This week's revenue** — on pace for the month?
3. **New leads (pending response)** — any waiting too long?
4. **Upcoming jobs (next 7 days)** — is the schedule full?
5. **Net profit this month** — is the business actually making money?

If any of these five are off, dig into the relevant view.
