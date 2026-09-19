/* ==========================================================================
   ClinicDesk — Application Logic
   Demonstration project only — not a real medical records platform.
   All data is persisted to localStorage. No backend required.
   ========================================================================== */

const STORAGE_KEY = 'clinicdesk_data_v1';

function buildDemoData() {
  const today = new Date();
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const monthsAgo = (n) => { const d = new Date(today); d.setMonth(d.getMonth() - n); return d.toISOString().slice(0, 10); };
  const todayStr = today.toISOString().slice(0, 10);

  const doctors = [
    { id: 'DOC-001', name: 'Dr. Patricia Lim', specialization: 'Family Medicine', schedule: 'Mon–Fri, 9:00 AM–5:00 PM', status: 'Available' },
    { id: 'DOC-002', name: 'Dr. Andres Molina', specialization: 'Pediatrics', schedule: 'Mon, Wed, Fri, 8:00 AM–2:00 PM', status: 'Available' },
    { id: 'DOC-003', name: 'Dr. Sofia Reyes', specialization: 'Dermatology', schedule: 'Tue, Thu, 10:00 AM–6:00 PM', status: 'On Leave' },
    { id: 'DOC-004', name: 'Dr. Michael Tan', specialization: 'Internal Medicine', schedule: 'Mon–Sat, 1:00 PM–7:00 PM', status: 'Available' },
  ];

  const patients = [
    { id: 'PT-0001', name: 'Lorenzo Aguilar', age: 34, phone: '0917 555 0142', email: 'lorenzo.aguilar@email.com', registered: monthsAgo(11) },
    { id: 'PT-0002', name: 'Bianca Castillo', age: 28, phone: '0928 441 7720', email: 'bianca.castillo@email.com', registered: monthsAgo(6) },
    { id: 'PT-0003', name: 'Emilio Navarro', age: 52, phone: '0939 210 5588', email: 'emilio.navarro@email.com', registered: monthsAgo(20) },
    { id: 'PT-0004', name: 'Grace Ocampo', age: 7, phone: '0906 774 3312', email: 'parent.ocampo@email.com', registered: monthsAgo(3) },
    { id: 'PT-0005', name: 'Rafael Uy', age: 45, phone: '0915 322 9981', email: 'rafael.uy@email.com', registered: monthsAgo(1) },
    { id: 'PT-0006', name: 'Nadia Fernandez', age: 61, phone: '0922 118 4470', email: 'nadia.fernandez@email.com', registered: monthsAgo(15) },
  ];

  const appointments = [
    { id: 'APT-001', patientId: 'PT-0001', doctorId: 'DOC-001', date: todayStr, time: '09:30', reason: 'Annual physical exam', status: 'Confirmed' },
    { id: 'APT-002', patientId: 'PT-0004', doctorId: 'DOC-002', date: todayStr, time: '10:15', reason: 'Vaccination follow-up', status: 'Scheduled' },
    { id: 'APT-003', patientId: 'PT-0003', doctorId: 'DOC-004', date: todayStr, time: '14:00', reason: 'Persistent cough', status: 'Scheduled' },
    { id: 'APT-004', patientId: 'PT-0002', doctorId: 'DOC-001', date: addDays(1), time: '11:00', reason: 'Skin rash consultation', status: 'Scheduled' },
    { id: 'APT-005', patientId: 'PT-0005', doctorId: 'DOC-004', date: addDays(2), time: '15:30', reason: 'Blood pressure check', status: 'Scheduled' },
    { id: 'APT-006', patientId: 'PT-0006', doctorId: 'DOC-001', date: addDays(-3), time: '09:00', reason: 'Diabetes management', status: 'Completed' },
    { id: 'APT-007', patientId: 'PT-0001', doctorId: 'DOC-004', date: addDays(-7), time: '13:30', reason: 'Flu symptoms', status: 'Completed' },
    { id: 'APT-008', patientId: 'PT-0002', doctorId: 'DOC-003', date: addDays(-1), time: '10:45', reason: 'Acne treatment', status: 'Cancelled' },
  ];

  return { doctors, patients, appointments };
}

let db = loadData();

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) {} }
  const demo = buildDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

/* ---------------------------------------------------------------------- *
 * Utilities
 * ---------------------------------------------------------------------- */
