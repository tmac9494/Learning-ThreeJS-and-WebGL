
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
	}

	initTextures(model) {

		const data = this.data;
		const i = this.index;
		const textures = this.data[i].textures;
		const targets = this.data[i].targets;
		const loader = new THREE.TextureLoader();

		// load all textures into scene(prevents pop in when changing textures)
		Object.keys(textures).forEach(textID => {
			sceneSettings.maps.forEach(map => {
				if (textures[textID][map]) {
					if (typeof this.textures[textID] == "undefined") this.textures[textID] = {};
					this.textures[textID][map] = loader.load( this.data[i].path + textures[textID][map] );
				}
			})
		});


		// find any set sttatic textures
		const statics = Object.keys(targets).filter(targetID => targets[targetID].static);
		if (statics.length) {
			statics.forEach(targetID => this.staticTextures.push({
				id: targetID,
				objects: targets[targetID].objects
			}))
		}

		// create materials for different material children
		Object.keys(this.data[this.index].targets).forEach(target => {
			this.materials[target] = new THREE.MeshPhysicalMaterial({color:'#fff'});
		})

		// apply textures
		model.traverse(child => {
			let name = child.name;
			let applyTexture = textures[this.swatch];
			let textDataID = this.swatch;
			
			// change texture for static children
			this.staticTextures.forEach(st => {
				if (st.objects.includes(name)) {
					Object.keys(textures).forEach(textID => {
						if (textures[textID].target == st.id) {
							applyTexture = textures[textID];
							textDataID = textID; 
						}
					});
				}
			})

			// let materialCopy = this.materials[applyTexture.target];
			let isTextureTarget = targets[applyTexture.target].objects.includes(name);
			// handle dynamic
			if (isTextureTarget) {
				child.material = this.materials[applyTexture.target];
				sceneSettings.maps.forEach(map => {
					if (applyTexture[map]) {
						child.material[map] = this.textures[textDataID][map];
						child.material[map].wrapS = THREE.RepeatWrapping;
						child.material[map].wrapT = THREE.RepeatWrapping;
						child.material[map].repeat.set(applyTexture.wrapS, applyTexture.wrapT)
					}

				})
			}

			// apply style properties to material
			if (applyTexture.styles && isTextureTarget) 
				Object.keys(applyTexture.styles).forEach(property => child.material[property] = applyTexture.styles[property] );

			// settings
			const settings = this.data[i].objectSettings;

			//global object styles/settings
			if (settings["*"]) 
				Object.keys(settings["*"]).forEach(property => child[property] = settings["*"][property] );

			// object specific settings/styles
			if (settings && Object.keys(settings).includes(name)) 
				Object.keys(settings[name]).forEach(property => child[property] = settings[name][property] );
		})

		return model;
	}

	createModel() {
		let module = this;
		const data = this.data;
		const index = this.index;
		this.loading.is = true;
		return new Promise((resolve, reject) => {
			const loader = new THREE.OBJLoader();
			loader.load(data[index].path + data[index].modelFile, function(obj) {
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
				clearLoading();
				resolve();
			})
		})
	}

	changeModel(index) {
		console.log(this.renderer.info)
		this.index = index;
		const scene = this.scene;
		this.staticTextures = [];
		this.swatch = this.data[this.index].textures.default;
		this.options = this.data[this.index];
		scene.getObjectByName('furniture-model').children.forEach(child => {
			child.remove();
			child.material.dispose();
			child.geometry.dispose();
			sceneSettings.maps.forEach(map => {
				if (child.material[map]) child.material[map].dispose();
			})
		})
		scene.remove(scene.getObjectByName('furniture-model'));
		// textures
		Object.keys(this.textures).forEach(textID => {
			sceneSettings.maps.forEach(map => {
				if (this.textures[textID][map]) {
					this.textures[textID][map].dispose();
					this.textures[textID][map] = null;
					// delete this.textures[textID][map];
				}
			})
		})
		// material
		Object.keys(this.materials).forEach(mattID => {
			this.materials[mattID].dispose();
			sceneSettings.maps.forEach(map => {
				if (this.materials[mattID][map]) this.materials[mattID][map].dispose();
			})
			this.materials[mattID] = null;
			// delete this.materials[mattID];
		})
		// objects
		this.object = null;
		this.textures = {};
		this.materials = {};
		this.generateSwatchButtons();
		this.createModel();
	}

	changeSwatch(swatchID) {
		let texture = this.data[this.index].textures[swatchID];
		const targets = this.data[this.index].targets[texture.target].objects;
		targets.forEach(target => {
			let obj = this.scene.getObjectByName(target);
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