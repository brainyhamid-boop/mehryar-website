const toast = document.querySelector('.toast');
let toastTimer;
let lastAssessmentTrigger = null;
const assessmentDialog = document.getElementById('assessment-dialog');
const assessmentContent = document.getElementById('assessment-content');
const progressFill = document.querySelector('.progress-fill');
const initialAssessment = {
  symptom: '',
  region: '',
  duration: '',
  intensity: '',
  safety: ''
};
let assessment = { ...initialAssessment };

const RED_FLAGS = ['تنگی نفس', 'درد قفسه سینه', 'غش', 'خونریزی', 'خون‌ریزی', 'بیهوشی', 'ضعف ناگهانی', 'بدترشدن سریع'];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3800);
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function hasRedFlag() {
  return RED_FLAGS.some((flag) => assessment.symptom.includes(flag));
}

function closeMobileMenu({ restoreFocus = false } = {}) {
  const menu = document.getElementById('mobile-menu');
  const trigger = document.querySelector('.menu-trigger');
  if (!menu || !trigger) return;
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', 'باز کردن منو');
  if (restoreFocus) trigger.focus();
}

function showUnavailable(message) {
  showToast(message || 'این قابلیت در نسخه نمایشی هنوز فعال نیست.');
}

document.querySelectorAll('[data-unavailable]').forEach((element) => {
  element.addEventListener('click', () => showUnavailable(element.dataset.unavailable));
});

document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', closeMobileMenu));
const menuTrigger = document.querySelector('.menu-trigger');
const mobileMenu = document.getElementById('mobile-menu');
menuTrigger?.addEventListener('click', () => {
  const willOpen = mobileMenu.hidden;
  mobileMenu.hidden = !willOpen;
  menuTrigger.setAttribute('aria-expanded', String(willOpen));
  menuTrigger.setAttribute('aria-label', willOpen ? 'بستن منو' : 'باز کردن منو');
  if (willOpen) mobileMenu.querySelector('a')?.focus();
});
document.addEventListener('click', (event) => {
  if (mobileMenu && !mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuTrigger.contains(event.target)) closeMobileMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
    closeMobileMenu({ restoreFocus: true });
  }
});

function updateProgress(step) {
  if (progressFill) progressFill.style.width = `${Math.max(33, Math.min(100, step * 33.333))}%`;
}

function dialogBody(html) {
  assessmentContent.innerHTML = `<div class="dialog-body">${html}</div>`;
  const heading = assessmentContent.querySelector('h3');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }
}

function buttonChoices(id, choices, selected = '') {
  return `<div class="dialog-choices" id="${id}" role="group" aria-label="انتخاب یک گزینه">${choices.map((choice) => `<button type="button" class="dialog-choice" aria-pressed="${choice === selected}" data-choice-group="${id}" data-choice-value="${escapeHTML(choice)}">${escapeHTML(choice)}</button>`).join('')}</div>`;
}

function bindChoices() {
  document.querySelectorAll('[data-choice-group]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.dataset.choiceGroup;
      document.querySelectorAll(`[data-choice-group="${group}"]`).forEach((item) => item.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      if (group === 'region') assessment.region = button.dataset.choiceValue;
      if (group === 'duration') assessment.duration = button.dataset.choiceValue;
      if (group === 'intensity') assessment.intensity = button.dataset.choiceValue;
      if (group === 'safety') assessment.safety = button.dataset.choiceValue;
    });
  });
}

function bindDialogClose() {
  document.querySelector('.close-dialog')?.addEventListener('click', () => assessmentDialog.close());
}

