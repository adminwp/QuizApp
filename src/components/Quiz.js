import questionsList from '../quizList.json';
import { getUser, updateUserProfile } from './User';
import { getUserFromStorage, updateUserInStorage } from './Storage';
class Quiz {
	constructor() {
		this.apiURL = questionsList;
		this.completeQuiz = this.completeQuiz.bind(this);
		this.startQuiz = this.startQuiz.bind(this);
		this.testQuiz = this.testQuiz.bind(this);
		this.currectQuestionIndex = 0;
		this.wrongQuestion = 0;
		this.currectQuestion = 0;
		this.quizTimeDilay = 3;
	}

	async getQuestions() {
		const questionList = await fetch(this.apiURL);
		return questionList.json();
	}

	completeProgressQuiz(questionLength, nextElement, previousElement) {
		const el = document.querySelector('.quiz__complete-data');
		const head = document.querySelector('head');
		const style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		let css;
		const newValue = 100 / questionLength;
		const getValueAttr = el.getAttribute('data-value');
		let sumValue = Number(getValueAttr.split(/px|%/g)[0]) + newValue;
		const setProgressValue = (el, value, styleTag) => {
			el.setAttribute('data-value', String(`${value}%`));
			css = `.quiz__complete-data::after {content: ''; width: ${value}%; }`;
			if (styleTag.styleSheet) {
				styleTag.styleSheet.cssText = css;
			} else {
				styleTag.appendChild(document.createTextNode(css));
			}

			console.log('Value Progress Bar ', value);
			document.querySelector(
				'.quiz__complete-value'
			).innerHTML = `${value}%`;

			head.appendChild(style);
		};
		const loadProgressValue = () => {
			const getWidthEl = getComputedStyle(el, '::after').width.split(
				/px|%/g
			)[0];
			console.log(getWidthEl);
			if (getWidthEl !== '0') {
				setProgressValue(el, sumValue, style);
				console.log('IF');
			} else {
				console.log('ELSE');
				setProgressValue(el, newValue, style);
			}
		};

		if (nextElement) {
			setProgressValue(el, sumValue, style);
		}

		if (previousElement) {
			let value = Number(getValueAttr.split(/px|%/g)[0]) - newValue;
			setProgressValue(el, value, style);
		} else {
			loadProgressValue();
		}
	}

	checkQuiz() {
		const runCheckQuiz = (e) => {
			const { target } = e;
			if (target.matches('.quiz__item')) {
				if (target.getAttribute('data-currect') === 'true') {
					// currect++;
					this.currectQuestion++;
					target.classList.add('currect');
				} else {
					// wrong++;
					this.wrongQuestion++;
					target.classList.add('wrong');
				}
			}
		};

		const activeQuizButton = () => {
			document.querySelector('.quiz__next-btn').disabled = false;
		};

		const disabledQuizButtons = () => {
			Array.from(document.querySelectorAll('.quiz__item')).forEach(
				(quiz) => (quiz.disabled = true)
			);
		};

		console.log(this);
		return { runCheckQuiz, activeQuizButton, disabledQuizButtons };
	}

	startQuiz({ createElementFn, loaderFn, loadingElement, quizContent }) {
		document.querySelector('.quiz__main').classList.add('active');
		document.querySelector('.quiz__profile').classList.remove('active');
		document.querySelector('.quiz__start').classList.remove('active');
		this.loadQuestions({
			createElementFn,
			loaderFn,
			loadingElement,
			quizContent,
		});
	}

	completeQuiz() {
		const getCompleteQuiz = async () => {
			const updateUser = await updateUserProfile();
			const { wrong, currect } = getUser();
			await updateUser.quizComplete({
				wrong,
				currect,
			});

			document
				.querySelector('.quiz__again-btn')
				.addEventListener('click', (e) => {
					const user = getUserFromStorage('quizUser');
					updateUserInStorage('quizUser', {
						name: user.name,
						email: user.email,
						gender: user.gender,
						completeQuiz: 'no',
						currect: null,
						wrong: null,
						startQuiz: 'yes',
					});

					location.reload();
				});
		};

		const setCompleteQuiz = async () => {
			// updateUserProfile().then(async (result) => {
			// 	await result.quizComplete({
			// 		wrong: this.wrongQuestion,
			// 		currect: this.currectQuestion,
			// 	});
			// });

			const updateUser = await updateUserProfile();
			await updateUser.quizComplete({
				wrong: this.wrongQuestion,
				currect: this.currectQuestion,
			});
		};

		document
			.querySelector('.quiz__complete-data')
			.setAttribute('data-value', '100%');

		return {
			getCompleteQuiz,
			setCompleteQuiz,
		};
	}

	deleteAllQuestions(quizContent) {
		return new Promise((resolve, reject) => {
			while (quizContent.firstElementChild) {
				quizContent.firstElementChild.remove();
			}

			if (!quizContent.firstElementChild) {
				resolve('Deleted All Quiz');
			}
		});
	}

