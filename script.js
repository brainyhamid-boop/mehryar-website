const memberContent = {
  'سر': { title: 'سر و گردن', text: 'سر و گردن در دریافت، پردازش و انتقال بسیاری از نشانه‌ها نقش دارند. نشانه‌های ماندگار یا ناگهانی نیازمند توجه‌اند.', chips: ['سردرد', 'سرگیجه', 'تنش گردن', 'اختلال خواب'] },
  'قفسه سینه': { title: 'قفسه سینه', text: 'ناحیهٔ قفسه سینه با تنفس، قلب و عضلات پیرامونی در ارتباط است. برای نشانه‌های شدید یا ناگهانی منتظر راهنمایی آنلاین نمانید.', chips: ['تپش قلب', 'تنگی نفس', 'درد عضلانی', 'سرفه'] },
  'معده': { title: 'معده و گوارش', text: 'معده در فرایند دریافت و هضم اولیهٔ غذا نقش دارد. شناخت نشانه‌ها می‌تواند به انتخاب مسیر پیگیری مناسب کمک کند.', chips: ['سوزش سر دل', 'نفخ', 'احساس سنگینی', 'تهوع'] },
  'ستون فقرات': { title: 'ستون فقرات', text: 'ستون فقرات پشتیبان ساختار بدن است. بررسی زمان شروع و شدت ناراحتی به انتخاب مسیر مناسب کمک می‌کند.', chips: ['درد کمر', 'خشکی', 'گزگز', 'درد گردن'] },
  'زانوها': { title: 'زانوها و اندام‌ها', text: 'مفاصل زانو در حرکت روزانه نقش دارند. هر تغییر ناگهانی، تورم یا درد شدید نیازمند ارزیابی حرفه‌ای است.', chips: ['درد هنگام حرکت', 'خشکی', 'تورم', 'صدا دادن مفصل'] }
};

const title = document.getElementById('drawer-title');
const description = document.getElementById('drawer-description');
const chips = document.getElementById('symptom-chips');
const stageState = document.getElementById('stage-state');
const anatomyImage = document.getElementById('anatomy-image');
let zoom = 1;

function renderChips(items) {
  chips.replaceChildren(...items.map((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item;
    return button;
  }));
}

document.querySelectorAll('.hotspot').forEach((hotspot) => hotspot.addEventListener('click', () => {
  const data = memberContent[hotspot.dataset.member];
  document.querySelectorAll('.hotspot').forEach((item) => item.classList.toggle('selected', item === hotspot));
  title.textContent = data.title;
  description.textContent = data.text;
  renderChips(data.chips);
  stageState.textContent = `${hotspot.dataset.member} انتخاب شده • ${Math.round(zoom * 100)}٪`;
}));

document.querySelectorAll('.sex-switch button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.sex-switch button').forEach((item) => item.classList.toggle('active', item === button));
  stageState.textContent = `نمای ${button.textContent.trim()} • ${Math.round(zoom * 100)}٪`;
}));

document.querySelectorAll('[data-zoom]').forEach((button) => button.addEventListener('click', () => {
  zoom = Math.min(1.22, Math.max(1, zoom + (button.dataset.zoom === 'in' ? .06 : -.06)));
  anatomyImage.style.transform = `scale(${zoom})`;
  stageState.textContent = `${document.querySelector('.hotspot.selected')?.dataset.member || 'معده'} انتخاب شده • ${Math.round(zoom * 100)}٪`;
}));

const filterToggle = document.querySelector('[data-filter-toggle]');
const doctorFilters = document.querySelector('.doctor-filters');
const doctorCards = [...document.querySelectorAll('.doctor-card')];
let showingAllDoctors = false;

function applyHomeDoctorFilter(filter) {
  doctorCards.forEach((card, index) => {
    const isIsfahan = card.querySelector('.doctor-content p').textContent.includes('اصفهان');
    const inCity = filter === 'all' || filter === 'week' || (filter === 'isfahan' ? isIsfahan : !isIsfahan);
    card.hidden = !inCity || (!showingAllDoctors && index > 4);
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
  const destination = /دوره|آموزش|یادگیری/.test(query) ? 'courses.html' : /پزشک|کلینیک|نوبت|مطب/.test(query) ? 'clinics.html' : /بدن|عضو|معده|سر|قفسه|زانو|ستون/.test(query) ? '#mehryar-guide' : `chat.html?query=${encodeURIComponent(query)}`;
  window.location.href = destination;
});

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
  menuButton.textContent = open ? '×' : '☰';
});