function firstStep() {
  updateProgress(1);
  dialogBody(`
    <h3>از کجا شروع کنیم؟</h3>
    <p>یک نشانه را بنویسید یا ناحیه‌ای از بدن را انتخاب کنید. این مسیر فقط برای راهنمایی آموزشی است.</p>
    <label class="field-label" for="dialog-symptom">نشانه یا مشکل</label>
    <input class="dialog-input" id="dialog-symptom" type="text" autocomplete="off" value="${escapeHTML(assessment.symptom)}" placeholder="مثلاً خستگی یا نفخ" />
    <p class="field-label">یا یک ناحیه را انتخاب کنید</p>
    ${buttonChoices('region', ['سر و گردن', 'قفسه سینه', 'گوارش', 'اندام‌ها'], assessment.region)}
    <div class="dialog-actions"><button class="button button-primary" type="button" id="next-step">ادامه</button></div>
    <p class="dialog-disclaimer">برای شروع حساب کاربری لازم نیست. اطلاعات واردشده در این نمونه ذخیره یا ارسال نمی‌شود.</p>`);
  bindChoices();
  document.getElementById('next-step').addEventListener('click', () => {
    assessment.symptom = document.getElementById('dialog-symptom').value.trim();
    if (!assessment.symptom && !assessment.region) {
      showToast('یک نشانه بنویسید یا یک ناحیه را انتخاب کنید.');
      document.getElementById('dialog-symptom').focus();
      return;
    }
    if (hasRedFlag()) {
      urgentStep();
      return;
    }
    safetyStep();
  });
  document.getElementById('dialog-symptom').focus();
}

function safetyStep() {
  updateProgress(2);
  dialogBody(`
    <h3>اول، از ایمنی شروع کنیم.</h3>
    <p>این سؤال کمک می‌کند اگر نشانه‌تان شدید یا ناگهانی است، شما را در یک مسیر آموزشی نامناسب نگه نداریم.</p>
    <p class="field-label">آیا همراه این نشانه، مورد نگران‌کننده‌ای دارید؟</p>
    ${buttonChoices('safety', ['خیر', 'بله، شدید یا ناگهانی است', 'مطمئن نیستم'], assessment.safety)}
    <div class="dialog-actions"><button class="button button-primary" type="button" id="safety-next">ادامه</button></div>
    <p class="dialog-disclaimer">این پرسش جایگزین ارزیابی پزشک یا خدمات فوریت‌های پزشکی نیست.</p>`);
  bindChoices();
  document.getElementById('safety-next').addEventListener('click', () => {
    if (hasRedFlag()) { urgentStep(); return; }
    if (!assessment.safety) { showToast('یکی از گزینه‌ها را انتخاب کنید.'); return; }
    if (assessment.safety !== 'خیر') { urgentStep(); return; }
    questionsStep();
  });
}

function urgentStep() {
  updateProgress(2);
  dialogBody(`
    <div class="dialog-alert"><h3>اگر وضعیت شدید یا ناگهانی است، منتظر راهنمایی این صفحه نمانید.</h3><p>با خدمات فوریت‌های پزشکی منطقه خود تماس بگیرید یا از یک پزشک کمک فوری بگیرید. مهریار در این نسخه ابزار ارزیابی یا نجات پزشکی نیست.</p></div>
    <div class="dialog-actions"><button class="button button-primary" type="button" id="urgent-close">بازگشت به سایت</button></div>`);
  document.getElementById('urgent-close').addEventListener('click', () => assessmentDialog.close());
}

function questionsStep() {
  updateProgress(3);
  dialogBody(`
    <h3>کمی بیشتر درباره نشانه بگویید.</h3>
    <p>فقط دو مورد کوتاه می‌پرسیم تا نتیجه نمونه، شفاف و محدود بماند.</p>
    <p class="field-label">از چه زمانی شروع شده است؟</p>
    ${buttonChoices('duration', ['امروز', 'چند روز است', 'بیش از یک هفته'], assessment.duration)}
    <p class="field-label">شدت را چطور توصیف می‌کنید؟</p>
    ${buttonChoices('intensity', ['خفیف', 'متوسط', 'شدید'], assessment.intensity)}
    <div class="dialog-actions"><button class="button button-primary" type="button" id="result-next">دیدن راهنمای آموزشی</button></div>
    <p class="dialog-disclaimer">در این نسخه، پاسخ‌ها به نتیجه پزشکی تبدیل نمی‌شوند و جایی ذخیره نمی‌شوند.</p>`);
  bindChoices();
  document.getElementById('result-next').addEventListener('click', () => {
    if (hasRedFlag()) { urgentStep(); return; }
    if (!assessment.duration || !assessment.intensity) { showToast('مدت و شدت نشانه را انتخاب کنید.'); return; }
    resultStep();
  });
}

