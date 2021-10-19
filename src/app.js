import './scss/app.scss';
import UI from './components/UI';

// New Instance
const ui = new UI();

// Add Event DOMContentLoaded ON document
document.addEventListener('DOMContentLoaded', (e) => {
	ui.render();
});
