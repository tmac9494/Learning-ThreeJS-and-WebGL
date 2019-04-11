// notify render to focus on object
function centerCamera() {
	sceneState.centerRequest = !sceneState.centerRequest;
}

// change state to identify new texture and notify render it needs to be applied
function swatchChange(id) {
	console.log(id);
	sceneState.swatchChange.texture = id;
	sceneState.swatchChange.new = true;
}

// swatch change after initModelTextures and initial render
function swatchHandler(textID, scene) {
	if (sceneState.swatchChange.new) {
		const targets = modelData[sceneState.modelIndex].targets[modelData[sceneState.modelIndex].textures[textID].target].objects;
		const applyTexture = modelData[sceneState.modelIndex].textures[textID];
		const loader = new THREE.TextureLoader();
		console.log(targets);
		// apply maps to material
		targets.forEach(target => {
			const obj = scene.getObjectByName(target);
			sceneSettings.maps.forEach(mapName => {
				if (applyTexture[mapName]) {
					obj.material[mapName] = sceneState.textures[textID][mapName];
					obj.material[mapName].wrapS = THREE.RepeatWrapping;
					obj.material[mapName].wrapT = THREE.RepeatWrapping;
					obj.material[mapName].repeat.set(applyTexture.wrapS, applyTexture.wrapT)
				}
			})
			// apply style properties to material
			if (applyTexture.styles) {
				Object.keys(applyTexture.styles).forEach(property => {
					obj.material[property] = applyTexture.styles[property];
				})
			}
		})
	}
}