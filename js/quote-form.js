// ─────────────────────────────────────────────
//  Joy Cleaning — Quote Form → Supabase
// ─────────────────────────────────────────────
//
//  SETUP: Replace the two values below with your
//  project credentials from:
//  https://supabase.com/dashboard/project/_/settings/api
//
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';       // e.g. https://xyzxyz.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // starts with eyJ...
// ─────────────────────────────────────────────

const form        = document.getElementById('quoteForm');
const submitBtn   = document.getElementById('submitBtn');
const formCard    = document.querySelector('.form-card');
const successCard = document.getElementById('formSuccess');
const submitError = document.getElementById('submitError');

if (!form) {
  // Not on the quote page — stop here
  throw new Error('quote-form.js loaded on a page with no #quoteForm');
}

// ── Init Supabase ──
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Clear field error on input ──
form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('has-error');
  });
  field.addEventListener('change', () => {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('has-error');
  });
});

// ── Validation ──
function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const group = field.closest('.form-group');
  const errEl = group && group.querySelector('.field-error');
  if (group)  group.classList.add('has-error');
  if (errEl)  errEl.textContent = message;
  return field;
}

function validate() {
  let valid   = true;
  let first   = null;

  const name        = document.getElementById('name').value.trim();
  const phone       = document.getElementById('phone').value.trim();
  const serviceType = document.getElementById('serviceType').value;

  if (!name) {
    const f = setError('name', 'Please enter your name.');
    if (!first) first = f;
    valid = false;
  }
  if (!phone) {
    const f = setError('phone', 'A phone number is required so we can reach you.');
    if (!first) first = f;
    valid = false;
  }
  if (!serviceType) {
    const f = setError('serviceType', 'Please select a service.');
    if (!first) first = f;
    valid = false;
  }

  // Scroll first invalid field into view
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return valid;
}

// ── Submit ──
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset all errors
  form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
  if (submitError) submitError.style.display = 'none';

  if (!validate()) return;

  // Loading state
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  const homeSize  = document.getElementById('homeSize').value;
  const rawNotes  = document.getElementById('notes').value.trim();
  const sizeLabel = { small: 'Small (1–2 bed)', medium: 'Medium (3 bed)', large: 'Large (4+ bed)' }[homeSize];
  const notes     = [sizeLabel && `Home size: ${sizeLabel}`, rawNotes].filter(Boolean).join(' — ') || null;

  const payload = {
    name:         document.getElementById('name').value.trim(),
    phone:        document.getElementById('phone').value.trim(),
    email:        document.getElementById('email').value.trim()    || null,
    service_type: document.getElementById('serviceType').value,
    notes:        notes,
    status:       'new',
  };

  const { error } = await db.from('leads').insert([payload]);

  if (error) {
    console.error('Supabase error:', error);
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send My Quote Request →';
    if (submitError) submitError.style.display = 'block';
    return;
  }

  // ── Success ──
  form.style.display = 'none';
  if (successCard) successCard.classList.add('visible');
});
