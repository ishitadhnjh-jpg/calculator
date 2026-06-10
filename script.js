// script.js
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  const equalsBtn = document.getElementById('equals');
  const clearBtn = document.getElementById('clear');
  const deleteBtn = document.getElementById('delete');
  const undoBtn = document.getElementById('undo');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const historyList = document.getElementById('historyList');
  const themeSelect = document.getElementById('themeSelect');

  const history = [];
  const maxHistory = 50;

  const renderHistory = () => {
    historyList.innerHTML = '';
    if (history.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty-history';
      emptyLi.textContent = 'No calculations yet';
      historyList.appendChild(emptyLi);
      return;
    }

    history.slice().reverse().forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      historyList.appendChild(li);
    });
  };

  const appendToDisplay = value => {
    if (display.value === '0' && !isNaN(value)) {
      display.value = value;
    } else {
      display.value += value;
    }
  };

  clearBtn.addEventListener('click', () => {
    if (display.value) {
      history.push(`C → ${display.value}`);
      if (history.length > maxHistory) history.shift();
      renderHistory();
    }
    display.value = '';
  });

  deleteBtn.addEventListener('click', () => {
  if (display.value) {
    // Save current state for undo
    history.push(`DEL → ${display.value}`);
    if (history.length > maxHistory) history.shift();

    // Remove only the last character (single digit/operator)
    display.value = display.value.slice(0, -1);
    renderHistory();
  }
});

  undoBtn.addEventListener('click', () => {
    if (!history.length) return;
    const last = history.pop();
    const calcMatch = last.match(/^(.*) = /);
    if (calcMatch) {
      display.value = calcMatch[1];
    } else if (last.startsWith('C →')) {
      display.value = last.split('C → ')[1] || '';
    } else if (last.startsWith('DEL →')) {
      display.value = last.split('DEL → ')[1] || '';
    }
    renderHistory();
  });

  clearHistoryBtn.addEventListener('click', () => {
    history.length = 0;
    renderHistory();
  });

  buttons.forEach(btn => {
    const val = btn.dataset.value;
    if (!val) return;
    btn.addEventListener('click', () => appendToDisplay(val));
  });

  equalsBtn.addEventListener('click', () => {
    try {
      let expr = display.value.replace(/÷/g, '/').replace(/×/g, '*');
      if (!expr) return;
      const result = Function(`"use strict"; return (${expr})`)();
      const entry = `${display.value} = ${result}`;
      history.push(entry);
      if (history.length > maxHistory) history.shift();
      renderHistory();
      display.value = String(result);
    } catch (e) {
      display.value = 'Error';
      console.error(e);
    }
  });

  const applyTheme = theme => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  };
  themeSelect.addEventListener('change', e => applyTheme(e.target.value));
  applyTheme(themeSelect.value || 'pink');

  // Image filter section
  const imageInput = document.getElementById('imageUploader');
  const previewImg = document.getElementById('filterImage');
  const filterButtonsDiv = document.getElementById('filterButtons');

  if (imageInput) {
    imageInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      previewImg.src = url;
      previewImg.classList.remove('hidden');
      filterButtonsDiv.classList.remove('hidden');
      previewImg.style.filter = 'none';

      // Reset active filter button styling
      const filterBtns = filterButtonsDiv.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => btn.classList.remove('active'));
      const normalBtn = filterButtonsDiv.querySelector('[data-filter="none"]');
      if (normalBtn) normalBtn.classList.add('active');
    });
  }

  if (filterButtonsDiv) {
    filterButtonsDiv.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      
      // Toggle active filter styles
      const filterBtns = filterButtonsDiv.querySelectorAll('.filter-btn');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      previewImg.style.filter = filter;
    });
  }
});
