/* ──────────────────────────────────────────────────────────────
   Joy Cleaning — Admin Dashboard Logic
   ──────────────────────────────────────────────────────────────
   This file renders every view in admin.html from a single data
   source. No frameworks. No build step.

   Structure (read top to bottom):
     1. dataSource       — the only place that touches data.
                           Swap mock → Supabase here, and nothing
                           else in the app changes.
     2. Format helpers   — money, dates, phone, etc.
     3. Lookups / joins  — client name from id, workers for a job…
     4. Summary calcs    — today/week/month revenue, lead counts…
     5. Renderers        — one per view (overview, leads, jobs,
                           clients, workers, revenue, expenses, gas).
     6. Hook points      — onNewLead, onJobCompleted, onExpenseAdded.
                           Empty stubs today, wired to automation later.
     7. Boot             — runs all renderers on DOMContentLoaded.
   ────────────────────────────────────────────────────────────── */


/* ── 1. Data Source ────────────────────────────────────────── */
/* When Supabase is wired up, each method here becomes something
   like:  return (await supabase.from('leads').select('*')).data;
   The renderers stay the same. */
const dataSource = {
  async getLeads()      { return MOCK_DATA.leads; },
  async getClients()    { return MOCK_DATA.clients; },
  async getJobs()       { return MOCK_DATA.jobs; },
  async getJobWorkers() { return MOCK_DATA.job_workers; },
  async getWorkers()    { return MOCK_DATA.workers; },
  async getExpenses()   { return MOCK_DATA.expenses; },
  async getGasLogs()    { return MOCK_DATA.gas_logs; }
};


/* ── 2. Format Helpers ─────────────────────────────────────── */
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const fmt = {
  money(n)    { return '$' + Math.round(n).toLocaleString(); },
  moneyDec(n) { return '$' + Number(n).toFixed(2); },
  date(iso)   {
    if (!iso) return '—';
    const [, m, d] = iso.split('-');
    return MONTHS_SHORT[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10);
  },
  duration(mins) {
    if (mins == null) return '—';
    const h = Math.floor(mins / 60), r = mins % 60;
    return `${h}h ${String(r).padStart(2, '0')}m`;
  },
  pct(n) { return Math.round(n) + '%'; },
  cap(s) { return (s || '').charAt(0).toUpperCase() + (s || '').slice(1); }
};


/* ── 3. Lookups / Joins ────────────────────────────────────── */
const byId = (arr, id) => arr.find(r => r.id === id);

function clientShortName(clients, id) {
  const c = byId(clients, id);
  return c ? `${c.first_name} ${c.last_name[0]}.` : '—';
}
function workerShortName(workers, id) {
  const w = byId(workers, id);
  return w ? w.first_name : '—';
}
function workersForJob(jobId, jobWorkers, workers) {
  return jobWorkers
    .filter(jw => jw.job_id === jobId)
    .map(jw => workerShortName(workers, jw.worker_id))
    .join(', ') || '—';
}
function jobsForClient(clientId, jobs) {
  return jobs.filter(j => j.client_id === clientId);
}


/* ── 4. Summary Calculations ───────────────────────────────── */
/* All "today" / "this month" logic points to REFERENCE_TODAY so the
   mock dashboard is deterministic. Swap to real Date() with live data. */
const monthKey = REFERENCE_TODAY.slice(0, 7);

function todaysRevenue(jobs) {
  return jobs
    .filter(j => j.scheduled_date === REFERENCE_TODAY && j.status === 'completed')
    .reduce((s, j) => s + j.price, 0);
}
function todaysJobCount(jobs) {
  return jobs.filter(j => j.scheduled_date === REFERENCE_TODAY && j.status === 'completed').length;
}
function thisMonthRevenue(jobs) {
  return jobs
    .filter(j => j.scheduled_date.startsWith(monthKey) && j.status === 'completed')
    .reduce((s, j) => s + j.price, 0);
}
function thisMonthJobCount(jobs) {
  return jobs.filter(j => j.scheduled_date.startsWith(monthKey) && j.status === 'completed').length;
}
function thisMonthExpenses(expenses) {
  return expenses
    .filter(e => e.date.startsWith(monthKey))
    .reduce((s, e) => s + e.amount, 0);
}
function avgJobValue(jobs) {
  const done = jobs.filter(j => j.scheduled_date.startsWith(monthKey) && j.status === 'completed');
  if (!done.length) return 0;
  return done.reduce((s, j) => s + j.price, 0) / done.length;
}


