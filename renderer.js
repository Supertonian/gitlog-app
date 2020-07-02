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

    const title = document.createElement('div');
    title.innerHTML = `<span class="repoTitle">${repo}</span> <span class="repoBranch">${branch}</span>`;

    html.append(title);

    if (logs[repo][branch]) {
      for (let i = 0; i < 10; i += 1) {
        const line = document.createElement('div');
        const aTag = document.createElement('a');
        aTag.setAttribute('href', `${url}/commit/${logs[repo][branch][i].hash}`);
        aTag.setAttribute('target', '_blank');
        aTag.textContent = logs[repo][branch][i].subject;
        line.append(aTag);
        html.append(line);
      }
    }
    html.append(document.createElement('hr'));
    return html;
  }
  document.querySelector('#log').innerHTML = '';
  config.repo.forEach((item) => {
    document.querySelector('#log').append(renderRepo(item.name, item.branch, item.httpAddress));
  });

  document.querySelectorAll('.repoTitle').forEach((item) => (item.style.color = 'red'));
  document.querySelectorAll('.repoBranch').forEach((item) => (item.style.color = 'green'));
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
    const thisDate = new Date(log[0].authorDate);

    if (thisDate - lastUpdateDate[repo] > 0) {
      const noti = new window.Notification(log[1].subject, {
        body: `${log[1].authorName}: ${log[1].authorDate}`,
      });
      noti.onclick = () => {
        onNotiClick(url + '/commit/' + log[1].hash);
      };
      lastUpdateDate[repo] = thisDate;
    }
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
    .pull(repo.address, repo.branch)
    .then(() => {
      saveLog(repo.name, repo.branch, repo.httpAddress);
    })
    .catch((err) => console.error('failed: ', err));
}

function fetchAllFromRepo(repo) {
  config.repo.forEach((item) => fetchFromRepo(item));
}

function cloneIfNotExists(repo) {
  if (!fs.existsSync(repo.name)) {
    git()
      .silent(true)
      .clone(repo.address)
      .then(() => fetchFromRepo(repo))
      .catch((err) => console.error('failed: ', err));
  }
}

config.repo.forEach((repo) => cloneIfNotExists(repo));

setInterval(fetchAllFromRepo, 60 * 1000);

document.querySelector('#notiCheck').addEventListener('click', () => {
  const noti = new window.Notification('알림 테스트!', { body: '알림이 오는지 확인해보세요!' });
});
