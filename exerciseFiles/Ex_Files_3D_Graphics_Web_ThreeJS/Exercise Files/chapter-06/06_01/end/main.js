var GEO_TYPES = [
	'box', 
	'cone', 
	'cylinder', 
	'octahedron', 
	'sphere',
	'tetrahedron',
	'torus',
	'torusKnot'
];

function init() {
	var scene = new THREE.Scene();
	var clock = new THREE.Clock();

	// initialize objects
	var objMaterial = getMaterial('basic', 'rgb(255, 255, 255)');

	var geoTypes = GEO_TYPES;

	geoTypes.forEach(function(type) {
		var geo = getGeometry(type, 5, objMaterial);
		scene.add(geo);
	});

	var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
	var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');
	var lightBottom = getPointLight(0.33, 'rgb(255, 220, 150)');

	lightLeft.position.x = -5;
	lightLeft.position.y = 2;
	lightLeft.position.z = -4;

	lightRight.position.x = 5;
	lightRight.position.y = 2;
	lightRight.position.z = -4;

	lightBottom.position.x = 0;
	lightBottom.position.y = 10;
	lightBottom.position.z = 0;

	// load the environment map
	var path = '/assets/cubemap/';
	var format = '.jpg';
	var fileNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

	var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function(fileName) {
		return path + fileName + format;
	}));
	scene.background = reflectionCube;

	// manipulate materials
	// var loader = new THREE.TextureLoader();
	// objMaterial.roughnessMap = loader.load('/assets/textures/scratch.jpg');
	// objMaterial.bumpMap = loader.load('/assets/textures/scratch.jpg');
	// objMaterial.bumpScale = 0.01;
	// objMaterial.envMap = reflectionCube;

	// objMaterial.roughness = 0.5;
	// objMaterial.metalness = 0.7;

	// var maps = ['bumpMap', 'roughnessMap'];
	// maps.forEach(function(map) {
	// 	var texture = objMaterial[map];
	// 	texture.wrapS = THREE.RepeatWrapping;
	// 	texture.wrapT = THREE.RepeatWrapping;
	// 	texture.repeat.set(1, 1);
	// });

	// add other objects to the scene
	scene.add(lightLeft);
	scene.add(lightRight);
	scene.add(lightBottom);

	// camera
	var cameraGroup = new THREE.Group();
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 20;
	camera.position.x = 0;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	cameraGroup.add(camera);
	cameraGroup.name = 'sceneCameraGroup';
	scene.add(cameraGroup);

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById('webgl').appendChild(renderer.domElement);
	update(renderer, scene, camera, clock);

	return scene;
}

function getGeometry(type, size, material) {
	var geometry;
	var segmentMultiplier = 0.25;

	switch (type) {
		case 'box':
			geometry = new THREE.BoxGeometry(size, size, size);
			break;
		case 'cone':
			geometry = new THREE.ConeGeometry(size, size, 256*segmentMultiplier);
			break;
		case 'cylinder':
			geometry = new THREE.CylinderGeometry(size, size, size, 32*segmentMultiplier);
			break;
		case 'octahedron':
			geometry = new THREE.OctahedronGeometry(size);
			break;
		case 'sphere':
			geometry = new THREE.SphereGeometry(size, 32*segmentMultiplier, 32*segmentMultiplier);
			break;
		case 'tetrahedron':
			geometry = new THREE.TetrahedronGeometry(size);
			break;
		case 'torus':
			geometry = new THREE.TorusGeometry(size/2, size/4, 16*segmentMultiplier, 100*segmentMultiplier);
			break;
		case 'torusKnot':
			geometry = new THREE.TorusKnotGeometry(size/2, size/6, 256*segmentMultiplier, 100*segmentMultiplier);
			break;
		default:
			break;
	}

	var obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;
	obj.name = type;

	return obj;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
		wireframe: true,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getPointLight(intensity, color) {
	var light = new THREE.PointLight(color, intensity);
	light.castShadow = true;

	return light;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;  // default: 512
	light.shadow.mapSize.height = 1024; // default: 512
	light.shadow.camera.near = 0.1;       // default
	light.shadow.camera.far = 500      // default
	light.shadow.camera.fov = 30      // default
	light.shadow.bias = 0.001;

	return light;
}

function update(renderer, scene, camera, clock) {
	// rotate camera around the origin
	var sceneCameraGroup = scene.getObjectByName('sceneCameraGroup');
	if (sceneCameraGroup) {
		sceneCameraGroup.rotation.y += 0.005;
	}

	// switch between objects
	var geoTypes = GEO_TYPES;

	var currentIndex = Math.floor((clock.getElapsedTime() / 4) % geoTypes.length);
	geoTypes.forEach(function(geo, index) {
		var currentObj = scene.getObjectByName(geo);
		if (index === currentIndex) {
			currentObj.visible = true;
		} else {
			currentObj.visible = false;
		}
	})

	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, clock);
	});
}

var scene = init();
