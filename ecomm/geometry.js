
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

class textureHandler {
	constructor(model, swatch, statics) {
		this.textures = {};
		this.staticTexts = (statics || []);
		this.swatch = swatch;
		this.targets = modelInstance.data[modelInstance.index].targets;
		this.materials = {};
		this.model = model;
		this.loader = new THREE.TextureLoader();
	}

	init() {
		const data = modelInstance.data;
		const i = modelInstance.index;
		const textures = modelInstance.data[i].textures;

		// load all textures into scene(prevents pop in when changing textures)
		Object.keys(textures).forEach(textID => {
			sceneSettings.maps.forEach(map => {
				if (textures[textID][map]) {
					if (typeof this.textures[textID] == "undefined") this.textures[textID] = {};
					this.textures[textID][map] = this.loader.load( data[i].path + textures[textID][map] );
					console.log('-------- texture loaded - ' + textID + ' -- ' + map);
				}
			})
		});

		// create materials for different material children
		Object.keys(this.targets).forEach(target => {
			this.materials[target] = new THREE.MeshPhysicalMaterial({color:'#fff'});
		})

		this.model.traverse(child => {
			let name = child.name;
			let applyTexture = textures[this.swatch];
			let textDataID = this.swatch;
			
			// change texture for static children
			this.staticTexts.forEach(st => {
				if (st.objects.includes(name)) {
					Object.keys(textures).forEach(textID => {
						if (textures[textID].target == st.id) {
							applyTexture = textures[textID];
							textDataID = textID; 
						}
					});
				}
			})

			let isTextureTarget = this.targets[applyTexture.target].objects.includes(name);
			// handle dynamic
			if (isTextureTarget) {
				child.material = this.materials[applyTexture.target];
				sceneSettings.maps.forEach(map => {
					if (applyTexture[map]) {
						this.materials[applyTexture.target][map] = this.textures[textDataID][map];
						this.materials[applyTexture.target][map].wrapS = THREE.RepeatWrapping;
						this.materials[applyTexture.target][map].wrapT = THREE.RepeatWrapping;
						this.materials[applyTexture.target][map].repeat.set(applyTexture.wrapS, applyTexture.wrapT)
					}

				})
			}

			// apply style properties to material
			if (applyTexture.styles && isTextureTarget) 
				Object.keys(applyTexture.styles).forEach(property => child.material[property] = applyTexture.styles[property] );

			// settings
			const settings = modelInstance.data[i].objectSettings;

			//global object styles/settings
			if (settings["*"]) 
				Object.keys(settings["*"]).forEach(property => child[property] = settings["*"][property] );

			// object specific settings/styles
			if (settings && Object.keys(settings).includes(name)) 
				Object.keys(settings[name]).forEach(property => child[property] = settings[name][property] );

		}) // end trverse
		return this.model;
		this.model = null;
	}

	changeSwatch(swatchID) {
		const data = modelInstance.data;
		const i = modelInstance.index;
		let texture = data[i].textures[swatchID];
		this.targets = data[i].targets[texture.target].objects;
		this.targets.forEach(target => {
			let obj = modelInstance.scene.getObjectByName(target);
			sceneSettings.maps.forEach(map => {
				if (texture[map]) {
					obj.material[map] = this.textures[swatchID][map];
					obj.material[map].wrapS = THREE.RepeatWrapping;
					obj.material[map].wrapT = THREE.RepeatWrapping;
					obj.material[map].repeat.set(texture.wrapS, texture.wrapT)
				}
			})
				// apply style properties to material
				if (texture.styles) {
					Object.keys(texture.styles).forEach(property => {
						obj.material[property] = texture.styles[property];
					})
				}
		})
		this.swatch = swatchID;
	}

	cleanup() {

		// textures
		Object.keys(this.textures).forEach(textID => {
			sceneSettings.maps.forEach(map => {
				if (this.textures[textID][map]) {
					this.textures[textID][map].dispose();
					this.textures[textID][map] = "";
					delete this.textures[textID][map];
					console.log('-------- texture dropped - ' + textID + ' -- ' + map);
				}
			})
		})
		// material
		Object.keys(this.materials).forEach(mattID => {
			this.materials[mattID].dispose();
			sceneSettings.maps.forEach(map => {
				if (this.materials[mattID][map]) this.materials[mattID][map].dispose();
			})
			this.materials[mattID] = "";
			delete this.materials[mattID];
		})
	}


}

