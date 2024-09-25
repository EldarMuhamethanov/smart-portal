export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Проверяем поддержку современного API буфера обмена
    if (navigator.clipboard && window.isSecureContext) {
      // Используем современное API
      navigator.clipboard
        .writeText(text)
        .then(() => resolve())
        .catch((err) => reject(err));
    } else {
      // Используем устаревший метод для старых браузеров
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Делаем элемент невидимым
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        // Пытаемся скопировать текст в буфер обмена
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        // Удаляем временный элемент
        document.body.removeChild(textArea);
      }
    }
  });
}
