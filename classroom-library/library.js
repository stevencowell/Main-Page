'use strict';
document.querySelectorAll('[data-copy-code]').forEach((button) => {
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copyCode);
      button.textContent = 'Copied';
      status.textContent = 'Mirror class code copied.';
    } catch {
      status.textContent = 'Please select and copy the class code shown beside this button.';
      button.textContent = 'Select code';
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('mirror-code'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
});