function todayISO() { return new Date().toISOString().slice(0, 10); }
function formatDate(iso) { if (!iso) return '—'; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function formatTime(t) { if (!t) return '—'; const [h, m] = t.split(':'); const hour = parseInt(h, 10); const ampm = hour >= 12 ? 'PM' : 'AM'; const h12 = hour % 12 || 12; return `${h12}:${m} ${ampm}`; }
function generateId(prefix, list, pad = 3) { let max = 0; list.forEach(item => { const n = parseInt(item.id.split('-')[1], 10); if (!isNaN(n) && n > max) max = n; }); return `${prefix}-${String(max + 1).padStart(pad, '0')}`; }
function initials(name) { return name.replace('Dr. ', '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join(''); }
function patientById(id) { return db.patients.find(p => p.id === id); }
function doctorById(id) { return db.doctors.find(d => d.id === id); }
function apptStatusBadge(s) {
  if (s === 'Completed') return 'badge-green';
  if (s === 'Confirmed') return 'badge-blue';
  if (s === 'Cancelled') return 'badge-red';
  return 'badge-amber'; // Scheduled
}
function doctorStatusBadge(s) { return s === 'Available' ? 'badge-green' : s === 'On Leave' ? 'badge-amber' : 'badge-slate'; }

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5m0-3h.01"/></svg>'
  };
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 200); }, 3200);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); }));

let confirmAction = null;
function askConfirm(title, text, actionLabel, onConfirm) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalText').textContent = text;
  document.getElementById('confirmModalActionBtn').textContent = actionLabel;
  confirmAction = onConfirm;
  openModal('confirmModalOverlay');
}
document.getElementById('confirmModalActionBtn').addEventListener('click', () => { if (confirmAction) confirmAction(); closeModal('confirmModalOverlay'); });

/* ---------------------------------------------------------------------- *
 * Navigation
 * ---------------------------------------------------------------------- */
const pageMeta = {
  dashboard: ['Dashboard', "Today's clinic overview"],
  appointments: ['Appointments', 'Schedule and manage patient visits'],
  patients: ['Patients', 'Manage patient records'],
  doctors: ['Doctors', 'Manage doctor profiles and schedules'],
};
function switchView(view) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  document.getElementById('pageTitle').textContent = pageMeta[view][0];
  document.getElementById('pageSubtitle').textContent = pageMeta[view][1];
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
  renderAll();
}
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
document.getElementById('goToday').addEventListener('click', () => {
  switchView('appointments');
  document.getElementById('apptDateFilter').value = todayISO();
  renderAppointments();
});
document.getElementById('menuToggle').addEventListener('click', () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('scrim').classList.add('open'); });
document.getElementById('scrim').addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); });
document.getElementById('globalSearch').addEventListener('input', (e) => {
  const value = e.target.value;
  switchView('patients');
  document.getElementById('patientSearch').value = value;
  renderPatients();
});

/* ---------------------------------------------------------------------- *
 * Dashboard
 * ---------------------------------------------------------------------- */
function renderDashboard() {
  const today = todayISO();
  const todays = db.appointments.filter(a => a.date === today && a.status !== 'Cancelled');
  const upcoming = db.appointments.filter(a => a.date > today && a.status !== 'Cancelled');
  const completed = db.appointments.filter(a => a.status === 'Completed');
  const availableDoctors = db.doctors.filter(d => d.status === 'Available');

  document.getElementById('statTotalPatients').textContent = db.patients.length;
  document.getElementById('statTodayAppts').textContent = todays.length;
  document.getElementById('statUpcomingAppts').textContent = upcoming.length;
  document.getElementById('statCompletedVisits').textContent = completed.length;
  document.getElementById('statAvailableDoctors').textContent = availableDoctors.length;

  const sortedToday = [...todays].sort((a, b) => a.time.localeCompare(b.time));
  const list = document.getElementById('todayAppointmentsList');
  list.innerHTML = '';
  document.getElementById('todayAppointmentsEmpty').hidden = sortedToday.length > 0;
  sortedToday.forEach(a => {
    const patient = patientById(a.patientId);
    const doctor = doctorById(a.doctorId);
    const row = document.createElement('div');
    row.className = 'appt-row';
    row.innerHTML = `
      <div class="appt-time"><strong>${formatTime(a.time)}</strong></div>
      <div class="info"><h4>${patient ? patient.name : 'Unknown Patient'}</h4><span>${doctor ? doctor.name : 'Unknown Doctor'} · ${a.reason}</span></div>
      <span class="badge ${apptStatusBadge(a.status)}"><span class="badge-dot"></span>${a.status}</span>`;
    list.appendChild(row);
  });

  const onDuty = document.getElementById('doctorsOnDuty');
  onDuty.innerHTML = db.doctors.map(d => `
    <div class="doctor-mini">
      <div class="doc-avatar">${initials(d.name)}</div>
      <div class="info"><h4>${d.name}</h4><span>${d.specialization}</span></div>
      <span class="badge ${doctorStatusBadge(d.status)}"><span class="badge-dot"></span>${d.status}</span>
    </div>`).join('') || '<p style="color:var(--slate-500);font-size:13px;">No doctors added yet.</p>';
}

