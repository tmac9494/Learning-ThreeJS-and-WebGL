function generateModelButtons() {
	const buttons = document.createElement("div");
	buttons.id = "model-selection";
	modelData.forEach((model, i) => {
		let button = document.createElement('button');
		button.addEventListener('click', e => {
			if (i !== modelInstance.index && !modelInstance.loading.is) modelInstance.changeModel(i);
		});
		button.style.background = "url("+ model.path + model.icon + ") no-repeat center";
		button.style.backgroundSize = "cover";
		buttons.appendChild(button); 
	})
	document.getElementById('scene-controls').prepend(buttons);
}