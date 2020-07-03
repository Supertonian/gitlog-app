window.addEventListener('DOMContentLoaded', () => {
  // pre-draw tables
  const config = require('./config.json');

  config.repo.forEach((item, index) => {
    console.log('draw here', item, index);
  });
});
