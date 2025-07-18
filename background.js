chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkTTNStatus",
    title: "Статус ТТН",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "checkTTNStatus" && info.selectionText) {
    const ttn = info.selectionText.trim();

    // Получаем API-ключ из storage
    chrome.storage.local.get(['npApiKey'], async (result) => {
      const NOVA_POSHTA_API_KEY = result.npApiKey;
      let message = "API-ключ не задан. Введите его через иконку расширения.";

      if (NOVA_POSHTA_API_KEY) {
        try {
          const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: NOVA_POSHTA_API_KEY,
              modelName: "TrackingDocument",
              calledMethod: "getStatusDocuments",
              methodProperties: {
                Documents: [{ DocumentNumber: ttn }]
              }
            })
          });

          const data = await response.json();
          if (data.success && data.data && data.data[0]) {
            message = data.data[0].Status || "Статус не найден";
          } else if (data.errors && data.errors.length) {
            message = data.errors.join(", ");
          } else {
            message = "Ошибка запроса или неверный номер ТТН";
          }
        } catch (e) {
          message = "Ошибка обработки ответа";
        }
      }

      // Показ уведомления
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Статус ТТН",
        message: message
      });
    });
  }
});