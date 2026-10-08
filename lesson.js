const courses = {
  lifestyle: { title: 'مقدمات سبک زندگی سالم', image: 'figma-Course-artwork-17.png', description: 'آموزش کاربردی برای ساختن عادت‌های روزمره آگاهانه.', lessons: ['مرزبندی آموزش سلامت و درمان', 'ساختن عادت‌های روزمره پایدار', 'توجه به خواب، حرکت و تغذیه', 'مرور و برنامهٔ شخصی یادگیری'] },
  seasonal: { title: 'تدابیر فصلی در طب ایرانی', image: 'figma-Course-artwork-18.png', description: 'نگاهی روشن به مراقبت روزمره و نقش تغییر فصل در سبک زندگی.', lessons: ['تغییر فصل و عادت‌های روزانه', 'مرور نکات مراقبت عمومی', 'جمع‌بندی و زمان مراجعه به پزشک'] },
  temperament: { title: 'شناخت مزاج، بدون خودتشخیصی', image: 'figma-Course-artwork-19.png', description: 'دانشی برای گفت‌وگوی بهتر با پزشک، بدون خودتشخیصی.', lessons: ['زبان مشترک در گفت‌وگوی سلامت', 'شناخت محدودیت‌های خودارزیابی', 'ثبت مشاهده‌های روزمره', 'مرزبندی با توصیهٔ درمانی', 'آمادگی برای مراجعه', 'مرور آموخته‌ها'] },
  visit: { title: 'مسیر مراجعه آگاهانه', image: 'figma-Course-artwork-20.png', description: 'برای آماده‌شدن برای ویزیت و انتخاب گام بعدی.', lessons: ['پیش از مراجعه چه چیزهایی ثبت کنیم؟', 'پرسش‌های روشن برای گفت‌وگو با پزشک'] }
};

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

const profile = readStored('mehryar-profile');
const enrolledCourse = readStored('mehryar-course');
if (!profile.authenticated) window.location.replace('profile.html');

const params = new URLSearchParams(window.location.search);
const courseKey = courses[params.get('course')] ? params.get('course') : 'lifestyle';
if (enrolledCourse.status !== 'enrolled' || enrolledCourse.key !== courseKey) {
  window.location.replace(`course.html?course=${courseKey}`);
}
const course = courses[courseKey];
const index = Math.max(0, Math.min(course.lessons.length - 1, Number(params.get('lesson')) - 1 || 0));
const progressKey = `mehryar-progress-${courseKey}`;
const progress = new Set(readStored(progressKey).completed || []);

function lessonUrl(target) {
  return `lesson.html?course=${courseKey}&lesson=${target + 1}`;
}

function render() {
  const completedCount = progress.size;
  const percentage = Math.round((completedCount / course.lessons.length) * 100);
  document.title = `${course.lessons[index]} | مهریار`;
  document.getElementById('course-back').href = `course.html?course=${courseKey}`;
  document.getElementById('lesson-artwork').src = `public/figma-assets/${course.image}`;
  document.getElementById('lesson-artwork').alt = `تصویر دوره ${course.title}`;
  document.getElementById('lesson-meta').textContent = course.title;
  document.getElementById('lesson-title').textContent = `جلسهٔ ${index + 1}: ${course.lessons[index]}`;
  document.getElementById('lesson-description').textContent = course.description;
  document.getElementById('lesson-duration').textContent = `جلسهٔ ${index + 1} از ${course.lessons.length}`;
  document.getElementById('progress-value').textContent = `${percentage}٪`;
  document.getElementById('progress-bar').style.width = `${percentage}%`;
  document.getElementById('lesson-heading').textContent = course.lessons[index];
  document.getElementById('lesson-copy').replaceChildren(...[`${course.description}`, 'نکات این جلسه را با دقت مرور کنید و در صورت نیاز، مشاهده‌های خود را برای گفت‌وگو با پزشک ثبت کنید.'].map((text) => { const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph; }));
  document.getElementById('lesson-list').replaceChildren(...course.lessons.map((lesson, lessonIndex) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = lessonUrl(lessonIndex);
    link.textContent = `جلسهٔ ${lessonIndex + 1}: ${lesson}`;
    link.classList.toggle('active', lessonIndex === index);
    link.classList.toggle('complete', progress.has(lessonIndex));
    item.append(link);
    return item;
  }));
  const previous = document.getElementById('previous-lesson');
  previous.hidden = index === 0;
  previous.href = lessonUrl(index - 1);
  const next = document.getElementById('next-lesson');
  next.href = index < course.lessons.length - 1 ? lessonUrl(index + 1) : 'dashboard.html';
  next.replaceChildren(index < course.lessons.length - 1 ? 'جلسهٔ بعد ' : 'بازگشت به پنل ', Object.assign(document.createElement('b'), { textContent: '←' }));
  document.getElementById('complete-lesson').textContent = progress.has(index) ? '✓ جلسه تکمیل شده' : '✓ پایان جلسه';
}

document.getElementById('complete-lesson').addEventListener('click', () => {
  progress.add(index);
  localStorage.setItem(progressKey, JSON.stringify({ completed: [...progress] }));
  render();
});

render();
