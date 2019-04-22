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


function swatchEvent(textID) {
	if (modelInstance.textureHandler.swatch !== textID && !modelInstance.loading.is) 
		modelInstance.textureHandler.changeSwatch(textID);
}






