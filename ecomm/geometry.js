
const modelLoader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();

function createPlane(size, color, roughness) {
	const geo = new THREE.PlaneGeometry(size, size);
	const matt = new THREE.MeshPhysicalMaterial({
		color: color,
		roughness: roughness,
	})
	matt.map = textureLoader.load('../assets/textures/test.jpg');
	matt.map.wrapS = THREE.RepeatWrapping;
	matt.map.wrapT = THREE.RepeatWrapping;
	matt.map.repeat.set(8, 8)
	matt.bumpMap = textureLoader.load('../assets/textures/test.jpg');
	matt.bumpMap.wrapS = THREE.RepeatWrapping;
	matt.bumpMap.wrapT = THREE.RepeatWrapping;
	matt.bumpMap.repeat.set(8, 8)
	matt.bumpScale = 0.036;
	matt.clearCoat = 0.65;
	// matt = attribs;
	const mesh = new THREE.Mesh(
		geo,
		matt,
	)
	mesh.receiveShadow = true;
	return mesh;
}

function getSphere(size) {
	// create box
	let geometry = new THREE.SphereGeometry(size, 24, 24);
	let material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	material.fog = false;
	let mesh = new THREE.Mesh(
		geometry,
		material
	);
	return mesh;
}

// create 3d  model
function buildModel() {
	return new Promise((resolve, reject) => {


		modelLoader.load(modelData[sceneState.modelIndex].path + modelData[sceneState.modelIndex].modelFile, function(obj) {
			obj.scale.x = sceneSettings.modelScale;
			obj.scale.y = sceneSettings.modelScale;
			obj.scale.z = sceneSettings.modelScale;
			obj.position.z = 0;
			obj.position.y = 0;


			let texturedModel = initTextures(obj);

			// obj.castShadow = true;
			texturedModel.name = "furniture-model";
			resolve(texturedModel);
			// scene.add(obj);
		})
	})
}


// init Model textures
function initTextures(model) {
	const i = sceneState.modelIndex;
	const textures = modelData[i].textures;
	const defaultTexture = textures[textures.default];
	const targets = modelData[i].targets;
	let staticTextures = [];
	const loader = new THREE.TextureLoader();
	

	// load all textures into scene(prevents pop in when changing textures)
	Object.keys(textures).forEach(textID => {
		sceneSettings.maps.forEach(map => {
			if (modelData[i].textures[textID][map]) {
				if (typeof sceneState.textures[textID] == "undefined") sceneState.textures[textID] = {};
				sceneState.textures[textID][map] = loader.load( modelData[i].path + modelData[i].textures[textID][map] );
			}
		})
	});


	// find any set sttatic textures
	Object.keys(targets).forEach(targetID => {
		if (targets[targetID].static) {
			staticTextures.push({
				id: targetID,
				objects: targets[targetID].objects
			});

		}
	})
	// material
	// let material = new THREE.MeshPhysicalMaterial({
	// 	color: '#fff'
	// })
	// sceneState.materials.push(material)
	Object.keys(modelData[sceneState.modelIndex].targets).forEach(target => {
		console.log(target);
		sceneState.materials[target] = new THREE.MeshPhysicalMaterial({color:'#fff'});
		console.log(sceneState.materials)
	})

	// apply textures
	model.traverse(child => {
		console.log(child)
		console.log(child.name)
		let name = child.name;
		let applyTexture = defaultTexture;
		let textDataID = textures.default;
		
		// change texture for static children
		staticTextures.forEach(st => {
			if (st.objects.includes(name)) {
				Object.keys(textures).forEach(textID => {
					if (textures[textID].target == st.id) {
						applyTexture = textures[textID];
						textDataID = textID; 
					}
				});
			}
		})

		const materialCopy = sceneState.materials[applyTexture.target];
		console.log(materialCopy)

		let isTextureTarget = targets[applyTexture.target].objects.includes(name);
		// handle dynamic
		if (targets[applyTexture.target].objects.includes(name) && isTextureTarget) {
			child.material = materialCopy;
			sceneSettings.maps.forEach(map => {
				if (applyTexture[map]) {
					materialCopy[map] = sceneState.textures[textDataID][map];
					materialCopy[map].wrapS = THREE.RepeatWrapping;
					materialCopy[map].wrapT = THREE.RepeatWrapping;
					materialCopy[map].repeat.set(applyTexture.wrapS, applyTexture.wrapT)
				}

			})
		}
		// apply style properties to material
		if (applyTexture.styles && isTextureTarget) {
			Object.keys(applyTexture.styles).forEach(property => {
				materialCopy[property] = applyTexture.styles[property];
			})
		}
		//global object styles/settings
		if (modelData[i].objectSettings["*"]) {
			Object.keys(modelData[i].objectSettings["*"]).forEach(property => {
				child[property] = modelData[i].objectSettings["*"][property];
			})
		}
		// object specific settings/styles
		if (modelData[i].objectSettings && Object.keys(modelData[i].objectSettings).includes(name)) {
			Object.keys(modelData[i].objectSettings[name]).forEach(property => {
				child[property] = modelData[i].objectSettings[name][property];
			})
		}
	})

	return model;

}