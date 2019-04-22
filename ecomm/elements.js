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



function generateSwatchButtons() {
	const element = document.getElementById('swatch-controls');
	// clean up on change
	if (element.children.length) {
		for (let i = 0;i < element.children.length;i++) {
			element.children[i].removeEventListener('click', swatchEvent);
			element.children[i].remove();
		}
	}
	element.innerHTML = "";
	// generate
	Object.keys(modelInstance.data[modelInstance.index].textures).forEach(textID => {
		let texture = modelInstance.data[modelInstance.index].textures[textID];
		if (textID !== "default" && texture.selectable) {
			let button = document.createElement('button');
			button.addEventListener('click', e => swatchEvent(textID))
			button.style.background = "url("+ modelInstance.data[modelInstance.index].path + texture.map + ") no-repeat center";
			button.style.backgroundSize = "cover";
			element.appendChild(button);
		}
	})
}