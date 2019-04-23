// notify render to focus on object
function centerCamera() {
	modelInstance.centerCamera();
}

// remove loading notification
function clearLoading() {
	setTimeout(() => {
		modelInstance.loading.is = false;
	}, 1500)
}

// change swatch event handler
function swatchEvent(textID) {
	if (modelInstance.textureHandler.swatch !== textID && !modelInstance.loading.is) 
		modelInstance.textureHandler.changeSwatch(textID);
}


// test for reading children of object from console
function readChildren(pathFromModelsPath) {
	loader.load('../assets/models/' + pathFromModelsPath, obj => {
		console.log(obj);
		obj.children.forEach(child => {
			console.log(child.name);
		})
	});
	const loader = new THREE.OBJLoader();
}





