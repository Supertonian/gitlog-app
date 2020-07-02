// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const git = require('simple-git');
const config = require('./config.json');

function saveLog() {
	
}

function fetchFromRepo() {
	console.log('fetching ..');
	
	config.repo.forEach((repo) => {
		repo.branch.forEach((branch) => {
			git().silent(true)
			  .fetch(repo.address, branch)
			  .then((result) => {console.log('finished');console.log(result);})
			  .catch((err) => console.error('failed: ', err));
		});
	});
	
	console.log('fetching finished ..');
}

setInterval(fetchFromRepo, 60*1000);

document.querySelector('#notiCheck').addEventListener('click', () => new window.Notification('알림 테스트!', { body: '알림이 오는지 확인해보세요!'}));