	addQuestion({
		options,
		question,
		loaderFn,
		loadingElement,
		createElementFn,
		quizContent,
	}) {
		return new Promise((resolve, reject) => {
			const loading = loaderFn();
			console.log('this in add Quiz Method', this);
			loading.showLoading(loadingElement, true);

			// Call createElement FN
			const { getContent } = createElementFn({
				options,
				question,
			});

			const content = getContent;

			// quizContent.classList.remove('active-content');
			// quizContent.classList.remove('active');
			quizContent.classList.remove('active');

			this.deleteAllQuestions(quizContent).then((result) => {
				setTimeout(() => {
					loading.showLoading(loadingElement, false);
					quizContent.appendChild(content);
					quizContent.classList.add('active');

					resolve({
						message: 'Added Quiz Complete',
					});
				}, 1000 * this.quizTimeDilay);
			});
		});
	}

	async nextQuestion({
		questionLength,
		options,
		question,
		loaderFn,
		loadingElement,
		createElementFn,
		quizContent,
	}) {
		await this.addQuestion({
			options,
			question,
			loaderFn,
			loadingElement,
			createElementFn,
			quizContent,
		});

		this.completeProgressQuiz(questionLength, true, false);

		this.testQuiz();

		return { message: 'Next Quiz' };
	}

	async bacKQuestion({
		questionLength,
		options,
		question,
		loaderFn,
		loadingElement,
		createElementFn,
		quizContent,
	}) {
		// await this.addQuestion({
		// 	options,
		// 	question,
		// 	loaderFn,
		// 	loadingElement,
		// 	createElementFn,
		// 	quizContent,
		// }).then((result) => {
		// 	console.log(result);
		// 	this.testQuiz();
		// });

		await this.addQuestion({
			options,
			question,
			loaderFn,
			loadingElement,
			createElementFn,
			quizContent,
		});
		this.testQuiz();

		this.completeProgressQuiz(questionLength, false, true);
	}

	async loadQuestions({
		createElementFn,
		loaderFn,
		loadingElement,
		quizContent,
	}) {
		try {
			const { testQuiz } = this;

			const questionsList = await this.getQuestions();
			console.log({ 'Questions List': questionsList });
			// let quizIndex = 0;

			let questionNumber = 1;
			const questionLength = questionsList.length;
			const quizNumberNum = document.querySelector('.quiz__number-num');
			const quizNumberLength = document.querySelector(
				'.quiz__number-length'
			);

			quizNumberLength.innerHTML = questionLength;
			quizNumberNum.innerHTML = questionNumber;

			await this.addQuestion({
				question: questionsList[this.currectQuestionIndex].question,
				options: questionsList[this.currectQuestionIndex].options,
				createElementFn,
				loaderFn,
				loadingElement,
				quizContent,
			}).then((result) => {
				testQuiz();
			});

			const checkQuestionIndex = (quizIndex) => {
				if (quizIndex > 0) {
					console.log('Quiz Index > 0', quizIndex);
					const quizBackButton = document.querySelector('.quiz__back-btn');

					quizBackButton.disabled = false;
					quizBackButton.addEventListener('click', questionBackFn);
				}
			};

			const questionBackFn = async (e) => {
				// quizIndex--;
				this.currectQuestionIndex--;
				questionNumber--;
				quizNumberNum.innerHTML = questionNumber;

				if (questionsList[this.currectQuestionIndex] !== undefined) {
					await this.bacKQuestion({
						questionLength,
						question: questionsList[this.currectQuestionIndex].question,
						options: questionsList[this.currectQuestionIndex].options,
						createElementFn,
						loaderFn,
						loadingElement,
						quizContent,
					});
				}

				if (this.currectQuestionIndex === 0) {
					e.target.disabled = true;
				}
			};

			const questionNextFn = async (e) => {
				if (this.currectQuestionIndex === questionsList.length - 1) {
					this.completeProgressQuiz(questionLength, true, false);
					setTimeout(async () => {
						await this.completeQuiz().setCompleteQuiz();
						await this.completeQuiz().getCompleteQuiz();
					}, 800);
				} else {
					e.target.disabled = true;
					this.currectQuestionIndex++;
					questionNumber++;

					await this.nextQuestion({
						questionLength: questionLength,
						question: questionsList[this.currectQuestionIndex].question,
						options: questionsList[this.currectQuestionIndex].options,
						createElementFn,
						loaderFn,
						loadingElement,
						quizContent,
					});
					checkQuestionIndex(this.currectQuestionIndex);
					quizNumberNum.innerHTML = questionNumber;
				}
			};
			document
				.querySelector('.quiz__next-btn')
				.addEventListener('click', questionNextFn);
		} catch (error) {
			console.error(error);
		}
	}

	testQuiz() {
		const {
			activeQuizButton,
			runCheckQuiz,
			disabledQuizButtons,
		} = this.checkQuiz();
		document.querySelector('.quiz__list').addEventListener('click', (e) => {
			runCheckQuiz(e);
			if (this.currectQuestion) {
				disabledQuizButtons();
				activeQuizButton();
			}

			if (this.wrongQuestion) {
				const currectQuizButton = document.querySelector(
					'.quiz__item[data-currect="true"]'
				);
				if (currectQuizButton) {
					currectQuizButton.classList.add('currect');
					disabledQuizButtons();
					activeQuizButton();
				}
			}

			console.log('Quiz Item', e.target);
		});
	}
}

export default Quiz;
