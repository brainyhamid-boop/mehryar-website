const filterToggle = document.querySelector('[data-filter-toggle]');
const doctorFilters = document.querySelector('.doctor-filters');
const doctorCards = [...document.querySelectorAll('.doctor-card')];
let showingAllDoctors = false;

function applyHomeDoctorFilter(filter) {
  doctorCards.forEach((card, index) => {
    const matchesCity = filter === 'all' || filter === 'week' || card.dataset.city === filter;
    const matchesAvailability = filter !== 'week' || card.dataset.availability.includes('week');
    card.hidden = !matchesCity || !matchesAvailability || (!showingAllDoctors && index > 4);
  });
}

filterToggle.addEventListener('click', () => {
  const isHidden = doctorFilters.hidden;
  doctorFilters.hidden = !isHidden;
  filterToggle.querySelector('b').textContent = isHidden ? '⌃' : '⌄';
});

document.querySelectorAll('[data-home-filter]').forEach((filter) => filter.addEventListener('click', () => {
  document.querySelectorAll('[data-home-filter]').forEach((item) => item.classList.toggle('active', item === filter));
  showingAllDoctors = true;
  applyHomeDoctorFilter(filter.dataset.homeFilter);
  document.querySelector('[data-show-doctors]').hidden = true;
}));

document.querySelector('[data-show-doctors]').addEventListener('click', (event) => {
  showingAllDoctors = true;
  applyHomeDoctorFilter(document.querySelector('[data-home-filter].active').dataset.homeFilter);
  event.currentTarget.hidden = true;
});

document.querySelectorAll('[data-appointment]').forEach((button) => button.addEventListener('click', () => { window.location.href = 'clinics.html'; }));
document.querySelectorAll('[data-course]').forEach((button) => button.addEventListener('click', () => { window.location.href = 'courses.html'; }));

document.getElementById('site-search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('site-search-input').value.trim().toLowerCase();
  if (!query) return;
  const destination = /دوره|آموزش|یادگیری/.test(query) ? 'courses.html' : /پزشک|کلینیک|نوبت|مطب/.test(query) ? 'clinics.html' : `chat.html?query=${encodeURIComponent(query)}`;
  window.location.href = destination;
});

const homeChatForm = document.getElementById('home-chat-form');
const homeChatInput = document.getElementById('home-chat-input');
const homeChatMessages = document.getElementById('home-chat-messages');

function addHomeChatMessage(text, role) {
  const message = document.createElement('article');
  const bubble = document.createElement('div');
  message.className = role === 'user' ? 'home-user-message' : 'home-bot-message';
  bubble.textContent = text;
  if (role === 'assistant') {
    const avatar = document.createElement('span');
    const note = document.createElement('small');
    avatar.textContent = '⌁';
    note.textContent = 'راهنمایی، نه تشخیص یا تجویز';
    bubble.append(note);
    message.append(avatar);
  }
  message.append(bubble);
  homeChatMessages.append(message);
  homeChatMessages.scrollTop = homeChatMessages.scrollHeight;
}

function respondInHomeChat(text) {
  const message = text.trim();
  if (!message) return;
  addHomeChatMessage(message, 'user');
  homeChatInput.value = '';
  window.setTimeout(() => addHomeChatMessage('برای بررسی دقیق‌تر و دریافت مسیر پیشنهادی، گفت‌وگوی کامل راهنمای مهریار را باز کنید.', 'assistant'), 220);
}

homeChatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  respondInHomeChat(homeChatInput.value);
});

document.querySelectorAll('[data-home-prompt]').forEach((button) => button.addEventListener('click', () => respondInHomeChat(button.dataset.homePrompt)));

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
  menuButton.textContent = open ? '×' : '☰';
});
