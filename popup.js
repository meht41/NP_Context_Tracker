document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Загрузка ключа при открытии popup
  chrome.storage.local.get(['npApiKey'], (result) => {
    if (result.npApiKey) {
      apiKeyInput.value = result.npApiKey;
    }
  });

  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key.length > 0) {
      chrome.storage.local.set({ npApiKey: key }, () => {
        status.textContent = 'API-ключ сохранён!';
        status.style.color = 'green';
      });
    } else {
      status.textContent = 'Введите корректный ключ';
      status.style.color = 'red';
    }
  });
});