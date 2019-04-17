// notify render to focus on object
function centerCamera() {
	modelInstance.centerCamera();
}

// remove loading notification
function clearLoading() {
	setTimeout(() => {
		modelInstance.loading.is = false;
	}, 500)
}


function swatchEvent(textID) {
	if (modelInstance.swatch !== textID && !modelInstance.loading.is) 
		modelInstance.changeSwatch(textID);
}






