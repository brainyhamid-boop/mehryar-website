const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messages = document.getElementById('message-list');
const recommendationState = document.getElementById('recommendation-state');
const recommendationCard = document.getElementById('recommendation-card');

const routes = {
  urgent: {
    reply: 'نشانه‌ای که گفتید ممکن است نیاز به رسیدگی فوری داشته باشد. برای دریافت راهنمایی آنلاین منتظر نمانید و فوراً با اورژانس ۱۱۵ تماس بگیرید.',
    label: 'اقدام فوری',
    title: 'تماس با اورژانس ۱۱۵',
    copy: 'در وضعیت‌های شدید یا ناگهانی، تماس با اورژانس اولویت دارد.',
    note: 'این گفت‌وگو جایگزین خدمات اورژانسی نیست.',
    link: 'tel:115',
    linkText: 'تماس با ۱۱۵',
    image: 'public/figma-assets/figma-Image-2.png',
    imageAlt: 'نماد اقدام فوری'
  },
  booking: {
    reply: 'برای انتخاب پزشک و زمان مناسب، بخش کلینیک‌ها را باز کنید. در آنجا می‌توانید شهر، مرکز و روز پذیرش را فیلتر کنید.',
    label: 'مراجعه حضوری',
    title: 'انتخاب نوبت در کلینیک‌ها',
    copy: 'فیلتر شهر، مرکز و زمان پذیرش برای شما آماده است.',
    note: 'ثبت نهایی پس از بررسی مشخصات مراجعه‌کننده انجام می‌شود.',
    link: 'clinics.html',
    linkText: 'دیدن زمان‌های نوبت',
    image: 'public/figma-assets/figma-Doctor-portrait-4.png',
    imageAlt: 'پزشک همکار مهریار'
  },
  learning: {
    reply: 'برای یادگیری عمومی و مسئولانه، دوره‌های مهریار را ببینید. این محتوا آموزشی است و جایگزین تشخیص یا درمان نیست.',
    label: 'آموزش عمومی',
    title: 'دوره‌های سبک زندگی آگاهانه',
    copy: 'از دوره‌های کوتاه تا مسترکلاس‌های آموزشی را بررسی کنید.',
    note: 'محتوا با مرزبندی روشن میان آموزش و درمان ارائه می‌شود.',
    link: 'courses.html',
    linkText: 'مشاهده دوره‌ها',
    image: 'public/figma-assets/figma-Course-artwork-17.png',
    imageAlt: 'تصویر دوره آموزشی مهریار'
  },
  guide: {
    reply: 'متوجه شدم. برای انتخاب مسیر مناسب، اگر نشانه شدید یا ناگهانی نیست، می‌توانید جزئیات بیشتری مانند زمان شروع و ادامه‌داربودن آن را بنویسید.',
    label: 'راهنمای مسیر',
    title: 'ادامه گفت‌وگوی کوتاه',
    copy: 'زمان شروع و تغییرات نگرانی‌تان را کوتاه توضیح دهید.',
    note: 'راهنمای مهریار تشخیص یا تجویز پزشکی ارائه نمی‌کند.',
    link: 'clinics.html',
    linkText: 'در صورت نیاز، یافتن پزشک',
    image: 'public/figma-assets/figma-Image-6.png',
    imageAlt: 'نماد راهنمای مهریار'
  }
};

function addMessage(text, role) {
  const message = document.createElement('article');
  message.className = role === 'user' ? 'user-message' : 'assistant-message';
  const bubble = document.createElement('div');
  if (role === 'user') {
    bubble.textContent = text;
    message.append(bubble);
  } else {
    const avatar = document.createElement('span');
    const paragraph = document.createElement('p');
    const timestamp = document.createElement('time');
    avatar.className = 'bot-avatar';
    avatar.textContent = '⌁';
    paragraph.textContent = text;
    timestamp.textContent = 'همین حالا';
    bubble.append(paragraph, timestamp);
    message.append(avatar, bubble);
  }
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

function routeFor(text) {
  if (/تنگی نفس|درد قفسه|بیهوش|خونریزی|سکته|شدید|اورژانس/.test(text)) return routes.urgent;
  if (/پزشک|کلینیک|نوبت|مطب|ویزیت|مراجعه/.test(text)) return routes.booking;
  if (/دوره|آموزش|یادگیری|کلاس/.test(text)) return routes.learning;
  return routes.guide;
}

function renderRecommendation(route) {
  document.getElementById('recommendation-image').src = route.image;
  document.getElementById('recommendation-image').alt = route.imageAlt;
  document.getElementById('recommendation-label').textContent = route.label;
  document.getElementById('recommendation-title').textContent = route.title;
  document.getElementById('recommendation-copy').textContent = route.copy;
  document.getElementById('recommendation-note').textContent = route.note;
  const link = document.getElementById('recommendation-link');
  link.href = route.link;
  document.getElementById('recommendation-link-text').textContent = route.linkText;
  recommendationState.hidden = true;
  recommendationCard.hidden = false;
}

function respond(text) {
  addMessage(text, 'user');
  input.value = '';
  const route = routeFor(text);
  window.setTimeout(() => {
    addMessage(route.reply, 'assistant');
    renderRecommendation(route);
  }, 280);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text) respond(text);
});

document.querySelectorAll('[data-prompt]').forEach((button) => button.addEventListener('click', () => respond(button.dataset.prompt)));
document.getElementById('new-chat').addEventListener('click', () => window.location.reload());
