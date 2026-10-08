const form = document.getElementById('checkout-form');

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

function normalizeDigits(value) {
  return String(value).replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit));
}

const booking = readStored('mehryar-booking');
const profile = readStored('mehryar-profile');
const clinicName = document.getElementById('clinic-name');
const bookingTime = document.getElementById('booking-time');

if (booking.clinic) clinicName.textContent = booking.clinic;
if (booking.time) bookingTime.textContent = booking.time;
['fullName', 'mobile', 'nationalId', 'birthDate'].forEach((name) => {
  if (profile[name]) form.elements[name].value = profile[name];
});

let selectedGateway = 'پرداخت امن شاپرک';
document.querySelectorAll('[data-gateway]').forEach((gateway) => gateway.addEventListener('click', () => {
  document.querySelectorAll('[data-gateway]').forEach((item) => item.classList.toggle('active', item === gateway));
  selectedGateway = gateway.dataset.gateway;
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const mobile = normalizeDigits(data.mobile);
  const nationalId = normalizeDigits(data.nationalId);
  if (!/^09\d{9}$/.test(mobile)) { document.getElementById('patient-mobile').setCustomValidity('شماره همراه را با ۱۱ رقم وارد کنید.'); form.reportValidity(); return; }
  if (!/^\d{10}$/.test(nationalId)) { document.getElementById('patient-national-id').setCustomValidity('کد ملی باید ۱۰ رقم باشد.'); form.reportValidity(); return; }
  document.getElementById('patient-mobile').setCustomValidity('');
  document.getElementById('patient-national-id').setCustomValidity('');
  const appointment = { clinic: booking.clinic || 'کلینیک مهریار', time: booking.time || 'زمان انتخاب نشده', fullName: data.fullName.trim(), mobile, nationalId, birthDate: data.birthDate.trim(), note: data.note.trim(), gateway: selectedGateway, status: 'requested' };
  localStorage.setItem('mehryar-appointment', JSON.stringify(appointment));
  localStorage.setItem('mehryar-profile', JSON.stringify({ fullName: appointment.fullName, mobile: appointment.mobile, nationalId: appointment.nationalId, birthDate: appointment.birthDate }));
  document.getElementById('success-summary').textContent = `${appointment.fullName}، درخواست نوبت شما برای ${appointment.clinic} در ساعت ${appointment.time} ثبت شد. درگاه انتخابی: ${appointment.gateway}.`;
  document.getElementById('success').hidden = false;
});

['patient-mobile', 'patient-national-id'].forEach((id) => document.getElementById(id).addEventListener('input', (event) => event.currentTarget.setCustomValidity('')));
