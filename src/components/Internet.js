import { offlineUser, onlineUser } from './User';

function checkInternet() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open(
			'GET',
			'https://jsonplaceholder.typicode.com/users/1/posts',
			true
		);

		xhr.addEventListener('load', () => {
			if (xhr.status === 200 && xhr.status < 300) {
				onlineUser().then((result) =>
					resolve({ message: 'User is Online now' })
				);
			} else {
				offlineUser();
			}
		});

		xhr.addEventListener('error', () => {
			offlineUser();
		});

		xhr.send();
	});
}

export { checkInternet };