/* ── Lookup Maps (labels + badge colors) ───────────────────── */
const SERVICE_LABEL = {
  standard: 'Standard Clean', deep: 'Deep Clean',
  move_in: 'Move-In Clean',   move_out: 'Move-Out Clean',
  recurring: 'Recurring',     apartment: 'Apartment Clean',
  office: 'Office Clean',     post_event: 'Post-Event'
};
const LEAD_BADGE = {
  new: 'yellow', contacted: 'blue', quoted: 'blue',
  booked: 'purple', lost: 'red'
};
const JOB_BADGE = {
  scheduled: 'yellow', in_progress: 'blue',
  completed: 'green', paid: 'green', cancelled: 'red'
};
const EXPENSE_BADGE = {
  supplies: 'purple', gas: 'blue', insurance: 'yellow',
  marketing: 'green', payroll: 'purple', other: 'gray'
};
const RECEIPT_BADGE = { saved: 'green', pending: 'yellow', missing: 'red' };


/* ── DOM helpers ───────────────────────────────────────────── */
function setStat(name, value) {
  document.querySelectorAll(`[data-stat="${name}"]`).forEach(el => { el.textContent = value; });
}
function getTbody(renderKey) {
  return document.querySelector(`[data-render="${renderKey}"]`);
}


/* ── 5. Renderers ──────────────────────────────────────────── */

/* 5a. OVERVIEW ─ recent jobs + recent leads + top stats */
async function renderOverview() {
  const [jobs, leads, clients] = await Promise.all([
    dataSource.getJobs(),
    dataSource.getLeads(),
    dataSource.getClients()
  ]);

  setStat('today-revenue',  fmt.money(todaysRevenue(jobs)));
  setStat('today-jobs',     `${todaysJobCount(jobs)} jobs completed`);
  setStat('month-revenue',  fmt.money(thisMonthRevenue(jobs)));
  setStat('month-jobs',     `${thisMonthJobCount(jobs)} jobs completed`);
  setStat('new-leads',      leads.filter(l => l.status === 'new').length);
  setStat('pending-leads',  `${leads.filter(l => l.status === 'new' || l.status === 'contacted').length} awaiting response`);

  const recentJobs = [...jobs]
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
    .slice(0, 5);

  const jobsTbody = getTbody('overview-jobs');
  if (jobsTbody) {
    jobsTbody.innerHTML = recentJobs.map(j => `
      <tr>
        <td class="td-name">${clientShortName(clients, j.client_id)}</td>
        <td>${SERVICE_LABEL[j.service_type] || j.service_type}</td>
        <td>${(byId(clients, j.client_id) || {}).town || '—'}</td>
        <td>${fmt.date(j.scheduled_date)}, 2025</td>
        <td class="td-mono">${fmt.money(j.price)}</td>
        <td><span class="badge ${JOB_BADGE[j.status]}">${fmt.cap(j.status)}</span></td>
      </tr>
    `).join('');
  }

  const recentLeads = [...leads]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  const leadsTbody = getTbody('overview-leads');
  if (leadsTbody) {
    leadsTbody.innerHTML = recentLeads.map(l => `
      <tr>
        <td class="td-name">${l.first_name} ${l.last_name[0]}.</td>
        <td>${l.town}</td>
        <td>${SERVICE_LABEL[l.service_interest] || l.service_interest}</td>
        <td>${fmt.date(l.created_at)}, 2025</td>
        <td><span class="badge ${LEAD_BADGE[l.status]}">${fmt.cap(l.status)}</span></td>
      </tr>
    `).join('');
  }
}

