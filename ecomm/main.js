
let swatchChange = {
	texture: null,
	new: false,
}

function init() {
	let scene = new THREE.Scene(); // ------ scene
	const perfStats = new Stats();
	document.getElementById("webgl").appendChild(perfStats.dom);
	const gui = new dat.GUI();
	const clock = new THREE.Clock();


// --------------------------------------------------- Model Import 
	const modelLoader = new THREE.OBJLoader();
	const textureLoader = new THREE.TextureLoader();
	let textureUrl = textureHandler();
	modelLoader.load('../assets/models/test-chair/Capdell_Moon_b.obj', function(obj) {
		let materialTexture = textureLoader.load(textureUrl);
		let woodTexture = textureLoader.load('../assets/models/test-chair/wood-color.jpg');
		let woodMap = textureLoader.load('../assets/models/test-chair/wood-reflect.jpg');
		let materialMaster = new THREE.MeshPhysicalMaterial({
			color: '#fff'
		})
		let materialMasterAlt = new THREE.MeshPhysicalMaterial({
			color: '#fff'
		})
		obj.scale.x = 1;
		obj.scale.y = 1;
		obj.scale.z = 1;
		obj.position.z = 0;
		obj.position.y = 0;

		obj.traverse(child => {
			child.castShadow = true;
			if (child.name == "Plane010") {
				child.material = materialMasterAlt;
				materialMasterAlt.map = materialTexture;
				materialMasterAlt.map.repeat.set(10,10);
				materialMasterAlt.map.wrapS = THREE.RepeatWrapping;
				materialMasterAlt.map.wrapT = THREE.RepeatWrapping;
				materialMasterAlt.bumpMap = materialTexture;
				materialMasterAlt.bumpScale = 1.3;
				materialMasterAlt.bumpMap.repeat.set(10,10);
				materialMasterAlt.bumpMap.wrapS = THREE.RepeatWrapping;
				materialMasterAlt.bumpMap.wrapT = THREE.RepeatWrapping;
				materialMasterAlt.roughness = .95;
			}
			if (child.name == "Cylinder065") {
				child.material = materialMaster;
				materialMaster.map = woodTexture;
				materialMaster.roughnessMap = woodMap;
				materialMaster.roughness = .8;
				materialMaster.metalness = 0;
			}
		})
		// obj.castShadow = true;
		obj.name = "furniture-model";
		scene.add(obj);
	})

// --------------------------------------------------- Plane	
	const plane = createPlane(800, 'rgb(175, 175, 175)', 0, 2);
	plane.rotation.x = Math.PI / 2;
	plane.position.y = .001;
	scene.add(plane);


// --------------------------------------------------- Lighting 


	const frLight = createLight('spot', '#fff', 1);
	frLight.position.x = 200;
	frLight.position.y = 443;
	frLight.position.z = 531;
	const flLight = createLight('spot', '#fff', 0.5);
	flLight.position.x = -200;
	flLight.position.y = 443;
	flLight.position.z = 531;
	const bLight = createLight('spot', '#fff', 0.8);
	bLight.position.x = -200;
	bLight.position.y = 300;
	bLight.position.z = -572;
	bLight.castShadow = false;
	// let flhelper = new THREE.SpotLightHelper(flLight);
	// let frhelper = new THREE.SpotLightHelper(frLight);
	// let bhelper = new THREE.SpotLightHelper(bLight);
	scene.add(flLight);
	// scene.add(flhelper);
	scene.add(frLight);
	// scene.add(frhelper);
	scene.add(bLight);
	// scene.add(bhelper);


// ----------------------------------- GUI
	const flLightGui = gui.addFolder('Front Left Light');
	flLightGui.add(flLight, 'intensity', -1,1);
	flLightGui.add(flLight.position, 'x', -1000,1000);
	flLightGui.add(flLight.position, 'y', -1000,1000);
	flLightGui.add(flLight.position, 'z', -1000,1000);
	const frLightGui = gui.addFolder('Front Right Light');
	frLightGui.add(frLight, 'intensity', -1,1);
	frLightGui.add(frLight.position, 'x', -1000,1000);
	frLightGui.add(frLight.position, 'y', -1000,1000);
	frLightGui.add(frLight.position, 'z', -1000,1000);
	const bLightGui = gui.addFolder('Back Light');
	bLightGui.add(bLight, 'intensity', -3,3);
	bLightGui.add(bLight.position, 'x', -1000,1000);
	bLightGui.add(bLight.position, 'y', -1000,1000);
	bLightGui.add(bLight.position, 'z', -1000,1000);
	gui.closed = true;

// --------------------------------------------------- Camera	
	const camera = new THREE.PerspectiveCamera( 
		40, // - fov
		window.innerWidth/window.innerHeight, // - aspect ratio
		.2, // - near clippin plane
		10000 // - far clipping plane (plane area that is visible to the camera)
	)

	// ---------- Static Camera
	camera.position.x = -40;
	camera.position.y = 80;
	camera.position.z = 100;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);


