window.addEventListener('DOMContentLoaded', () => {
  const git = require('simple-git');
  const fs = require('fs');

  const config = require('./config.json');

  function cloneIfNotExists(repo) {
    if (!fs.existsSync(repo.name)) {
      git()
        .silent(true)
        .clone(repo.address, { '-b': repo.branch, '--single-branch': repo.address })
        .then(() => console.log('finished'))
        .catch((err) => console.error('failed: ', err));
    }
  }

  config.repo.forEach((repo) => cloneIfNotExists(repo));
});
