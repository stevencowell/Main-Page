'use strict';
document.querySelectorAll('[data-copy-code]').forEach((button) => {
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    const container = button.closest('.class-code');
    const status = container.querySelector('[role="status"]');
    try {
      await navigator.clipboard.writeText(button.dataset.copyCode);
      button.textContent = 'Copied';
      status.textContent = `${container.querySelector('span').textContent} copied.`;
    } catch {
      status.textContent = 'Please select and copy the class code shown beside this button.';
      button.textContent = 'Select code';
      const range = document.createRange();
      range.selectNodeContents(container.querySelector('code'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
});