function resultStep() {
  updateProgress(3);
  const subject = assessment.symptom || assessment.region;
  dialogBody(`
    <p class="dialog-kicker">راهنمای آموزشی نمونه</p><h3 tabindex="-1">آنچه ثبت کردید</h3>
    <div class="result-section"><h3>${escapeHTML(subject)}</h3><p>مدت: ${escapeHTML(assessment.duration)} · شدت اعلام‌شده: ${escapeHTML(assessment.intensity)}</p></div>
    <div class="result-section"><h3>اطلاعات مرتبط</h3><p>در نسخه نمایشی، محتوای پزشکی شخصی تولید نمی‌شود. در محصول واقعی، این بخش فقط از محتوای دارای منبع و بازبینی تخصصی تغذیه خواهد شد.</p></div>
    <div class="result-section"><h3>قدم بعدی کم‌خطر</h3><p>زمان شروع، شدت و هر عامل همراه را یادداشت کنید تا در صورت نیاز بتوانید گفت‌وگوی دقیق‌تری با پزشک داشته باشید.</p></div>
    <div class="dialog-alert"><h3>علائم هشدار</h3><p>تنگی نفس، درد قفسه سینه، غش، خونریزی، بیهوشی یا بدترشدن سریع نیازمند کمک فوری است؛ برای این موارد منتظر راهنمایی آنلاین نمانید.</p></div>
    <div class="dialog-actions"><button class="button button-primary" type="button" id="result-close">بازگشت به سایت</button><button class="button button-secondary" type="button" id="result-provider">پیدا کردن پزشک</button></div>
    <p class="dialog-disclaimer">این نمونه تشخیص، درمان یا توصیه پزشکی شخصی نیست.</p>`);
  document.getElementById('result-close').addEventListener('click', () => assessmentDialog.close());
  document.getElementById('result-provider').addEventListener('click', () => { assessmentDialog.close(); document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' }); });
}

function openAssessment({ symptom = '', region = '', trigger = null } = {}) {
  assessment = { ...initialAssessment, symptom, region };
  lastAssessmentTrigger = trigger || document.activeElement;
  assessmentDialog.showModal();
  firstStep();
}

function closeAssessment() {
  if (assessmentDialog.open) assessmentDialog.close();
  lastAssessmentTrigger?.focus?.();
}
assessmentDialog?.addEventListener('close', closeAssessment);
document.querySelector('.close-dialog')?.addEventListener('click', () => assessmentDialog.close());

document.querySelectorAll('.gender-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.gender-button').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  showToast(`نمای ${button.textContent.trim()} اطلس انتخاب شد.`);
}));

document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('فرم خبرنامه در نسخهٔ بعدی به سیستم پیام‌رسانی متصل می‌شود.');
});


document.querySelectorAll('[data-symptom]').forEach((button) => button.addEventListener('click', () => openAssessment({ symptom: button.dataset.symptom, trigger: button })));
document.querySelectorAll('[data-region]').forEach((button) => button.addEventListener('click', () => openAssessment({ region: button.dataset.region, trigger: button })));

const symptomSearch = document.getElementById('symptom-search');
symptomSearch?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = new FormData(symptomSearch).get('symptom')?.trim() || '';
  if (!value) { showToast('یک نشانه را بنویسید تا مسیر را شروع کنیم.'); symptomSearch.querySelector('input').focus(); return; }
  openAssessment({ symptom: value, trigger: symptomSearch.querySelector('input') });
});

// Safety-first: if the user types a known red flag, stop before deeper questions.
document.addEventListener('input', (event) => {
  if (event.target.id !== 'dialog-symptom') return;
  const value = event.target.value.trim();
  if (RED_FLAGS.some((flag) => value.includes(flag))) {
    assessment.symptom = value;
    assessment.safety = 'بله، شدید یا ناگهانی است';
  }
});
