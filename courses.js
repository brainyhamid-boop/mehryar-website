const message = document.getElementById('course-message');
const title = document.getElementById('course-message-title');

document.querySelectorAll('[data-course]').forEach((button) => button.addEventListener('click', () => {
  const course = button.dataset.course;
  localStorage.setItem('mehryar-course', course);
  title.textContent = `درخواست شما برای «${course}» ثبت شد`;
  message.hidden = false;
}));

document.getElementById('close-message').addEventListener('click', () => { message.hidden = true; });
