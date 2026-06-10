// script.js
// Calculator functionality
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  const equalsBtn = document.getElementById('equals');
  const clearBtn = document.getElementById('clear');

  // Helper to update display safely
  const appendToDisplay = (value) => {
    if (display.value === '0' && !isNaN(value)) {
      display.value = value;
    } else {
      display.value += value;
    }
  };

  // Clear screen
  clearBtn?.addEventListener('click', () => {
    display.value = '';
  });

  // Button clicks (numbers and operators)
  buttons.forEach((btn) => {
    const val = btn.dataset.value;
    if (!val) return; // skip non-data-value buttons like equals handled separately
    btn.addEventListener('click', () => {
      appendToDisplay(val);
    });
  });

  // Evaluate expression
  equalsBtn?.addEventListener('click', () => {
    try {
      // Replace UI symbols with JS operators
      let expr = display.value.replace(/÷/g, '/').replace(/×/g, '*');
      // Prevent empty expression
      if (!expr) return;
      // Evaluate safely
      // Using Function to avoid eval security concerns in this isolated sandbox
      const result = Function(`"use strict"; return (${expr})`)();
      display.value = String(result);
    } catch (e) {
      display.value = 'Error';
      console.error(e);
    }
  });

  // -------------------- Image Filter Section --------------------
  const imageInput = document.getElementById('imageUploader');
  const previewImg = document.getElementById('filterImage');
  const filterButtonsDiv = document.getElementById('filterButtons');

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      previewImg.src = url;
      previewImg.classList.remove('hidden');
      filterButtonsDiv.classList.remove('hidden');
      // Reset filter
      previewImg.style.filter = 'none';
    });
  }

  // Apply selected filter
  if (filterButtonsDiv) {
    filterButtonsDiv.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const filter = btn.dataset.filter;
      previewImg.style.filter = filter;
    });
  }
});
