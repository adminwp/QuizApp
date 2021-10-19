import Quiz from './Quiz';
import { saveUserInStorage, checkUserInStorage } from './Storage';
import { validate } from './validation';
import { getUser, updateUserProfile } from './User';
import { checkInternet } from './Internet';
const quizObject = new Quiz();
class UI {
	constructor() {
		this.objectPassLoadQuestion = {
			createElementFn: this.createElement,
			loaderFn: this.loading,
			loadingElement: document.querySelector('.loading'),
			quizContent: document.querySelector('.quiz__content'),
		};
	}

	async render() {
		this.formEffect();
		await checkInternet();
		await this.checkUser();
	}

	async checkUser() {
		const { startQuiz, completeQuiz } = quizObject;

		if (checkUserInStorage('quizUser')) {
			const user = getUser();

			console.log(user);
			if (
				user.hasOwnProperty('completeQuiz') &&
				user.completeQuiz === 'yes'
			) {
				await completeQuiz().getCompleteQuiz();
			} else {
				const updateUser = await updateUserProfile();
				const updateQuizStart = await updateUser.quizStart();

				document.querySelector('.quiz__start').classList.remove('active');
				document.querySelector('.quiz__profile').classList.add('active');
				document
					.querySelector('.quiz__start-btn')
					.addEventListener(
						'click',
						startQuiz.bind(null, this.objectPassLoadQuestion)
					);

				console.log('updateUser', updateUser);
				console.log('updateQuizStart', updateQuizStart);
			}
		} else {
			document.querySelector('.quiz__start').classList.add('active');
			const submitButton = document.querySelector('.quiz__form ');
			submitButton.addEventListener('submit', (e) => {
				this.submitForm(e, startQuiz, this.objectPassLoadQuestion);
			});
		}
	}

	loading() {
		const loader = ` <div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					style="margin: auto; background: rgb(241, 242, 243); display: block; shape-rendering: auto;"
					width="220px"
					height="220px"
					viewBox="0 0 100 100"
					preserveAspectRatio="xMidYMid"
				>
					<path
						fill="none"
						stroke="#607d8b"
						stroke-width="8"
						stroke-dasharray="233.4959246826172 23.093003540039064"
						d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
						stroke-linecap="round"
						style="transform:scale(0.8);transform-origin:50px 50px"
					>
						<animate
							attributeName="stroke-dashoffset"
							repeatCount="indefinite"
							dur="1s"
							keyTimes="0;1"
							values="0;256.58892822265625"
						></animate>
					</path>
				</svg>
			 `;

		console.log(loader);
		return {
			showLoading(appendElement, show) {
				if (show) {
					appendElement.innerHTML = loader;
				} else {
					while (appendElement.firstElementChild) {
						appendElement.firstElementChild.remove();
					}
				}
			},
		};
	}

	createElement({ options, question }) {
		const content = (
			<div class="quiz__container">
				<h2 class="quiz__question">{question}</h2>
				<div class="quiz__list">
					{options.map((option) => {
						return (
							<button class="quiz__item" data-currect={option.currect}>
								{option.answer}
							</button>
						);
					})}
				</div>
			</div>
		);

		return {
			getContent: content,
		};
	}

	formEffect() {
		Array.from(document.querySelectorAll('.quiz__form-input')).forEach(
			(input) => {
				input.addEventListener('focus', (e) => {
					const input = e.target;
					const wrapperInput = e.target.nextElementSibling;
					const label = e.target.previousElementSibling;
					wrapperInput.classList.add('active');
					label.classList.add('active-label');
				});

				input.addEventListener('blur', (e) => {
					const input = e.target;
					const wrapperInput = e.target.nextElementSibling;
					const label = e.target.previousElementSibling;

					if (input.value.trim() === '') {
						wrapperInput.classList.remove('active');
						label.classList.remove('active-label');
					} else {
						wrapperInput.classList.add('active');
						label.classList.add('active-label');
					}
				});
			}
		);
		const selectBox = document.querySelector('.quiz__form-select');

		const selectInput = document.querySelector('.select-input');

		const selexBoxActive = (e) => {
			const { target } = e;
			selectBox.classList.add('active');
			document.querySelector('.quiz__form-submit').classList.add('active');
			if (selectInput.value.trim() !== '') {
				selectBox.nextElementSibling.classList.add('active');
			}
		};

		const activeOption = (e) => {
			const { currentTarget } = e;
			const selectControl = document.querySelector('.select-control');
			const data = currentTarget.getAttribute('data-value');
			selectInput.value = data;
			if (selectInput.value.trim() !== '') {
				selectInput.setAttribute('data-value', selectInput.value);
			}

			document
				.querySelector('.quiz__form-submit')
				.classList.remove('active');
			selectBox.classList.remove('active');

			if (selectInput.value.trim() !== '') {
				selectControl
					.querySelector('.quiz__form-label')
					.classList.add('active');
				selectControl
					.querySelector('.quiz__form-border')
					.classList.add('active');
			}
		};

		selectInput.addEventListener('focus', selexBoxActive);
		selectInput.addEventListener('blur', (e) => {
			const { target } = e;

			if (target.value.trim() === '') {
				document
					.querySelector('.quiz__form-submit')
					.classList.remove('active');
			}
		});

		document.querySelectorAll('.quiz__form-option').forEach((option) => {
			option.addEventListener('click', activeOption);
		});
	}

	async submitForm(e, startQuiz, objectPassLoadQuestion) {
		e.preventDefault();
		const user = validate();
		if (user) {
			await saveUserInStorage('quizUser', user);
			const updateProfile = await updateUserProfile();
			await updateProfile.quizStart();

			document.querySelector('.quiz__start').classList.remove('active');
			document.querySelector('.quiz__profile').classList.add('active');
		}

		document
			.querySelector('.quiz__start-btn')
			.addEventListener(
				'click',
				startQuiz.bind(null, objectPassLoadQuestion)
			);

		// const isvalid = validate();
		// if (isvalid) {
		// 	console.log(isvalid);
		// 	this.store.saveUserInStorage(isvalid);

		// this.user.updateUserProfile().then(() => {
		// 	 loadQuestions(quizList, this.objectPassLoadQuiz);
		// 	document.querySelector('.quiz__main').classList.add('active');
		// 	document.querySelector('.quiz__profile').classList.add('active');
		// 	document.querySelector('.quiz__start').remove('remove');
		// });
	}
}

export default UI;
