const courseDetails = {
  lifestyle: { image: 'figma-Course-artwork-17.png', href: 'course.html?course=lifestyle' },
  seasonal: { image: 'figma-Course-artwork-18.png', href: 'course.html?course=seasonal' },
  temperament: { image: 'figma-Course-artwork-19.png', href: 'course.html?course=temperament' },
  visit: { image: 'figma-Course-artwork-20.png', href: 'course.html?course=visit' }
};

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

const profile = readStored('mehryar-profile');
if (!profile.authenticated || !profile.fullName) {
  window.location.replace('profile.html');
} else {
  document.getElementById('welcome-title').textContent = `${profile.fullName}، خوش آمدید`;
  document.getElementById('profile-name').textContent = profile.fullName;
  document.getElementById('profile-mobile').textContent = profile.mobile;

  const course = readStored('mehryar-course');
  if (course.status === 'enrolled' && courseDetails[course.key]) {
    const detail = courseDetails[course.key];
    document.getElementById('course-empty').hidden = true;
    document.getElementById('learning-card').hidden = false;
    document.getElementById('learning-image').src = `public/figma-assets/${detail.image}`;
    document.getElementById('learning-image').alt = `تصویر دوره ${course.title}`;
    document.getElementById('learning-title').textContent = course.title;
    document.getElementById('learning-link').href = detail.href;
  }

  const appointment = readStored('mehryar-appointment');
  if (appointment.fullName) {
    document.getElementById('appointment-title').textContent = appointment.clinic;
    document.getElementById('appointment-text').textContent = `${appointment.time} · درخواست ثبت شده برای ${appointment.fullName}`;
  }
}

document.getElementById('sign-out').addEventListener('click', () => {
  localStorage.removeItem('mehryar-profile');
  window.location.href = 'profile.html';
});
