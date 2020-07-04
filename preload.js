window.addEventListener('DOMContentLoaded', () => {
  // pre-draw tables
  const config = require('./config.json');

  config.repo.forEach((item, index) => {
    const title = document.createElement('h1');
    title.classList.add('ui');
    title.classList.add('header');
    title.id = `log-table-${index}-header`;
    title.innerHTML = `${item.name} <div class="sub header">${item.branch}</div>`;

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    ['커밋 메시지', '이름', '날짜'].forEach((thName) => {
      const th = document.createElement('th');
      th.textContent = thName;
      tr.append(th);
    });
    thead.append(tr);
    table.append(thead);
    table.append(tbody);

    table.id = `log-table-${index}`;
    table.classList.add('ui');
    table.classList.add('table');
    table.classList.add('celled');

    document.querySelector('#log').append(title);
    document.querySelector('#log').append(table);
  });
});
