function generateModelButtons() {
	const buttons = document.createElement("div");
	buttons.id = "model-selection";
	modelData.forEach((model, i) => {
		let button = document.createElement('button');
		button.addEventListener('click', e => notifyChangeModel(i));
		button.style.background = "url("+ model.path + model.icon + ") no-repeat center";
		button.style.backgroundSize = "cover";
		buttons.appendChild(button); 
	})
	document.getElementById('scene-controls').prepend(buttons);
}