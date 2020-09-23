const { BrowserWindow } = require('electron').remote;

const { DateTime } = require('luxon');
const config = require('./config.json');

const utils = {
  getRepoDirectory: (name, branch) => `repo/${name}_${branch.replace('/', '_')}`,

  onNotiClick: (link) => {
    const childWindow = new BrowserWindow({
      show: false,
      width: 1350,
      height: 900,
    });
    childWindow.loadURL(link);

    childWindow.once('ready-to-show', () => childWindow.show());
  },

  extractFeature(subject, features) {
    let extracted = 'etc';
    let sub = subject;
    let colorClass = '';

    Object.keys(features).forEach((key) => {
      features[key].list.forEach((feature) => {
        if (subject.indexOf(feature) > -1) {
          extracted = key;
          sub = sub.replace(feature, '');
          sub = sub.trim();
          colorClass = features[key].colorClass;
        }
      });
    });
    return { subject: sub, features: extracted, colorClass };
  },

  renderRepo: (target, { repo, branch, url }, logs) => {
    if (logs[repo] && logs[repo][branch]) {
      let count = 0;
      let i = 0;
      while (count < 10) {
        const { subject, authorName, authorDate, hash } = logs[repo][branch][i];
        if (subject.indexOf('Merge branch') < 0) {
          const extracted = utils.extractFeature(subject, config.features);
          const line = document.createElement('tr');

          const td0 = document.createElement('td');
          td0.textContent = extracted.features;
          td0.setAttribute('width', '100px');
          if (extracted.colorClass !== '') td0.classList.add(extracted.colorClass);

          const td = document.createElement('td');
          td.textContent = extracted.subject;
          td.addEventListener('click', () => utils.onNotiClick(`${url}/commit/${hash}`));

          const td1 = document.createElement('td');
          td1.textContent = authorName;
          td1.setAttribute('width', '100px');

          const td2 = document.createElement('td');
          console.log(authorDate);
          console.log(typeof authorDate);
          td2.textContent = DateTime.fromJSDate(new Date(authorDate)).startOf('minute').toRelative();
          td2.setAttribute(
            'title',
            DateTime.fromJSDate(new Date(authorDate)).toISODate() +
              ' ' +
              DateTime.fromJSDate(new Date(authorDate)).toISOTime().split('.000')[0],
          );
          td2.setAttribute('width', '100px');

          line.append(td0);
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
