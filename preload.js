window.addEventListener('DOMContentLoaded', () => {
	const git = require('simple-git');
	const fs = require('fs');
	
	const config = require('./config.json');

	function cloneIfNotExists(repo) {
		if (!fs.existsSync(repo.split('/')[1].split('.git')[0])) {
		  git().silent(true)
		  .clone(repo)
		  .then(() => console.log('finished'))
		  .catch((err) => console.error('failed: ', err));
		}
	}
	
	config.repo.forEach((repo) => cloneIfNotExists(repo.address));
});