/* ---------------------------------------------------------------------- *
 * Appointments view
 * ---------------------------------------------------------------------- */
function populateApptDoctorFilter() {
  const select = document.getElementById('apptDoctorFilter');
  const current = select.value;
  select.innerHTML = '<option value="">All Doctors</option>' + db.doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  select.value = current;
}
function populateApptFormSelects() {
  document.getElementById('appointmentPatient').innerHTML = db.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  document.getElementById('appointmentDoctor').innerHTML = db.doctors.map(d => `<option value="${d.id}">${d.name} — ${d.specialization}</option>`).join('');
}

function renderAppointments() {
  populateApptDoctorFilter();
  const doctorFilter = document.getElementById('apptDoctorFilter').value;
  const statusFilter = document.getElementById('apptStatusFilter').value;
  const dateFilter = document.getElementById('apptDateFilter').value;

  let list = db.appointments.filter(a => {
    return (!doctorFilter || a.doctorId === doctorFilter) &&
           (!statusFilter || a.status === statusFilter) &&
           (!dateFilter || a.date === dateFilter);
  });
  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const body = document.getElementById('appointmentsBody');
  body.innerHTML = '';
  document.getElementById('appointmentsEmpty').hidden = list.length > 0;

  list.forEach(a => {
    const patient = patientById(a.patientId);
    const doctor = doctorById(a.doctorId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cell-strong">${patient ? patient.name : 'Unknown Patient'}</td>
      <td>${doctor ? doctor.name : 'Unknown Doctor'}</td>
      <td>${formatDate(a.date)}</td>
      <td>${formatTime(a.time)}</td>
      <td>${a.reason}</td>
      <td><span class="badge ${apptStatusBadge(a.status)}"><span class="badge-dot"></span>${a.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" title="Edit" data-action="edit-appt" data-id="${a.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          ${a.status !== 'Cancelled' && a.status !== 'Completed' ? `<button class="icon-btn danger" title="Cancel" data-action="cancel-appt" data-id="${a.id}"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6m0-6l-6 6"/></svg></button>` : ''}
          <button class="icon-btn danger" title="Delete" data-action="delete-appt" data-id="${a.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
        </div>
      </td>`;
    body.appendChild(tr);
  });
}
document.getElementById('apptDoctorFilter').addEventListener('change', renderAppointments);
document.getElementById('apptStatusFilter').addEventListener('change', renderAppointments);
document.getElementById('apptDateFilter').addEventListener('change', renderAppointments);
document.getElementById('clearDateFilter').addEventListener('click', () => { document.getElementById('apptDateFilter').value = ''; renderAppointments(); });

document.getElementById('appointmentsBody').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const appt = db.appointments.find(a => a.id === id);
  if (btn.dataset.action === 'edit-appt') openAppointmentModal(appt);
  if (btn.dataset.action === 'cancel-appt') {
    askConfirm('Cancel appointment?', 'The appointment will be marked as cancelled.', 'Cancel Appointment', () => {
      appt.status = 'Cancelled';
      saveData(); renderAll();
      showToast('Appointment cancelled', 'success');
    });
  }
  if (btn.dataset.action === 'delete-appt') {
    askConfirm('Delete appointment?', 'This appointment record will be permanently removed.', 'Delete', () => {
      db.appointments = db.appointments.filter(a => a.id !== id);
      saveData(); renderAll();
      showToast('Appointment deleted', 'success');
    });
  }
});

function openAppointmentModal(appt) {
  populateApptFormSelects();
  document.getElementById('appointmentForm').reset();
  const title = document.getElementById('appointmentModalTitle');
  const submitBtn = document.getElementById('appointmentSubmitBtn');
  if (appt) {
    title.textContent = 'Edit Appointment'; submitBtn.textContent = 'Save Changes';
    document.getElementById('appointmentId').value = appt.id;
    document.getElementById('appointmentPatient').value = appt.patientId;
    document.getElementById('appointmentDoctor').value = appt.doctorId;
    document.getElementById('appointmentDate').value = appt.date;
    document.getElementById('appointmentTime').value = appt.time;
    document.getElementById('appointmentReason').value = appt.reason;
    document.getElementById('appointmentStatus').value = appt.status;
  } else {
    title.textContent = 'Add Appointment'; submitBtn.textContent = 'Add Appointment';
    document.getElementById('appointmentId').value = '';
    document.getElementById('appointmentDate').value = todayISO();
  }
  openModal('appointmentModalOverlay');
}
document.getElementById('addAppointmentBtn').addEventListener('click', () => {
  if (db.patients.length === 0) { showToast('Add a patient first', 'error'); return; }
  if (db.doctors.length === 0) { showToast('Add a doctor first', 'error'); return; }
  openAppointmentModal(null);
});

document.getElementById('appointmentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('appointmentId').value;
  const data = {
    patientId: document.getElementById('appointmentPatient').value,
    doctorId: document.getElementById('appointmentDoctor').value,
    date: document.getElementById('appointmentDate').value,
    time: document.getElementById('appointmentTime').value,
    reason: document.getElementById('appointmentReason').value.trim(),
    status: document.getElementById('appointmentStatus').value,
  };

  // Simple double-booking check
  const conflict = db.appointments.find(a =>
    a.id !== id && a.doctorId === data.doctorId && a.date === data.date && a.time === data.time && a.status !== 'Cancelled'
  );
  if (conflict) {
    showToast('This doctor already has an appointment at that date and time', 'error');
    return;
  }

  if (id) { Object.assign(db.appointments.find(a => a.id === id), data); showToast('Appointment updated', 'success'); }
  else { db.appointments.push({ id: generateId('APT', db.appointments), ...data }); showToast('Appointment scheduled', 'success'); }
  saveData(); closeModal('appointmentModalOverlay'); renderAll();
});

/* ---------------------------------------------------------------------- *
 * Patients view
 * ---------------------------------------------------------------------- */
function renderPatients() {
  const search = document.getElementById('patientSearch').value.trim().toLowerCase();
  const list = db.patients.filter(p => !search || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search));
  const body = document.getElementById('patientsBody');
  body.innerHTML = '';
  document.getElementById('patientsEmpty').hidden = list.length > 0;

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cell-strong">${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.phone}</td>
      <td>${p.email}</td>
      <td>${formatDate(p.registered)}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" title="Edit" data-action="edit-patient" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          <button class="icon-btn danger" title="Delete" data-action="delete-patient" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
        </div>
      </td>`;
    body.appendChild(tr);
  });
}
document.getElementById('patientSearch').addEventListener('input', renderPatients);

document.getElementById('patientsBody').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const patient = patientById(id);
  if (btn.dataset.action === 'edit-patient') openPatientModal(patient);
  if (btn.dataset.action === 'delete-patient') {
    const hasAppts = db.appointments.some(a => a.patientId === id);
    askConfirm('Delete patient?', hasAppts ? `"${patient.name}" has existing appointments which will remain but show as an unknown patient.` : `"${patient.name}" will be permanently removed.`, 'Delete', () => {
      db.patients = db.patients.filter(p => p.id !== id);
      saveData(); renderAll();
      showToast('Patient deleted', 'success');
    });
  }
});

function openPatientModal(patient) {
  document.getElementById('patientForm').reset();
  const title = document.getElementById('patientModalTitle');
  const submitBtn = document.getElementById('patientSubmitBtn');
  if (patient) {
    title.textContent = 'Edit Patient'; submitBtn.textContent = 'Save Changes';
    document.getElementById('patientId').value = patient.id;
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = patient.age;
    document.getElementById('patientPhone').value = patient.phone;
    document.getElementById('patientEmail').value = patient.email;
  } else {
    title.textContent = 'Add Patient'; submitBtn.textContent = 'Add Patient';
    document.getElementById('patientId').value = '';
  }
  openModal('patientModalOverlay');
}
document.getElementById('addPatientBtn').addEventListener('click', () => openPatientModal(null));

document.getElementById('patientForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('patientId').value;
  const data = {
    name: document.getElementById('patientName').value.trim(),
    age: parseInt(document.getElementById('patientAge').value, 10),
    phone: document.getElementById('patientPhone').value.trim(),
    email: document.getElementById('patientEmail').value.trim(),
  };
  if (id) { Object.assign(patientById(id), data); showToast('Patient updated', 'success'); }
  else { db.patients.push({ id: generateId('PT', db.patients, 4), ...data, registered: todayISO() }); showToast('Patient added', 'success'); }
  saveData(); closeModal('patientModalOverlay'); renderAll();
});

