import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3600);
}

document.querySelectorAll('[data-toast]').forEach((element) => {
  element.addEventListener('click', (event) => {
    if (element.tagName === 'A') event.preventDefault();
    showToast(element.dataset.toast);
  });
});

const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.main-menu');
menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// مدل مفهومی سه‌بعدی: این بخش فقط یک نمونه سبک است و مدل پزشکی واقعی نیست.
const canvasHost = document.getElementById('body-canvas');
if (canvasHost && window.WebGLRenderingContext) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, .15, 8.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  canvasHost.appendChild(renderer.domElement);

  const body = new THREE.Group();
  body.rotation.y = -.28;
  scene.add(body);
  const softBlue = new THREE.MeshPhysicalMaterial({ color: 0x9abed0, transparent: true, opacity: .44, roughness: .42, metalness: .05, clearcoat: .32 });
  const lineBlue = new THREE.MeshBasicMaterial({ color: 0x63899a, transparent: true, opacity: .22, wireframe: true });
  const organMaterial = new THREE.MeshPhysicalMaterial({ color: 0xb97862, transparent: true, opacity: .86, roughness: .36, emissive: 0x51251c, emissiveIntensity: .16 });

  function mesh(geometry, material, position, scale = [1, 1, 1]) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.scale.set(...scale);
    body.add(object);
    return object;
  }
  function limb(position, rotationZ, length = 1.55, radius = .23) {
    const group = new THREE.Group();
    const piece = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 10), softBlue);
    piece.rotation.z = rotationZ;
    group.add(piece);
    const wire = new THREE.Mesh(new THREE.CapsuleGeometry(radius * 1.012, length, 6, 10), lineBlue);
    wire.rotation.z = rotationZ;
    group.add(wire);
    group.position.set(...position);
    body.add(group);
  }

  mesh(new THREE.SphereGeometry(.64, 24, 24), softBlue, [0, 2.33, 0], [.86, 1.08, .84]);
  mesh(new THREE.SphereGeometry(.655, 24, 24), lineBlue, [0, 2.33, 0], [.87, 1.09, .85]);
  mesh(new THREE.CapsuleGeometry(.30, .28, 6, 12), softBlue, [0, 1.58, 0]);
  mesh(new THREE.CapsuleGeometry(.77, 1.77, 7, 15), softBlue, [0, .45, 0], [1, 1, .63]);
  mesh(new THREE.CapsuleGeometry(.778, 1.77, 7, 15), lineBlue, [0, .45, 0], [1.006, 1.006, .634]);
  mesh(new THREE.SphereGeometry(.78, 20, 18), softBlue, [0, -1.0, 0], [1.02, .54, .62]);
  limb([-.98, .73, 0], .43, 1.55, .21);
  limb([.98, .73, 0], -.43, 1.55, .21);
  limb([-.39, -2.26, 0], .04, 1.76, .29);
  limb([.39, -2.26, 0], -.04, 1.76, .29);

  const chest = mesh(new THREE.SphereGeometry(.34, 18, 18), organMaterial, [0, .72, .47], [1.05, .9, .43]);
  chest.userData.region = 'قفسه سینه';
  const digestive = mesh(new THREE.SphereGeometry(.36, 18, 18), organMaterial, [0, -.15, .48], [1.05, .82, .4]);
  digestive.userData.region = 'دستگاه گوارش';
  const head = mesh(new THREE.SphereGeometry(.23, 18, 18), organMaterial, [0, 2.34, .55], [1, .75, .28]);
  head.userData.region = 'سر و گردن';
  const selectable = [chest, digestive, head];

  const lightOne = new THREE.PointLight(0xa9c9d8, 4, 14);
  lightOne.position.set(-3, 4, 4);
  scene.add(lightOne);
  const lightTwo = new THREE.PointLight(0xd8c2a5, 3.2, 10);
  lightTwo.position.set(4, -2, 4);
  scene.add(lightTwo);
  scene.add(new THREE.AmbientLight(0xffffff, 2.1));

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let dragging = false;
  let dragged = false;
  let pointerX = 0;
  let pointerY = 0;
  let rotationTarget = body.rotation.y;
  let tiltTarget = body.rotation.x;

  function resizeScene() {
    const { width, height } = canvasHost.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function pointerPosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  renderer.domElement.addEventListener('pointerdown', (event) => {
    dragging = true; dragged = false; pointerX = event.clientX; pointerY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - pointerX;
    const dy = event.clientY - pointerY;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragged = true;
    rotationTarget += dx * .009;
    tiltTarget = THREE.MathUtils.clamp(tiltTarget + dy * .004, -.25, .25);
    pointerX = event.clientX; pointerY = event.clientY;
  });
  renderer.domElement.addEventListener('pointerup', (event) => {
    dragging = false;
    if (!dragged) {
      pointerPosition(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(selectable, false)[0];
      if (hit?.object.userData.region) openAssessment(hit.object.userData.region);
    }
  });
  renderer.domElement.addEventListener('pointerleave', () => { dragging = false; });
  window.addEventListener('resize', resizeScene);
  resizeScene();

  function animate() {
    body.rotation.y += (rotationTarget - body.rotation.y) * .07;
    body.rotation.x += (tiltTarget - body.rotation.x) * .07;
    chest.material.emissiveIntensity = .15 + Math.sin(performance.now() / 540) * .07;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
} else if (canvasHost) {
  canvasHost.innerHTML = '<p style="margin: 45% auto; text-align:center; color:#587b8f; font-size:.82rem">نمایش سه‌بعدی در این دستگاه در دسترس نیست.</p>';
}

const dialog = document.getElementById('assessment-dialog');
const assessmentContent = document.getElementById('assessment-content');
const initialAssessment = assessmentContent.innerHTML;
let assessment = { symptom: '', duration: '', intensity: '' };

function initialStep() {
  assessmentContent.innerHTML = initialAssessment;
  const input = document.getElementById('dialog-symptom');
  document.querySelectorAll('#symptom-choices button').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.textContent;
      document.querySelectorAll('#symptom-choices button').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
  document.getElementById('next-step').addEventListener('click', () => {
    assessment.symptom = input.value.trim();
    if (!assessment.symptom) { showToast('لطفاً یک نشانه را بنویسید یا انتخاب کنید.'); input.focus(); return; }
    secondStep();
  });
  if (assessment.symptom) input.value = assessment.symptom;
}
function secondStep() {
  assessmentContent.innerHTML = `
    <div class="assessment-progress" aria-label="پیشرفت فرم"><span class="active"></span><span class="active"></span><span></span></div>
    <p class="dialog-step">گام ۲ از ۳</p>
    <h2>کمی بیشتر بگویید.</h2>
    <p class="dialog-description">برای ساخت یک مسیر آموزشی نمونه، مدت و شدت را انتخاب کنید.</p>
    <div class="result-panel"><h3>نشانه ثبت‌شده</h3><p>${escapeHTML(assessment.symptom)}</p></div>
    <p class="dialog-step">این وضعیت از چه زمانی شروع شده است؟</p>
    <div class="choice-row" id="duration-choices"><button type="button">امروز</button><button type="button">چند روز</button><button type="button">بیش از یک هفته</button></div>
    <p class="dialog-step">شدت آن را چگونه توصیف می‌کنید؟</p>
    <div class="choice-row" id="intensity-choices"><button type="button">خفیف</button><button type="button">متوسط</button><button type="button">شدید</button></div>
    <button class="button primary full" type="button" id="show-result">دیدن مسیر آموزشی</button>
    <p class="dialog-disclaimer">اطلاعات واردشده در این نمونه روی دستگاه یا سرور ذخیره نمی‌شود.</p>`;
  chooseOne('duration-choices', (value) => assessment.duration = value);
  chooseOne('intensity-choices', (value) => assessment.intensity = value);
  document.getElementById('show-result').addEventListener('click', () => {
    if (!assessment.duration || !assessment.intensity) { showToast('لطفاً مدت و شدت نشانه را انتخاب کنید.'); return; }
    resultStep();
  });
}
function chooseOne(id, onSelect) {
  document.querySelectorAll(`#${id} button`).forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll(`#${id} button`).forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected'); onSelect(button.textContent);
  }));
}
function resultStep() {
  assessmentContent.innerHTML = `
    <div class="assessment-progress" aria-label="پیشرفت فرم"><span class="active"></span><span class="active"></span><span class="active"></span></div>
    <p class="dialog-step">نتیجه نمونه</p>
    <h2>مسیر مطالعه شما آماده است.</h2>
    <p class="dialog-description">این یک نمونه نمایشی است، نه تحلیل یا تشخیص پزشکی.</p>
    <div class="result-panel"><h3>آنچه ثبت کردید</h3><p>«${escapeHTML(assessment.symptom)}» با شدت ${escapeHTML(assessment.intensity)} و مدت ${escapeHTML(assessment.duration)}.</p></div>
    <div class="result-panel"><h3>قدم آموزشی پیشنهادی</h3><p>نشانه‌ها، زمان شروع و عوامل تشدیدکننده را یادداشت کنید. در نسخه نهایی، این بخش شما را به مقاله‌های معتبر و مرتبط هدایت می‌کند.</p></div>
    <div class="result-panel warning"><h3>چه زمانی کمک فوری بگیرید؟</h3><p>اگر نشانه شدید یا ناگهانی است، با تنگی نفس، درد قفسه سینه، غش، خونریزی، تب بالا یا بدترشدن سریع همراه است، از خوددرمانی پرهیز کنید و فوراً از خدمات اورژانسی یا پزشک کمک بگیرید.</p></div>
    <button class="button primary full" type="button" id="close-result">بازگشت به سایت</button>
    <p class="dialog-disclaimer">محتوای مهریار جنبه آموزشی دارد و جایگزین نظر پزشک نیست.</p>`;
  document.getElementById('close-result').addEventListener('click', () => dialog.close());
}
function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function openAssessment(symptom = '') {
  assessment = { symptom, duration: '', intensity: '' };
  initialStep();
  dialog.showModal();
  window.setTimeout(() => document.getElementById('dialog-symptom')?.focus(), 100);
}
document.querySelectorAll('[data-open-assessment]').forEach((button) => button.addEventListener('click', () => openAssessment()));
document.querySelectorAll('[data-symptom]').forEach((button) => button.addEventListener('click', () => openAssessment(button.dataset.symptom)));
document.querySelectorAll('.body-chip').forEach((button) => button.addEventListener('click', () => openAssessment(button.dataset.region)));
document.querySelector('.close-dialog')?.addEventListener('click', () => dialog.close());
document.getElementById('symptom-search').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = new FormData(event.currentTarget).get('symptom').trim();
  openAssessment(value);
});
