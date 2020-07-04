const moment = require('moment');

const { BrowserWindow } = require('electron').remote;

moment.locale('ko');

const utils = {
  getRepoDirectory: (name, branch) => `repo/${name}_${branch.replace('/', '')}`,

  onNotiClick: (link) => {
    const childWindow = new BrowserWindow({ show: false, width: 1350, height: 900 });
    childWindow.loadURL(link);

    childWindow.once('ready-to-show', () => childWindow.show());
  },

  renderRepo: (target, { repo, branch, url }, logs) => {
    if (logs[repo] && logs[repo][branch]) {
      let count = 0;
      let i = 0;
      while (count < 10) {
        const { subject, authorName, authorDate, hash } = logs[repo][branch][i];
        if (subject.indexOf('Merge branch') < 0) {
          const line = document.createElement('tr');
          const td = document.createElement('td');
          td.textContent = subject;
          td.addEventListener('click', () => utils.onNotiClick(`${url}/commit/${hash}`));

          const td1 = document.createElement('td');
          td1.textContent = authorName;

          const td2 = document.createElement('td');
          td2.textContent = moment(authorDate).startOf('hour').fromNow();
          td2.setAttribute('title', moment(authorDate).format('llll'));

          line.append(td);
          line.append(td1);
          line.append(td2);

          target.append(line);

          count += 1;
        }
        i += 1;
      }
    }
    return '';
  },
};

export { utils };
