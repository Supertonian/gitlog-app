import { utils } from './utils.js';
const git = require('simple-git');
const fs = require('fs');
const gitlog = require('gitlog').default;
const { BrowserWindow } = require('electron').remote;
const moment = require('moment');
const config = require('./config.json');

moment.locale('ko');

const logs = {};
const options = {
  repo: __dirname,
  number: 100,
  fields: ['authorEmail', 'abbrevHash', 'subject', 'authorName', 'authorDate', 'hash'],
  execOptions: { maxBuffer: 1000 * 1024 },
};
const lastUpdateDate = {};

function onNotiClick(link) {
  const childWindow = new BrowserWindow({ show: false, width: 1350, height: 900 });
  childWindow.loadURL(link);

  childWindow.once('ready-to-show', () => childWindow.show());
}

function render() {
  function renderRepo(target, repo, branch, url) {
    if (logs[repo] && logs[repo][branch]) {
      let count = 0;
      let i = 0;
      while (count < 10) {
        const { subject, authorName, authorDate, hash } = logs[repo][branch][i];
        if (subject.indexOf('Merge branch') < 0) {
          const line = document.createElement('tr');
          const td = document.createElement('td');
          td.textContent = subject;
          td.addEventListener('click', () => onNotiClick(`${url}/commit/${hash}`));

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
  }
  config.repo.forEach((item, index) => {
    const target = document.querySelector(`#log-table-${index} tbody`);
    target.innerHTML = '';
    renderRepo(target, item.name, item.branch, item.http);
  });
}

function setState(repo, branch, log, url) {
  if (!logs[repo]) {
    logs[repo] = {};
    lastUpdateDate[repo] = new Date();
  }
  if (!logs[repo][branch]) {
    logs[repo][branch] = [];
  }
  if (logs[repo][branch].length > 0) {
    let ind = 0;
    const firstLogDate = new Date(log[0].authorDate);
    let thisDate;
    while (true) {
      const logC = log[ind];
      thisDate = new Date(logC.authorDate);

      if (thisDate - lastUpdateDate[repo] > 0) {
        if (logC.subject.indexOf('Merge branch') < 0) {
          const noti = new window.Notification(logC.subject, {
            body: `${logC.authorName}: ${logC.authorDate}`,
          });
          noti.onclick = () => {
            onNotiClick(`${url}/commit/${logC.hash}`);
          };
        }
      } else {
        break;
      }
      ind += 1;
    }
    lastUpdateDate[repo] = firstLogDate;
  }
  logs[repo][branch] = log;
  render();
}

function saveLog(repo, branch, url) {
  const opt = options;
  opt.repo = utils.getRepoDirectory(repo, branch);
  const commits = gitlog(opt);

  setState(repo, branch, commits, url);
}

function fetchFromRepo(repo) {
  git(utils.getRepoDirectory(repo.name, repo.branch))
    .silent(true)
    .pull(repo.useSSH ? repo.ssh : repo.http, repo.branch)
    .then(() => {
      saveLog(repo.name, repo.branch, repo.http);
    })
    .catch((err) => console.error('failed to pull: ', err));
}

function fetchAllFromRepo() {
  config.repo.forEach((item) => fetchFromRepo(item));
}

function cloneIfNotExists(repo) {
  if (!fs.existsSync(utils.getRepoDirectory(repo.name, repo.branch))) {
    git()
      .silent(true)
      .clone(repo.useSSH ? repo.ssh : repo.http, utils.getRepoDirectory(repo.name, repo.branch))
      .then(() => fetchFromRepo(repo))
      .catch((err) => console.error('failed to clone: ', err));
  } else {
    fetchFromRepo(repo);
  }
}

config.repo.forEach((repo) => cloneIfNotExists(repo));

setInterval(fetchAllFromRepo, 3 * 60 * 1000);
