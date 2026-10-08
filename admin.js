const courseCatalog = { lifestyle: 4, seasonal: 3, temperament: 6, visit: 2 };
const keys = ['mehryar-profile', 'mehryar-booking', 'mehryar-appointment', 'mehryar-course'];

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

function clearStored(keysToRemove, message) {
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  Object.keys(courseCatalog).forEach((course) => {
    if (keysToRemove.includes('mehryar-course')) localStorage.removeItem(`mehryar-progress-${course}`);
  });
  document.getElementById('status-message').textContent = message;
  render();
}

function render() {
  const appointment = readStored('mehryar-appointment');
  const course = readStored('mehryar-course');
  const lessonTotal = courseCatalog[course.key] || 0;
  const progress = new Set(readStored(`mehryar-progress-${course.key}`).completed || []);
  document.getElementById('course-count').textContent = String(Object.keys(courseCatalog).length);
  document.getElementById('enrollment-count').textContent = course.status === 'enrolled' ? '۱' : '۰';
  document.getElementById('appointment-count').textContent = appointment.fullName ? '۱' : '۰';
  document.getElementById('progress-count').textContent = lessonTotal ? `${Math.round((progress.size / lessonTotal) * 100)}٪` : '۰٪';

  const appointmentStatus = document.getElementById('appointment-status');
  const appointmentDetail = document.getElementById('appointment-detail');
  if (appointment.fullName) {
    appointmentStatus.textContent = 'ثبت‌شده';
    appointmentDetail.replaceChildren(Object.assign(document.createElement('span'), { textContent: '✓' }), Object.assign(document.createElement('p'), { textContent: `${appointment.clinic} · ${appointment.time} · مراجعه‌کننده: ${appointment.fullName}` }));
  } else {
    appointmentStatus.textContent = 'بدون درخواست';
    appointmentDetail.replaceChildren(Object.assign(document.createElement('span'), { textContent: '◌' }), Object.assign(document.createElement('p'), { textContent: 'هنوز درخواست نوبتی در این مرورگر ثبت نشده است.' }));
  }

  const courseStatus = document.getElementById('course-status');
  const courseDetail = document.getElementById('course-detail');
  if (course.status === 'enrolled' && lessonTotal) {
    courseStatus.textContent = 'فعال';
    courseDetail.replaceChildren(Object.assign(document.createElement('span'), { textContent: '✓' }), Object.assign(document.createElement('p'), { textContent: `${course.title} · ${progress.size} از ${lessonTotal} جلسه تکمیل شده است.` }));
  } else {
    courseStatus.textContent = 'بدون ثبت‌نام';
    courseDetail.replaceChildren(Object.assign(document.createElement('span'), { textContent: '▣' }), Object.assign(document.createElement('p'), { textContent: 'برای مشاهدهٔ جزئیات، یک دوره از کاتالوگ انتخاب کنید.' }));
  }
}

document.getElementById('clear-booking').addEventListener('click', () => clearStored(['mehryar-booking', 'mehryar-appointment'], 'درخواست نوبت آزمایشی پاک شد.'));
document.getElementById('clear-learning').addEventListener('click', () => clearStored(['mehryar-course'], 'ثبت‌نام و پیشرفت آموزشی آزمایشی پاک شد.'));
document.getElementById('clear-all').addEventListener('click', () => clearStored(keys, 'همهٔ داده‌های آزمایشی این مرورگر پاک شد.'));

render();
