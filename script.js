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

document.querySelectorAll('.hotspot').forEach((hotspot) => {
  hotspot.addEventListener('click', () => {
    const data = memberContent[hotspot.dataset.member];
    document.querySelectorAll('.hotspot').forEach((item) => item.classList.toggle('selected', item === hotspot));
    title.textContent = data.title;
    description.textContent = data.text;
    chips.innerHTML = data.chips.map((chip) => `<button type="button">${chip}</button>`).join('');
    stageState.textContent = `${hotspot.dataset.member} انتخاب شده • ${Math.round(zoom * 100)}٪`;
  });
});

document.querySelectorAll('.sex-switch button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.sex-switch button').forEach((item) => item.classList.toggle('active', item === button));
  stageState.textContent = `نمای ${button.textContent.trim()} • ${Math.round(zoom * 100)}٪`;
}));

document.querySelectorAll('[data-zoom]').forEach((button) => button.addEventListener('click', () => {
  zoom = Math.min(1.22, Math.max(1, zoom + (button.dataset.zoom === 'in' ? .06 : -.06)));
  anatomyImage.style.transform = `scale(${zoom})`;
  stageState.textContent = `${document.querySelector('.hotspot.selected')?.dataset.member || 'معده'} انتخاب شده • ${Math.round(zoom * 100)}٪`;
}));
