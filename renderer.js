const git = require('simple-git');
const fs = require('fs');
const gitlog = require('gitlog').default;
const { BrowserWindow } = require('electron').remote;
const config = require('./config.json');

const logs = {};
const options = {
  repo: __dirname,
  number: 100,
  fields: ['authorEmail', 'abbrevHash', 'subject', 'authorName', 'authorDate', 'hash'],
  execOptions: { maxBuffer: 1000 * 1024 },
};
const lastUpdateDate = {};

function onNotiClick(link) {
  const childWindow = new BrowserWindow({ width: 800, height: 600 });
  childWindow.loadURL(link);
}

function render() {
  function renderRepo(repo, branch, url) {
    const html = document.createElement('div');

    const title = document.createElement('h1');
    title.classList.add('ui');
    title.classList.add('header');
    title.innerHTML = `${repo} <div class="sub header">${branch}</div>`;

    html.append(title);

    if (logs[repo] && logs[repo][branch]) {
      let count = 0;
      let i = 0;
      while (count < 10) {
        const { subject } = logs[repo][branch][i];
        if (subject.indexOf('Merge branch') < 0) {
          const line = document.createElement('div');
          const aTag = document.createElement('a');
          aTag.setAttribute('href', `${url}/commit/${logs[repo][branch][i].hash}`);
          aTag.setAttribute('target', '_blank');
          aTag.textContent = subject;
          line.append(aTag);
          html.append(line);
          count += 1;
        }
        i += 1;
      }
    }
    const divider = document.createElement('div');
    divider.classList.add('ui');
    divider.classList.add('divider');
    html.append(divider);

    return html;
  }
  document.querySelector('#log').innerHTML = '';
  config.repo.forEach((item) => {
    document.querySelector('#log').append(renderRepo(item.name, item.branch, item.http));
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
    let thisDate;
    while (true) {
      const logC = log[ind];
      thisDate = new Date(logC.authorDate);

      if (thisDate - lastUpdateDate[repo] > 0 && logC.subject.indexOf('Merge branch') < 0) {
        const noti = new window.Notification(logC.subject, {
          body: `${logC.authorName}: ${logC.authorDate}`,
        });
        noti.onclick = () => {
          onNotiClick(`${url}/commit/${logC.hash}`);
        };
      } else {
        break;
      }
      ind += 1;
    }
    lastUpdateDate[repo] = thisDate;
  }
  logs[repo][branch] = log;
  render();
}

function saveLog(repo, branch, url) {
  const opt = options;
  opt.repo = repo;
  const commits = gitlog(opt);

  setState(repo, branch, commits, url);
}

function fetchFromRepo(repo) {
  git(`./${repo.name}/`)
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
  if (!fs.existsSync(repo.name)) {
    git()
      .silent(true)
      .clone(repo.useSSH ? repo.ssh : repo.http)
      .then(() => fetchFromRepo(repo))
      .catch((err) => console.error('failed to clone: ', err));
  } else {
    fetchFromRepo(repo);
  }
}

config.repo.forEach((repo) => cloneIfNotExists(repo));

setInterval(fetchAllFromRepo, 3 * 60 * 1000);

document.querySelector('#notiCheck').addEventListener('click', () => {
  const noti = new window.Notification('알림 테스트!', { body: '알림이 오는지 확인해보세요!' });
});