// --------------------------------------------------- Render

	let renderer = new THREE.WebGLRenderer(); 
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(200, 200, 200)')
	renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(renderer.domElement);

	// orbit controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(0, 0, 0);

	update(renderer, scene, camera, controls, clock, perfStats, flLight, frLight, bLight);

	return scene;
}


// continous render
// const rotationSegments = Math.PI / 600;
function update(renderer, scene, camera, controls, clock, stats, flLight, frLight, bLight) {
	renderer.render(scene, camera);

	let timeElapsed = clock.getElapsedTime();

	// ---- Make sure camera is focused on the center of the model
	let CamY = 0;
	const furnModel = scene.getObjectByName('furniture-model');
	if (furnModel) {
		furnModel.children.forEach(child => {
			CamY += child.geometry.boundingSphere.radius;
		});
	}
	controls.target = new THREE.Vector3(0, (CamY / 1.5), 0);
	camera.lookAt(new THREE.Vector3(0, (CamY / 1.5), 0));



	// texture change
	if (swatchChange.new) {
		let target = scene.getObjectByName('Plane010');
		console.log(target);
		target.material.map = swatchChange.texture;
		target.material.map.repeat.set(10,10);
		target.material.map.wrapS = THREE.RepeatWrapping;
		target.material.map.wrapT = THREE.RepeatWrapping;
		target.material.bumpMap = swatchChange.texture;
		target.material.bumpScale = 1.3;
		target.material.bumpMap.repeat.set(10,10);
		target.material.bumpMap.wrapS = THREE.RepeatWrapping;
		target.material.bumpMap.wrapT = THREE.RepeatWrapping;
		target.material.roughness = 2;
		swatchChange.new = false;

	}


	stats.update();


	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock, stats, flLight, frLight, bLight);
	})
}

// function textureMapper()

function createPlane(size, color, roughness) {
	const geo = new THREE.PlaneGeometry(size, size);
	const matt = new THREE.MeshStandardMaterial({
		color: color,
		side: THREE.DoubleSide,
		roughness: roughness,
	})
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


function createLight(type, color, intensity) {
	let light;
	const lightOptions = {
		color: color,
	}
	switch(type) {
		case 'spot' :
		light = new THREE.SpotLight(lightOptions);
		break;
		case 'directional' : 
		light = new THREE.DirectionalLight(lightOptions);
		break;
		default :
		light = new THREE.DirectionalLight(lightOptions);
		break;
	}
	light.castShadow = true;
	if (type == 'directional') { 
		light.shadow.camera.far = 5000;
		light.shadow.camera.near = .002;
		light.shadow.camera.left = -60;
		light.shadow.camera.right = 60;
		light.shadow.camera.bottom = -60;
		light.shadow.camera.top = 100;
		light.shadow.bias = .01;
	}
	if (type == 'spot') {
		light.shadow.camera.far = 1200;
		light.distance = 10000;
		light.decay = 0;
		light.shadow.bias = .0001;
	}
	light.intensity = intensity;
	// increase shdow resolution
	light.shadow.mapSize.width = 5000;
	light.shadow.mapSize.height = 5000;
	const sphere = getSphere(2)
	light.add(sphere);
	return light;
}

function changeSwatch(id) {
	console.log(id);
	const url = textureHandler(id);
	swatchChange.texture = new THREE.TextureLoader().load(url);
	swatchChange.new = true;
}

function textureHandler(id) {
	let imageName;
	const relativePath = '../assets/models/test-chair/';
	switch(id) {
		case 'gray':
		imageName = 'Leater.jpg';
		break;
		case 'yellow':
		imageName = 'yellow-leather.jpg';
		break;
		case 'red':
		imageName = 'red-leather.jpg';
		break;
		case 'black':
		imageName = 'black-leather.jpg';
		break;
		default:
		imageName = 'Leater.jpg';
		break;
	}
	return(relativePath + imageName);
}


// run
const scene = init();




