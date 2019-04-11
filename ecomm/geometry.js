
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


		modelLoader.load('../assets/models/love-seat/t-low-poly.obj', function(obj) {
			// let materialTexture = textureLoader.load('../assets/models/love-seat/texture/Homespun_Cream_dif.jpg');
			// let materialBumpMap = textureLoader.load('../assets/models/love-seat/texture/Homespun_Cream_bump.jpg');
			// let materialNormalMap = textureLoader.load('../assets/models/love-seat/texture/Homespun_Cream_normal.jpg');

			// let woodTexture = textureLoader.load('../assets/models/love-seat/texture/ArchiCGI_wood_wallnut_diff.jpg');
			// let woodLight = textureLoader.load('../assets/models/love-seat/texture/ArchiCGI_wood_wallnut_refl.jpg');
			// let woodBump = textureLoader.load('../assets/models/love-seat/texture/ArchiCGI_wood_wallnut_refl.jpg');

			// let materialMaster = new THREE.MeshPhysicalMaterial({
			// 	color: '#fff'
			// })
			// let materialMasterAlt = new THREE.MeshPhysicalMaterial({
			// 	color: '#fff'
			// })
			obj.scale.x = sceneSettings.modelScale;
			obj.scale.y = sceneSettings.modelScale;
			obj.scale.z = sceneSettings.modelScale;
			obj.position.z = 0;
			obj.position.y = 0;


			let texturedModel = initTextures(obj);

			// obj.traverse(child => {
			// 	child.castShadow = true;
			// 	if (child.name == "Sofa_2") child.receiveShadow = true;
			// 	if (child.name == "Shape048") child.receiveShadow = true;
			// 	if (child.name == "Sofa_2" || child.name == "Sofa2_pillows001" || child.name == "Shape048") {
			// 		child.material = materialMaster;
			// 		materialMaster.map = materialTexture;
			// 		materialMaster.map.wrapS = THREE.RepeatWrapping;
			// 		materialMaster.map.wrapT = THREE.RepeatWrapping;
			// 		materialMaster.map.repeat.set(1, 1);
			// 		materialMaster.bumpMap = materialBumpMap;
			// 		materialMaster.bumpScale = .05;
			// 		materialMaster.bumpMap.wrapS = THREE.RepeatWrapping;
			// 		materialMaster.bumpMap.wrapT = THREE.RepeatWrapping;
			// 		materialMaster.bumpMap.repeat.set(1, 1);
			// 		materialMaster.normalMap = materialNormalMap;
			// 		materialMaster.normalMap.wrapS = THREE.RepeatWrapping;
			// 		materialMaster.normalMap.wrapT = THREE.RepeatWrapping;
			// 		materialMaster.normalMap.repeat.set(1, 1);
			// 		materialMaster.roughness = 1;
			// 	}
			// 	if (child.name == "ChamferCyl002") {
			// 		child.material = materialMasterAlt;
			// 		materialMasterAlt.map = woodTexture;
			// 		materialMasterAlt.map.wrapS = THREE.RepeatWrapping;
			// 		materialMasterAlt.map.wrapT = THREE.RepeatWrapping;
			// 		materialMasterAlt.roughnessMap = woodLight;
			// 		materialMasterAlt.roughnessMap.wrapS = THREE.RepeatWrapping;
			// 		materialMasterAlt.roughnessMap.wrapT = THREE.RepeatWrapping;
			// 		materialMasterAlt.roughness = 1;
			// 		materialMasterAlt.roughnessMap.repeat.set(1, 1);
			// 		materialMasterAlt.clearCoat = .2;
			// 		materialMasterAlt.bumpMap = woodBump;
			// 		materialMasterAlt.bumpScale = .02;
			// 		materialMasterAlt.bumpMap.wrapS = THREE.RepeatWrapping;
			// 		materialMasterAlt.bumpMap.wrapT = THREE.RepeatWrapping;
			// 		materialMasterAlt.bumpMap.repeat.set(1, 1);
			// 		child.receiveShadow = true;
			// 	}

			// })


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

	// apply textures
	model.traverse(child => {
		// material
		const material = new THREE.MeshPhysicalMaterial({
			color: '#fff'
		})
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

		let isTextureTarget = targets[applyTexture.target].objects.includes(name);
		// handle dynamic
		if (targets[applyTexture.target].objects.includes(name) && isTextureTarget) {
			child.material = material;
			sceneSettings.maps.forEach(map => {
				if (applyTexture[map]) {
					material[map] = sceneState.textures[textDataID][map];
					material[map].wrapS = THREE.RepeatWrapping;
					material[map].wrapT = THREE.RepeatWrapping;
					material[map].repeat.set(applyTexture.wrapS, applyTexture.wrapT)
				}

			})
		}
		// apply style properties to material
		if (applyTexture.styles && isTextureTarget) {
			Object.keys(applyTexture.styles).forEach(property => {
				material[property] = applyTexture.styles[property];
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