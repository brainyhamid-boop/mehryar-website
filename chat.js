const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messages = document.getElementById('message-list');
const recommendation = document.getElementById('recommendation-state');
const booking = document.getElementById('booking-card');

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

function respond(text) {
  addMessage(text, 'user');
  input.value = '';
  window.setTimeout(() => {
    addMessage('برای انتخاب مسیر مناسب، می‌توانم شما را به پزشک همکار، راهنمای مهریار یا دورهٔ آموزشی مرتبط هدایت کنم. این گفتگو تشخیص یا تجویز پزشکی ارائه نمی‌دهد.', 'assistant');
    recommendation.hidden = true;
    booking.hidden = false;
  }, 280);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text) respond(text);
});

document.querySelectorAll('[data-prompt]').forEach((button) => button.addEventListener('click', () => respond(button.dataset.prompt)));
document.getElementById('new-chat').addEventListener('click', () => window.location.reload());
