const cityFilter = document.getElementById('city-filter');
const cards = [...document.querySelectorAll('.clinic-card')];
const count = document.getElementById('result-count');
const title = document.getElementById('summary-title');
const clinic = document.getElementById('summary-clinic');
const time = document.getElementById('summary-time');
const continueButton = document.getElementById('continue-booking');
let selectedSlot;

function filterCards() {
  const city = cityFilter.value;
  let visible = 0;
  cards.forEach((card) => {
    const show = city === 'all' || card.dataset.city === city;
    card.hidden = !show;
    if (show) visible += 1;
  });
  count.textContent = `${visible} پزشک همکار`;
}

cityFilter.addEventListener('change', filterCards);
document.getElementById('clear-filters').addEventListener('click', () => { cityFilter.value = 'all'; filterCards(); });

document.querySelectorAll('[data-slot]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-slot]').forEach((item) => item.classList.toggle('active', item === button));
  selectedSlot = button.dataset.slot;
  const card = button.closest('.clinic-card');
  clinic.textContent = card.querySelector('.clinic-info p').textContent;
  time.textContent = selectedSlot;
  title.textContent = 'نوبت شما آمادهٔ ادامه است';
  continueButton.disabled = false;
}));

document.querySelectorAll('[data-book]').forEach((button) => button.addEventListener('click', () => {
  button.closest('.clinic-card').querySelector('[data-slot]')?.click();
}));

const bookingStatus = document.getElementById('booking-status');

continueButton.addEventListener('click', () => {
  const booking = { clinic: clinic.textContent, time: time.textContent };
  localStorage.setItem('mehryar-booking', JSON.stringify(booking));
  window.location.href = 'checkout.html';
});
