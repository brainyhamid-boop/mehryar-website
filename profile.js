const form = document.getElementById('profile-form');
const status = document.getElementById('profile-status');
const fields = ['fullName', 'mobile', 'nationalId', 'birthDate'];

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

function normalizeDigits(value) {
  return value.replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit));
}

const profile = readStored('mehryar-profile');
fields.forEach((name) => { if (profile[name]) form.elements[name].value = profile[name]; });

const appointment = readStored('mehryar-appointment');
if (appointment.fullName) {
  document.getElementById('appointment-title').textContent = 'درخواست نوبت شما ثبت شده';
  document.getElementById('appointment-details').innerHTML = `<span>${appointment.clinic}</span><strong>${appointment.time}</strong><span>${appointment.fullName} · ${appointment.mobile}</span>`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const mobile = normalizeDigits(data.mobile);
  const nationalId = normalizeDigits(data.nationalId);
  if (!/^09\d{9}$/.test(mobile)) { status.textContent = 'شماره همراه را با ۱۱ رقم وارد کنید.'; return; }
  if (nationalId && !/^\d{10}$/.test(nationalId)) { status.textContent = 'کد ملی باید ۱۰ رقم باشد.'; return; }
  localStorage.setItem('mehryar-profile', JSON.stringify({ ...data, mobile, nationalId }));
  status.textContent = 'اطلاعات شما در این مرورگر ذخیره شد.';
});
