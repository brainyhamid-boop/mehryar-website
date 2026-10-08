const cityFilter = document.getElementById('city-filter');
const centerFilter = document.getElementById('center-filter');
const cards = [...document.querySelectorAll('.clinic-card')];
const grid = document.getElementById('clinic-grid');
const count = document.getElementById('result-count');
const title = document.getElementById('summary-title');
const clinic = document.getElementById('summary-clinic');
const time = document.getElementById('summary-time');
const continueButton = document.getElementById('continue-booking');
const bookingStatus = document.getElementById('booking-status');
let selectedSlot;

function selectedFilters(selector, key) {
  return [...document.querySelectorAll(selector)].filter((input) => input.checked).map((input) => input.dataset[key]);
}

function hasAny(value, filters) {
  return filters.length === 0 || filters.some((filter) => value.split(' ').includes(filter));
}

function filterCards() {
  const days = selectedFilters('[data-day-filter]', 'dayFilter');
  const types = selectedFilters('[data-type-filter]', 'typeFilter');
  let visible = 0;
  cards.forEach((card) => {
    const show = (cityFilter.value === 'all' || card.dataset.city === cityFilter.value)
      && (centerFilter.value === 'all' || card.dataset.center === centerFilter.value)
      && hasAny(card.dataset.day, days)
      && hasAny(card.dataset.type, types);
    card.hidden = !show;
    if (show) visible += 1;
  });
  count.textContent = visible ? `${visible} پزشک همکار` : 'پزشکی با این فیلتر یافت نشد';
}

cityFilter.addEventListener('change', filterCards);
centerFilter.addEventListener('change', filterCards);
document.querySelectorAll('[data-day-filter], [data-type-filter]').forEach((input) => input.addEventListener('change', filterCards));
document.getElementById('clear-filters').addEventListener('click', () => {
  cityFilter.value = 'all';
  centerFilter.value = 'all';
  document.querySelectorAll('[data-day-filter], [data-type-filter]').forEach((input) => { input.checked = false; });
  filterCards();
});

document.getElementById('sort-results').addEventListener('click', (event) => {
  const descending = event.currentTarget.getAttribute('aria-pressed') === 'true';
  cards.sort((a, b) => {
    const first = a.querySelector('[data-slot]').dataset.slot;
    const second = b.querySelector('[data-slot]').dataset.slot;
    return (first > second ? 1 : -1) * (descending ? -1 : 1);
  }).forEach((card) => grid.append(card));
  event.currentTarget.setAttribute('aria-pressed', String(!descending));
  event.currentTarget.textContent = descending ? 'نزدیک‌ترین زمان ↕' : 'دیرترین زمان ↕';
});

document.querySelectorAll('[data-slot]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-slot]').forEach((item) => item.classList.toggle('active', item === button));
  selectedSlot = button.dataset.slot;
  const card = button.closest('.clinic-card');
  clinic.textContent = card.querySelector('.clinic-info p').textContent;
  time.textContent = selectedSlot;
  title.textContent = 'نوبت شما آمادهٔ ادامه است';
  bookingStatus.textContent = 'زمان انتخاب شد؛ اطلاعات مراجعه‌کننده را در گام بعدی وارد کنید.';
  continueButton.disabled = false;
}));

document.querySelectorAll('[data-book]').forEach((button) => button.addEventListener('click', () => {
  button.closest('.clinic-card').querySelector('[data-slot]')?.click();
}));

continueButton.addEventListener('click', () => {
  if (!selectedSlot) return;
  localStorage.setItem('mehryar-booking', JSON.stringify({ clinic: clinic.textContent, time: time.textContent }));
  window.location.href = 'checkout.html';
});
