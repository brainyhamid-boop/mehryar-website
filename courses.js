document.querySelectorAll('[data-course]').forEach((button) => button.addEventListener('click', () => {
  window.location.href = `course.html?course=${encodeURIComponent(button.dataset.course)}`;
}));
