// class Storage {
// 	constructor() {
// 		this.nameStoreQuiz = 'quizUser';
// 		this.isEmptyStore = this.isEmptyStore.bind(this);
// 		this.checkUserInStorage = this.checkUserInStorage.bind(this);
// 		this.saveUserInStorage = this.saveUserInStorage.bind(this);
// 		this.updateUserInStorage = this.updateUserInStorage.bind(this);
// 		this.getUserFromStorage = this.getUserFromStorage.bind(this);
// 	}

// 	isEmptyStore(nameStoreQuiz) {
// 		return localStorage.getItem(nameStoreQuiz) === null;
// 	}

// 	checkUserInStorage(nameStoreQuiz) {
// 		if (
// 			!this.isEmptyStore(nameStoreQuiz) &&
// 			localStorage.getItem(nameStoreQuiz)
// 		)
// 			return true;
// 		return false;
// 	}

// 	saveUserInStorage(nameStoreQuiz, { name, email, gender }) {
// 		if (this.isEmptyStore(nameStoreQuiz)) {
// 			localStorage.setItem(
// 				nameStoreQuiz,
// 				JSON.stringify({
// 					name,
// 					email,
// 					gender,
// 				})
// 			);
// 		}
// 	}

// 	updateUserInStorage(
// 		nameStoreQuiz,
// 		{
// 			name,
// 			email,
// 			gender,
// 			completeQuiz = 'NO',
// 			currect = null,
// 			wrong = null,
// 			startQuiz = 'Yes',
// 		}
// 	) {
// 		if (
// 			localStorage.getItem(nameStoreQuiz) !== null ||
// 			localStorage.getItem(nameStoreQuiz) !== undefined ||
// 			localStorage.getItem(nameStoreQuiz) !== ''
// 		) {
// 			localStorage.setItem(
// 				this.nameStoreQuiz,
// 				JSON.stringify({
// 					name,
// 					email,
// 					gender,
// 					completeQuiz,
// 					currect,
// 					wrong,
// 					startQuiz,
// 				})
// 			);
// 		}
// 	}

// 	getUserFromStorage(nameStoreQuiz) {
// 		if (!this.isEmptyStore(nameStoreQuiz)) {
// 			const user = JSON.parse(localStorage.getItem(nameStoreQuiz));
// 			return user;
// 		}

// 		return false;
// 	}
// }

// export default Storage;

function isEmptyStore(nameStoreQuiz) {
	return localStorage.getItem(nameStoreQuiz) === null;
}

function checkUserInStorage(nameStoreQuiz) {
	if (!isEmptyStore(nameStoreQuiz) && localStorage.getItem(nameStoreQuiz)) {
		return true;
	}
	return false;
}

function saveUserInStorage(nameStoreQuiz, { name, email, gender }) {
	if (isEmptyStore(nameStoreQuiz)) {
		localStorage.setItem(
			nameStoreQuiz,
			JSON.stringify({
				name,
				email,
				gender,
			})
		);
	}
}

function updateUserInStorage(
	nameStoreQuiz,
	{
		name,
		email,
		gender,
		completeQuiz = 'NO',
		currect = null,
		wrong = null,
		startQuiz = 'Yes',
	}
) {
	if (
		localStorage.getItem(nameStoreQuiz) !== null ||
		localStorage.getItem(nameStoreQuiz) !== undefined ||
		localStorage.getItem(nameStoreQuiz) !== ''
	) {
		localStorage.setItem(
			nameStoreQuiz,
			JSON.stringify({
				name,
				email,
				gender,
				completeQuiz,
				currect,
				wrong,
				startQuiz,
			})
		);
	}
}

function getUserFromStorage(nameStoreQuiz) {
	if (!isEmptyStore(nameStoreQuiz)) {
		const user = JSON.parse(localStorage.getItem(nameStoreQuiz));
		return user;
	}

	return false;
}

export {
	isEmptyStore,
	checkUserInStorage,
	saveUserInStorage,
	updateUserInStorage,
	getUserFromStorage,
};
