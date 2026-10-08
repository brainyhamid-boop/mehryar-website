const courses = {
  lifestyle: { title: 'مقدمات سبک زندگی سالم', meta: 'دوره عمومی · ۴ جلسه', duration: '۱۲۰ دقیقه آموزش ویدیویی', price: 'رایگان', note: 'شروع آنی و دسترسی به چهار جلسه', image: 'figma-Course-artwork-17.png', description: 'آموزش کاربردی برای ساختن عادت‌های روزمره آگاهانه و گفت‌وگوی بهتر با پزشک.', lessons: ['مرزبندی آموزش سلامت و درمان', 'ساختن عادت‌های روزمره پایدار', 'توجه به خواب، حرکت و تغذیه', 'مرور و برنامهٔ شخصی یادگیری'] },
  seasonal: { title: 'تدابیر فصلی در طب ایرانی', meta: 'یادگیری ویدیویی · ۳ جلسه', duration: '۷۵ دقیقه آموزش ویدیویی', price: '۱۶۹ هزار تومان', note: 'سه جلسه با دسترسی در همین مرورگر', image: 'figma-Course-artwork-18.png', description: 'نگاهی روشن به مراقبت روزمره و نقش تغییر فصل در سبک زندگی.', lessons: ['تغییر فصل و عادت‌های روزانه', 'مرور نکات مراقبت عمومی', 'جمع‌بندی و زمان مراجعه به پزشک'] },
  temperament: { title: 'شناخت مزاج، بدون خودتشخیصی', meta: 'مسترکلاس · ۶ جلسه', duration: '۱۸۰ دقیقه آموزش ویدیویی', price: '۲۹۸ هزار تومان', note: 'شش جلسه با مرزبندی آموزشی روشن', image: 'figma-Course-artwork-19.png', description: 'دانشی برای گفت‌وگوی بهتر با پزشک، بدون جایگزین‌کردن آن با خودتشخیصی.', lessons: ['زبان مشترک در گفت‌وگوی سلامت', 'شناخت محدودیت‌های خودارزیابی', 'ثبت مشاهده‌های روزمره', 'مرزبندی با توصیهٔ درمانی', 'آمادگی برای مراجعه', 'مرور آموخته‌ها'] },
  visit: { title: 'مسیر مراجعه آگاهانه', meta: 'دوره عمومی · ۲ جلسه', duration: '۴۵ دقیقه آموزش ویدیویی', price: 'رایگان', note: 'شروع آنی و دسترسی به دو جلسه', image: 'figma-Course-artwork-20.png', description: 'برای آماده‌شدن برای ویزیت، ثبت دقیق نشانه‌ها و انتخاب گام بعدی.', lessons: ['پیش از مراجعه چه چیزهایی ثبت کنیم؟', 'پرسش‌های روشن برای گفت‌وگو با پزشک'] }
};

const key = new URLSearchParams(window.location.search).get('course');
const course = courses[key] || courses.lifestyle;
document.title = `${course.title} | مهریار`;
document.getElementById('course-artwork').src = `public/figma-assets/${course.image}`;
document.getElementById('course-artwork').alt = `تصویر دوره ${course.title}`;
document.getElementById('course-meta').textContent = course.meta;
document.getElementById('course-title').textContent = course.title;
document.getElementById('course-description').textContent = course.description;
document.getElementById('course-duration').textContent = course.duration;
document.getElementById('enroll-price').textContent = course.price;
document.getElementById('enroll-note').textContent = course.note;
document.getElementById('lesson-list').replaceChildren(...course.lessons.map((lesson) => {
  const item = document.createElement('li');
  item.textContent = lesson;
  return item;
}));

document.getElementById('enroll-button').addEventListener('click', () => {
  localStorage.setItem('mehryar-course', JSON.stringify({ key: key && courses[key] ? key : 'lifestyle', title: course.title, status: 'enrolled' }));
  document.getElementById('enroll-status').textContent = 'ثبت‌نام آزمایشی انجام شد. از پروفایل می‌توانید وضعیت دوره را ببینید.';
});