/* 5b. LEADS ─ full leads table */
async function renderLeads() {
  const leads = await dataSource.getLeads();

  const monthLeads = leads.filter(l => l.created_at.startsWith(monthKey));
  setStat('leads-total',     monthLeads.length);
  setStat('leads-converted', monthLeads.filter(l => l.status === 'booked').length);
  setStat('leads-pending',   leads.filter(l => l.status === 'new' || l.status === 'contacted').length);

  const tbody = getTbody('leads');
  if (!tbody) return;
  tbody.innerHTML = leads.map((l, i) => `
    <tr>
      <td class="td-mono">${String(i + 1).padStart(3, '0')}</td>
      <td class="td-name">${l.first_name} ${l.last_name[0]}.</td>
      <td class="td-mono">${l.email || l.phone}</td>
      <td>${l.town}</td>
      <td>${SERVICE_LABEL[l.service_interest] || l.service_interest}${l.frequency && l.frequency !== 'once' ? ` (${l.frequency})` : ''}</td>
      <td>${l.bedrooms} BR / ${l.bathrooms} BA</td>
      <td>${fmt.date(l.created_at)}</td>
      <td><span class="badge ${LEAD_BADGE[l.status]}">${fmt.cap(l.status)}</span></td>
      <td>${l.notes || '—'}</td>
    </tr>
  `).join('');
}

/* 5c. JOBS ─ full job log */
async function renderJobs() {
  const [jobs, clients, jobWorkers, workers] = await Promise.all([
    dataSource.getJobs(),
    dataSource.getClients(),
    dataSource.getJobWorkers(),
    dataSource.getWorkers()
  ]);

  setStat('jobs-month',    thisMonthJobCount(jobs));
  setStat('jobs-avg',      fmt.money(avgJobValue(jobs)));
  setStat('jobs-upcoming', jobs.filter(j => j.status === 'scheduled').length);

  const thisWeekStart = '2025-04-14';
  setStat('jobs-week',
    jobs.filter(j => j.scheduled_date >= thisWeekStart && j.status === 'completed').length
  );

  const tbody = getTbody('jobs');
  if (!tbody) return;
  tbody.innerHTML = [...jobs]
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
    .map(j => `
      <tr>
        <td class="td-mono">#${j.id.replace('j', '0')}</td>
        <td class="td-name">${clientShortName(clients, j.client_id)}</td>
        <td>${SERVICE_LABEL[j.service_type] || j.service_type}</td>
        <td>${(byId(clients, j.client_id) || {}).town || '—'}</td>
        <td>${fmt.date(j.scheduled_date)}</td>
        <td>${fmt.duration(j.duration_minutes)}</td>
        <td>${workersForJob(j.id, jobWorkers, workers)}</td>
        <td class="td-mono">${fmt.money(j.price)}</td>
        <td><span class="badge ${JOB_BADGE[j.status]}">${fmt.cap(j.status)}</span></td>
      </tr>
    `).join('');
}

/* 5d. CLIENTS ─ directory + lifetime value */
async function renderClients() {
  const [clients, jobs] = await Promise.all([
    dataSource.getClients(),
    dataSource.getJobs()
  ]);

  const active = clients.filter(c => c.active);
  const recurring = clients.filter(c => c.preferred_frequency !== 'once');

  const ltvEach = clients.map(c => ({
    client: c,
    jobCount: jobsForClient(c.id, jobs).length,
    lifetimeValue: jobsForClient(c.id, jobs)
      .filter(j => j.status === 'completed' || j.status === 'paid')
      .reduce((s, j) => s + j.price, 0)
  }));

  const totalLtv = ltvEach.reduce((s, r) => s + r.lifetimeValue, 0);
  const avgLtv = clients.length ? totalLtv / clients.length : 0;

  setStat('clients-active',    active.length);
  setStat('clients-total',     clients.length);
  setStat('clients-recurring', recurring.length);
  setStat('clients-ltv-avg',   fmt.money(avgLtv));

  const tbody = getTbody('clients');
  if (!tbody) return;
  tbody.innerHTML = ltvEach.map(r => `
    <tr>
      <td class="td-name">${r.client.first_name} ${r.client.last_name}</td>
      <td class="td-mono">${r.client.phone}</td>
      <td>${r.client.town}</td>
      <td>${fmt.cap(r.client.preferred_frequency)}</td>
      <td class="td-mono">${r.jobCount}</td>
      <td class="td-mono">${fmt.money(r.lifetimeValue)}</td>
      <td><span class="badge ${r.client.active ? 'green' : 'gray'}">${r.client.active ? 'Active' : 'Inactive'}</span></td>
      <td>${r.client.notes || '—'}</td>
    </tr>
  `).join('');
}

