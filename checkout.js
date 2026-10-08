const booking = JSON.parse(localStorage.getItem('mehryar-booking') || '{}');
const clinicName = document.getElementById('clinic-name');
const bookingTime = document.getElementById('booking-time');
if (booking.clinic) clinicName.textContent = booking.clinic;
if (booking.time) bookingTime.textContent = booking.time;

document.querySelectorAll('[data-gateway]').forEach((gateway) => gateway.addEventListener('click', () => {
  document.querySelectorAll('[data-gateway]').forEach((item) => item.classList.toggle('active', item === gateway));
}));

document.getElementById('checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('success').hidden = false;
});