/* ---------------------------------------------------------------------- *
 * Doctors view
 * ---------------------------------------------------------------------- */
function renderDoctors() {
  const grid = document.getElementById('doctorsGrid');
  grid.innerHTML = '';
  document.getElementById('doctorsEmpty').hidden = db.doctors.length > 0;
  db.doctors.forEach(d => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
      <div class="doctor-card-head">
        <div class="doc-avatar-lg">${initials(d.name)}</div>
        <div><h3>${d.name}</h3><span class="spec">${d.specialization}</span></div>
      </div>
      <div class="schedule">${d.schedule}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="badge ${doctorStatusBadge(d.status)}"><span class="badge-dot"></span>${d.status}</span>
        <div class="doctor-card-actions">
          <button class="icon-btn" title="Edit" data-action="edit-doctor" data-id="${d.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          <button class="icon-btn danger" title="Delete" data-action="delete-doctor" data-id="${d.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

document.getElementById('doctorsGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const doctor = doctorById(id);
  if (btn.dataset.action === 'edit-doctor') openDoctorModal(doctor);
  if (btn.dataset.action === 'delete-doctor') {
    const hasAppts = db.appointments.some(a => a.doctorId === id && a.status !== 'Cancelled' && a.status !== 'Completed');
    if (hasAppts) { showToast('Cannot delete — doctor has active appointments', 'error'); return; }
    askConfirm('Delete doctor?', `"${doctor.name}" will be permanently removed.`, 'Delete', () => {
      db.doctors = db.doctors.filter(d => d.id !== id);
      saveData(); renderAll();
      showToast('Doctor deleted', 'success');
    });
  }
});

function openDoctorModal(doctor) {
  document.getElementById('doctorForm').reset();
  const title = document.getElementById('doctorModalTitle');
  const submitBtn = document.getElementById('doctorSubmitBtn');
  if (doctor) {
    title.textContent = 'Edit Doctor'; submitBtn.textContent = 'Save Changes';
    document.getElementById('doctorId').value = doctor.id;
    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorSpecialization').value = doctor.specialization;
    document.getElementById('doctorSchedule').value = doctor.schedule;
    document.getElementById('doctorStatus').value = doctor.status;
  } else {
    title.textContent = 'Add Doctor'; submitBtn.textContent = 'Add Doctor';
    document.getElementById('doctorId').value = '';
  }
  openModal('doctorModalOverlay');
}
document.getElementById('addDoctorBtn').addEventListener('click', () => openDoctorModal(null));

document.getElementById('doctorForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('doctorId').value;
  const data = {
    name: document.getElementById('doctorName').value.trim(),
    specialization: document.getElementById('doctorSpecialization').value.trim(),
    schedule: document.getElementById('doctorSchedule').value.trim(),
    status: document.getElementById('doctorStatus').value,
  };
  if (id) { Object.assign(doctorById(id), data); showToast('Doctor updated', 'success'); }
  else { db.doctors.push({ id: generateId('DOC', db.doctors), ...data }); showToast('Doctor added', 'success'); }
  saveData(); closeModal('doctorModalOverlay'); renderAll();
});

/* ---------------------------------------------------------------------- *
 * Master render
 * ---------------------------------------------------------------------- */
function renderAll() {
  renderDashboard();
  renderAppointments();
  renderPatients();
  renderDoctors();
}
renderAll();