/* 5e. WORKERS ─ team + hours + pay */
async function renderWorkers() {
  const [workers, jobWorkers, jobs] = await Promise.all([
    dataSource.getWorkers(),
    dataSource.getJobWorkers(),
    dataSource.getJobs()
  ]);

  // For each worker, sum hours/pay over this month's completed jobs.
  const completedThisMonth = new Set(
    jobs.filter(j => j.scheduled_date.startsWith(monthKey) && j.status === 'completed').map(j => j.id)
  );

  const rows = workers.map(w => {
    const entries = jobWorkers.filter(jw => jw.worker_id === w.id && completedThisMonth.has(jw.job_id));
    return {
      worker: w,
      jobsWorked: entries.length,
      hours: entries.reduce((s, jw) => s + jw.hours, 0),
      pay: entries.reduce((s, jw) => s + jw.pay_total, 0)
    };
  });

  const totalHours = rows.reduce((s, r) => s + r.hours, 0);
  const totalPay   = rows.reduce((s, r) => s + r.pay, 0);

  setStat('workers-active',      workers.filter(w => w.active).length);
  setStat('workers-hours-month', totalHours.toFixed(1));
  setStat('workers-pay-month',   fmt.money(totalPay));

  const tbody = getTbody('workers');
  if (!tbody) return;
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td class="td-name">${r.worker.first_name} ${r.worker.last_name}</td>
      <td>${fmt.cap(r.worker.role).replace('_', ' ')}</td>
      <td class="td-mono">${r.worker.phone}</td>
      <td class="td-mono">$${r.worker.default_rate}/hr</td>
      <td class="td-mono">${r.jobsWorked}</td>
      <td class="td-mono">${r.hours.toFixed(1)}</td>
      <td class="td-mono">${fmt.money(r.pay)}</td>
      <td><span class="badge ${r.worker.active ? 'green' : 'gray'}">${r.worker.active ? 'Active' : 'Inactive'}</span></td>
    </tr>
  `).join('');
}

/* 5f. REVENUE ─ breakdown by service type */
async function renderRevenue() {
  const jobs = await dataSource.getJobs();
  const monthJobs = jobs.filter(j => j.scheduled_date.startsWith(monthKey) && j.status === 'completed');
  const totalRev = monthJobs.reduce((s, j) => s + j.price, 0);

  setStat('rev-month', fmt.money(totalRev));

  // Group by service_type.
  const byType = {};
  monthJobs.forEach(j => {
    if (!byType[j.service_type]) byType[j.service_type] = { count: 0, total: 0 };
    byType[j.service_type].count++;
    byType[j.service_type].total += j.price;
  });

  const tbody = getTbody('revenue');
  if (!tbody) return;
  const tones = ['purple', 'blue', 'yellow', 'green', 'gray'];
  const rows = Object.entries(byType)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([type, data], i) => `
      <tr>
        <td class="td-name">${SERVICE_LABEL[type] || type}</td>
        <td>${data.count}</td>
        <td class="td-mono">${fmt.money(data.total / data.count)}</td>
        <td class="td-mono">${fmt.money(data.total)}</td>
        <td><span class="badge ${tones[i % tones.length]}">${fmt.pct((data.total / totalRev) * 100)}</span></td>
      </tr>
    `).join('');
  tbody.innerHTML = rows;
}

/* 5g. EXPENSES ─ expense log + net profit calc */
async function renderExpenses() {
  const [expenses, jobs] = await Promise.all([
    dataSource.getExpenses(),
    dataSource.getJobs()
  ]);

  const monthTotal = thisMonthExpenses(expenses);
  const monthRevenue = thisMonthRevenue(jobs);
  const netProfit = monthRevenue - monthTotal;
  const ratio = monthRevenue ? (monthTotal / monthRevenue) * 100 : 0;

  setStat('exp-month',   fmt.money(monthTotal));
  setStat('net-profit',  fmt.money(netProfit));
  setStat('exp-ratio',   fmt.pct(ratio));

  const tbody = getTbody('expenses');
  if (!tbody) return;
  tbody.innerHTML = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => `
      <tr>
        <td>${fmt.date(e.date)}</td>
        <td><span class="badge ${EXPENSE_BADGE[e.category]}">${fmt.cap(e.category)}</span></td>
        <td>${e.description}</td>
        <td class="td-mono">${fmt.money(e.amount)}</td>
        <td>${e.payment_method.replace('_', ' ')}</td>
        <td><span class="badge ${RECEIPT_BADGE[e.receipt_status]}">${fmt.cap(e.receipt_status)}</span></td>
      </tr>
    `).join('');
}

/* 5h. GAS ─ fill-up log + tax deduction */
const IRS_MILEAGE_RATE = 0.67; // 2025 rate

async function renderGas() {
  const [gasLogs, expenses, workers] = await Promise.all([
    dataSource.getGasLogs(),
    dataSource.getExpenses(),
    dataSource.getWorkers()
  ]);

  const monthLogs = gasLogs.filter(g => g.date.startsWith(monthKey));

  // Dollar total: sum of expenses with category='gas' this month.
  // (gas_logs tracks gallons + mileage; expenses tracks the spend.)
  const totalGas = expenses
    .filter(e => e.date.startsWith(monthKey) && e.category === 'gas')
    .reduce((s, e) => s + e.amount, 0);

  // Miles: per-vehicle odometer range within the month.
  const vehicles = [...new Set(monthLogs.map(g => g.vehicle))];
  let totalMiles = 0;
  vehicles.forEach(v => {
    const vLogs = monthLogs.filter(g => g.vehicle === v).sort((a, b) => a.date.localeCompare(b.date));
    if (vLogs.length >= 2) {
      totalMiles += vLogs[vLogs.length - 1].odometer - vLogs[0].odometer;
    }
  });

  const perMile  = totalMiles ? totalGas / totalMiles : 0;
  const deduction = totalMiles * IRS_MILEAGE_RATE;

  setStat('gas-month',     fmt.money(totalGas));
  setStat('gas-miles',     totalMiles.toLocaleString());
  setStat('gas-per-mile',  '$' + perMile.toFixed(2));
  setStat('gas-deduction', fmt.money(deduction));

  const tbody = getTbody('gas');
  if (!tbody) return;
  tbody.innerHTML = [...gasLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(g => `
      <tr>
        <td>${fmt.date(g.date)}</td>
        <td>${g.vehicle}</td>
        <td>${workerShortName(workers, g.driver_id)}</td>
        <td>${g.station}</td>
        <td class="td-mono">${g.gallons.toFixed(1)}</td>
        <td class="td-mono">$${g.price_per_gallon.toFixed(2)}</td>
        <td class="td-mono">${fmt.moneyDec(g.total_cost)}</td>
        <td class="td-mono">${g.odometer.toLocaleString()}</td>
        <td><span class="badge ${RECEIPT_BADGE[g.receipt_status]}">${fmt.cap(g.receipt_status)}</span></td>
      </tr>
    `).join('');
}


/* ── 6. Automation Hook Points ─────────────────────────────── */
/* Placeholder functions. Nothing is wired up yet — they're here so
   future you / your automations have a single, obvious place to
   plug in: email, SMS, Zapier, tax exports, review requests, etc.

   They're exposed on `window` so anything on the page can fire them. */

function onNewLead(lead) {
  console.log('[hook] onNewLead →', lead);
  // TODO: notify Maria/Carlos by SMS or email.
  // TODO: enrich with geocoding, lead score, CRM push.
}

function onJobCompleted(job) {
  console.log('[hook] onJobCompleted →', job);
  // TODO: generate invoice.
  // TODO: send 24hr review-request text.
  // TODO: update client lifetime value.
  // TODO: auto-schedule next recurring visit.
}

function onExpenseAdded(expense) {
  console.log('[hook] onExpenseAdded →', expense);
  // TODO: auto-categorize from merchant name.
  // TODO: run OCR on attached receipt image.
  // TODO: update monthly expense rollup for taxes.
}

window.onNewLead       = onNewLead;
window.onJobCompleted  = onJobCompleted;
window.onExpenseAdded  = onExpenseAdded;


/* ── 7. Boot ───────────────────────────────────────────────── */
async function boot() {
  await Promise.all([
    renderOverview(),
    renderLeads(),
    renderJobs(),
    renderClients(),
    renderWorkers(),
    renderRevenue(),
    renderExpenses(),
    renderGas()
  ]);
}
document.addEventListener('DOMContentLoaded', boot);
