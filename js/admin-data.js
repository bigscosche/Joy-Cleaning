/* ──────────────────────────────────────────────────────────────
   Joy Cleaning — Mock Data (Admin Dashboard)
   ──────────────────────────────────────────────────────────────
   This file is a stand-in for Supabase. Every object below mirrors
   a table described in SYSTEM_ARCHITECTURE.md.

   When Supabase is ready:
     1.  Keep this file for local/dev preview OR delete it.
     2.  In js/admin.js, swap `dataSource` methods to call Supabase
         (e.g. `supabase.from('leads').select('*')`).
     3.  No other file needs to change — the UI reads from
         `dataSource`, not from `MOCK_DATA` directly.
   ────────────────────────────────────────────────────────────── */

const MOCK_DATA = {

  /* workers ─ people who clean or run the business */
  workers: [
    { id: 'w1', first_name: 'Maria',  last_name: 'Rivera', phone: '(203) 555-0100', role: 'owner',         default_rate: 40, active: true, hired_date: '2018-05-01' },
    { id: 'w2', first_name: 'Carlos', last_name: 'Rivera', phone: '(203) 555-0101', role: 'owner',         default_rate: 40, active: true, hired_date: '2018-05-01' },
    { id: 'w3', first_name: 'Ana',    last_name: 'Gomes',  phone: '(203) 555-0115', role: 'cleaner',       default_rate: 25, active: true, hired_date: '2022-03-10' },
    { id: 'w4', first_name: 'Sofia',  last_name: 'Medina', phone: '(203) 555-0122', role: 'lead_cleaner',  default_rate: 28, active: true, hired_date: '2019-06-14' }
  ],

  /* clients ─ active or past customers */
  clients: [
    { id: 'c1', first_name: 'Karen',    last_name: 'Lopez',    phone: '(203) 555-0201', email: 'karen.l@email.com',  address: '12 Spring Valley Rd', town: 'Ridgefield',    preferred_frequency: 'biweekly', notes: 'Mornings preferred. No strong scents.', active: true,  created_at: '2023-08-12' },
    { id: 'c2', first_name: 'Tom',      last_name: 'Reilly',   phone: '(203) 555-0202', email: 'tom.r@email.com',    address: '4 Church Hill Rd',    town: 'Bethel',        preferred_frequency: 'once',     notes: 'Deep clean; may convert to recurring.', active: true,  created_at: '2025-03-20' },
    { id: 'c3', first_name: 'Sarah',    last_name: 'Park',     phone: '(203) 555-0203', email: 'sarah.p@email.com',  address: '88 Main St',          town: 'Newtown',       preferred_frequency: 'biweekly', notes: 'Two cats. Eco products only.',          active: true,  created_at: '2024-01-15' },
    { id: 'c4', first_name: 'James',    last_name: 'Fuller',   phone: '(203) 555-0204', email: 'james.f@email.com',  address: '27 Lake Ave',         town: 'Danbury',       preferred_frequency: 'once',     notes: 'Move-out clean, rental property.',      active: false, created_at: '2025-04-10' },
    { id: 'c5', first_name: 'Anne',     last_name: 'Marshall', phone: '(203) 555-0205', email: 'anne.m@email.com',   address: '56 Ridge Rd',         town: 'Redding',       preferred_frequency: 'monthly',  notes: 'Large estate; monthly deep clean.',     active: true,  created_at: '2023-11-02' },
    { id: 'c6', first_name: 'Jennifer', last_name: 'Walsh',    phone: '(203) 555-0487', email: 'jen.w@email.com',    address: '14 Orchard Ln',       town: 'Newtown',       preferred_frequency: 'biweekly', notes: '2 kids, 1 dog. Priority: kitchen/bath.', active: true, created_at: '2024-05-10' },
    { id: 'c7', first_name: 'Anne',     last_name: 'Talbot',   phone: '(203) 555-0341', email: 'anne.t@email.com',   address: '99 Crest Rd',         town: 'Ridgefield',    preferred_frequency: 'weekly',   notes: '5BR/4BA estate. Keycode access.',       active: true,  created_at: '2024-09-01' }
  ],

  /* leads ─ incoming quote requests (converted or pending) */
  leads: [
    { id: 'l1', first_name: 'Robert',   last_name: 'Hart',    phone: '(203) 555-0310', email: 'robert.h@email.com', town: 'Wilton',        service_interest: 'deep',      frequency: 'once',     bedrooms: 4, bathrooms: 3, notes: 'Hardwood floors. Pre-showing clean.', status: 'new',       quoted_amount: null, source: 'website',  converted_client_id: null,  created_at: '2025-04-18' },
    { id: 'l2', first_name: 'Lisa',     last_name: 'Marino',  phone: '(203) 555-0219', email: 'lisa.m@email.com',   town: 'New Fairfield', service_interest: 'recurring', frequency: 'biweekly', bedrooms: 3, bathrooms: 2, notes: 'Lakefront home, two dogs.',           status: 'quoted',    quoted_amount: 195,  source: 'website',  converted_client_id: null,  created_at: '2025-04-17' },
    { id: 'l3', first_name: 'Dan',      last_name: 'Keller',  phone: '(203) 555-0321', email: 'dan.k@email.com',    town: 'Danbury',       service_interest: 'move_in',   frequency: 'once',     bedrooms: 2, bathrooms: 1, notes: 'Apr 22 confirmed.',                   status: 'booked',    quoted_amount: 245,  source: 'phone',    converted_client_id: null,  created_at: '2025-04-16' },
    { id: 'l4', first_name: 'Anne',     last_name: 'Talbot',  phone: '(203) 555-0341', email: 'anne.t@email.com',   town: 'Ridgefield',    service_interest: 'recurring', frequency: 'weekly',   bedrooms: 5, bathrooms: 4, notes: 'Large estate.',                       status: 'booked',    quoted_amount: 280,  source: 'referral', converted_client_id: 'c7',  created_at: '2025-04-15' },
    { id: 'l5', first_name: 'Mike',     last_name: 'Shaw',    phone: '(203) 555-0412', email: 'mike.s@email.com',   town: 'Brookfield',    service_interest: 'deep',      frequency: 'once',     bedrooms: 3, bathrooms: 2, notes: '',                                    status: 'contacted', quoted_amount: null, source: 'website',  converted_client_id: null,  created_at: '2025-04-14' },
    { id: 'l6', first_name: 'Jennifer', last_name: 'Walsh',   phone: '(203) 555-0487', email: 'jen.w@email.com',    town: 'Newtown',       service_interest: 'recurring', frequency: 'biweekly', bedrooms: 4, bathrooms: 2, notes: '2 kids, 1 dog.',                      status: 'booked',    quoted_amount: 185,  source: 'referral', converted_client_id: 'c6',  created_at: '2025-04-12' },
    { id: 'l7', first_name: 'Paul',     last_name: 'Daniels', phone: '(203) 555-0498', email: 'paul.d@email.com',   town: 'Bethel',        service_interest: 'standard',  frequency: 'once',     bedrooms: 2, bathrooms: 1, notes: 'No response after two attempts.',     status: 'lost',      quoted_amount: null, source: 'website',  converted_client_id: null,  created_at: '2025-04-10' }
  ],

  /* jobs ─ scheduled or completed cleans */
  jobs: [
    { id: 'j441', client_id: 'c1', service_type: 'recurring', scheduled_date: '2025-04-18', duration_minutes: 135, price: 175, status: 'completed', notes: '',                    miles_driven: 18, vehicle: 'Honda CR-V' },
    { id: 'j440', client_id: 'c2', service_type: 'deep',      scheduled_date: '2025-04-18', duration_minutes: 240, price: 320, status: 'completed', notes: 'First deep clean.',   miles_driven: 14, vehicle: 'Ford Transit' },
    { id: 'j439', client_id: 'c3', service_type: 'recurring', scheduled_date: '2025-04-17', duration_minutes: 150, price: 185, status: 'completed', notes: '',                    miles_driven: 22, vehicle: 'Honda CR-V' },
    { id: 'j438', client_id: 'c4', service_type: 'move_out',  scheduled_date: '2025-04-17', duration_minutes: 300, price: 385, status: 'completed', notes: 'Rental handoff.',     miles_driven: 8,  vehicle: 'Ford Transit' },
    { id: 'j437', client_id: 'c5', service_type: 'recurring', scheduled_date: '2025-04-16', duration_minutes: 330, price: 480, status: 'completed', notes: 'Monthly deep.',       miles_driven: 32, vehicle: 'Ford Transit' },
    { id: 'j442', client_id: 'c6', service_type: 'standard',  scheduled_date: '2025-04-19', duration_minutes: null, price: 155, status: 'scheduled', notes: '',                    miles_driven: null, vehicle: 'Honda CR-V' },
    { id: 'j443', client_id: null, service_type: 'deep',      scheduled_date: '2025-04-22', duration_minutes: null, price: 375, status: 'scheduled', notes: 'Pending confirm (lead l1).', miles_driven: null, vehicle: null }
  ],

  /* job_workers ─ join table: which workers did which job, hours, pay */
  job_workers: [
    { id: 'jw1',  job_id: 'j441', worker_id: 'w1', hours: 2.25, pay_rate: 40, pay_total: 90 },
    { id: 'jw2',  job_id: 'j441', worker_id: 'w3', hours: 2.25, pay_rate: 25, pay_total: 56.25 },
    { id: 'jw3',  job_id: 'j440', worker_id: 'w2', hours: 4,    pay_rate: 40, pay_total: 160 },
    { id: 'jw4',  job_id: 'j440', worker_id: 'w3', hours: 4,    pay_rate: 25, pay_total: 100 },
    { id: 'jw5',  job_id: 'j439', worker_id: 'w1', hours: 2.5,  pay_rate: 40, pay_total: 100 },
    { id: 'jw6',  job_id: 'j439', worker_id: 'w3', hours: 2.5,  pay_rate: 25, pay_total: 62.5 },
    { id: 'jw7',  job_id: 'j438', worker_id: 'w2', hours: 5,    pay_rate: 40, pay_total: 200 },
    { id: 'jw8',  job_id: 'j438', worker_id: 'w1', hours: 5,    pay_rate: 40, pay_total: 200 },
    { id: 'jw9',  job_id: 'j437', worker_id: 'w2', hours: 5.5,  pay_rate: 40, pay_total: 220 },
    { id: 'jw10', job_id: 'j437', worker_id: 'w3', hours: 5.5,  pay_rate: 25, pay_total: 137.5 },
    { id: 'jw11', job_id: 'j437', worker_id: 'w4', hours: 5.5,  pay_rate: 28, pay_total: 154 }
  ],

  /* expenses ─ every business cost, with category */
  expenses: [
    { id: 'e1', date: '2025-04-15', category: 'supplies',  description: 'Cleaning products restock — Costco',    amount: 198, payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null },
    { id: 'e2', date: '2025-04-12', category: 'gas',       description: 'Maria vehicle — weekly fill',           amount: 62,  payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null },
    { id: 'e3', date: '2025-04-12', category: 'gas',       description: 'Carlos vehicle — weekly fill',          amount: 58,  payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null },
    { id: 'e4', date: '2025-04-10', category: 'insurance', description: 'Monthly liability premium',             amount: 150, payment_method: 'auto_pay',      receipt_status: 'saved',   related_job_id: null },
    { id: 'e5', date: '2025-04-08', category: 'supplies',  description: 'Microfiber cloths, mop heads',          amount: 87,  payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null },
    { id: 'e6', date: '2025-04-05', category: 'marketing', description: 'Google Business profile boost',         amount: 100, payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null },
    { id: 'e7', date: '2025-04-03', category: 'gas',       description: 'Maria vehicle — weekly fill',           amount: 55,  payment_method: 'business_card', receipt_status: 'pending', related_job_id: null },
    { id: 'e8', date: '2025-04-02', category: 'supplies',  description: 'Eco cleaning solution — bulk order',    amount: 140, payment_method: 'business_card', receipt_status: 'saved',   related_job_id: null }
  ],

  /* gas_logs ─ each fill-up (feeds the Gas Tracker view) */
  gas_logs: [
    { id: 'g1', date: '2025-04-15', vehicle: 'Honda CR-V',   driver_id: 'w1', station: 'Shell – Danbury',      gallons: 14.2, price_per_gallon: 3.42, total_cost: 48.56, odometer: 48231, receipt_status: 'saved' },
    { id: 'g2', date: '2025-04-12', vehicle: 'Ford Transit', driver_id: 'w2', station: 'BP – Newtown Rd',      gallons: 16.8, price_per_gallon: 3.44, total_cost: 57.79, odometer: 31445, receipt_status: 'saved' },
    { id: 'g3', date: '2025-04-08', vehicle: 'Honda CR-V',   driver_id: 'w1', station: 'Citgo – Federal Rd',   gallons: 13.9, price_per_gallon: 3.38, total_cost: 47.00, odometer: 47890, receipt_status: 'saved' },
    { id: 'g4', date: '2025-04-03', vehicle: 'Honda CR-V',   driver_id: 'w1', station: 'Shell – Danbury',      gallons: 6.4,  price_per_gallon: 3.40, total_cost: 21.76, odometer: 47540, receipt_status: 'pending' },
    { id: 'g5', date: '2025-04-02', vehicle: 'Ford Transit', driver_id: 'w2', station: 'Gulf – Brookfield',    gallons: 10.1, price_per_gallon: 3.45, total_cost: 34.85, odometer: 31102, receipt_status: 'saved' }
  ]
};

/* Reference date used by the dashboard for "today" calculations.
   Set here so the mock UI shows a deterministic snapshot.
   Replace with `new Date().toISOString().slice(0,10)` when using live data. */
const REFERENCE_TODAY = '2025-04-18';