// 3D Model handler
class ModelHandler {
	constructor() {
		this.object = null;
		this.textures = {};
		this.staticTextures = [];
		this.materials = {};
		this.index = 1;
		this.data = modelData;
		this.loading = {
			is: true,
			notified: false,
		};
		this.swatch = this.data[this.index].textures.default;
		this.options = this.data[this.index];
		this.materials = {};
		this.loader = new THREE.OBJLoader();
	}

	initTextures(model) {

		const data = this.data;
		const i = this.index;
		const textures = this.data[i].textures;
		const targets = this.data[i].targets;

		// find any set sttatic textures
		const statics = Object.keys(targets).filter(targetID => targets[targetID].static);
		let staticMap = [];
		if (statics.length) {
			statics.forEach(targetID => staticMap.push({
				id: targetID,
				objects: targets[targetID].objects
			}))
		}

		this.textureHandler = new textureHandler(model, this.swatch, staticMap);
		return this.textureHandler.init();
	}

	createModel() {
		let module = this;
		const data = this.data;
		const index = this.index;
		this.loading.is = true;
		// return new Promise((resolve, reject) => {
			// const loader = new THREE.OBJLoader();
			this.loader.load(data[index].path + data[index].modelFile, function(obj) {
				console.log('-------- model loaded - ' + data[index].modelFile)
				obj.scale.x = sceneSettings.modelScale;
				obj.scale.y = sceneSettings.modelScale;
				obj.scale.z = sceneSettings.modelScale;
				obj.position.z = 0;
				obj.position.y = 0;

				module.object = module.initTextures(obj);

				let box = new THREE.Box3().setFromObject(module.object).getSize(new THREE.Vector3());
				module.controls.target = new THREE.Vector3(0, (box.y / 1.5) * sceneSettings.modelScale, 0);
				box = null;

				module.object.name = "furniture-model";
				module.scene.add(module.object);
				module.centerCamera();
				module.generateSwatchButtons();
				clearLoading();
				// resolve();
			})
		// })
	}

	changeModel(index) {
		// console.log(this.renderer.info)
		this.index = index;
		const scene = this.scene;
		// this.staticTextures = [];
		this.swatch = this.data[this.index].textures.default;
		this.options = this.data[this.index];
		this.object.remove();
		scene.getObjectByName('furniture-model').children.forEach(child => {
			child.remove();
			child.material.dispose();
			child.geometry.dispose();
			sceneSettings.maps.forEach(map => {
				if (child.material[map]) child.material[map].dispose();
			})
		})
		scene.remove(scene.getObjectByName('furniture-model'));

		this.textureHandler.cleanup();
		this.object = "";
		delete this.object;
		console.log('-------- model dropped - ' + this.data[index].modelFile)
		this.textureHandler.model = "";
		this.textureHandler.textures = "";
		this.textureHandler = "";
		delete this.textureHandler;
		this.generateSwatchButtons();
		this.createModel();
	}

	generateSwatchButtons() {
		const element = document.getElementById('swatch-controls');
		// clean up on change
		if (element.children.length) {
			for (let i = 0;i < element.children.length;i++) {
				element.children[i].removeEventListener('click', swatchEvent);
			}
		}
		element.innerHTML = "";
		// generate
		Object.keys(this.data[this.index].textures).forEach(textID => {
			let texture = this.data[this.index].textures[textID];
			if (textID !== "default" && texture.selectable) {
				let button = document.createElement('button');
				button.addEventListener('click', e => swatchEvent(textID))
				button.style.background = "url("+ this.data[this.index].path + texture.map + ") no-repeat center";
				button.style.backgroundSize = "cover";
				element.appendChild(button);
			}
		})
	}

	centerCamera() {
		const warnFix = new THREE.Vector3();
		const box = new THREE.Box3().setFromObject(this.object).getSize(warnFix);
		this.controls.target = new THREE.Vector3(0, (box.y / 1.5) * sceneSettings.modelScale, 0);
		this.camera.lookAt(new THREE.Vector3(0, (box.y / 1.5) * sceneSettings.modelScale, 0));
	}


}