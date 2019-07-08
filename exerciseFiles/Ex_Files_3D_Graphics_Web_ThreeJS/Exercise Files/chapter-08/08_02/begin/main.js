function init() {
	// scene
	var scene = new THREE.Scene();
	var gui = new dat.GUI();
	var clock = new THREE.Clock();

	// add geometry
	var plane = getPlane(50);
	var directionalLight = getDirectionalLight();
	var boxGrid = getBoxGrid(20, 2.5);

	plane.name = 'plane-1';
	boxGrid.name = 'boxGrid-1';

	// manipulate geometry
	plane.rotation.x = Math.PI/2;
	directionalLight.position.x = 26;
	directionalLight.position.y = 20;
	directionalLight.position.z = 20;

	// add geometry to the scene
	scene.add(plane);
	scene.add(directionalLight);
	scene.add(boxGrid);

	var enableFog = false;
	if (enableFog) {
		scene.fog = new THREE.FogExp2('rgb(220, 220, 220)', 0.02);
	}

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);

	camera.position.z = -60;
	camera.position.x = 45;
	camera.position.y = 45;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(220, 220, 220)');
	document.getElementById('webgl').appendChild(renderer.domElement);
	
	// controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls, clock);

	return scene;
}

function getDirectionalLight() {
	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.castShadow = true;
	var shadowMapSize = 30;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

	light.shadow.camera.left = -shadowMapSize;
	light.shadow.camera.bottom = -shadowMapSize;
	light.shadow.camera.right = shadowMapSize;
	light.shadow.camera.top = shadowMapSize;

	return light;
}

function getBox(w, h, d) {
	var geometry = new THREE.BoxGeometry(w, h, d);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
	});
	var obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;

	return obj;
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 2.5, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 2.5, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)', 
		side: THREE.DoubleSide
	});
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(scene, camera);
	controls.update();
	var timeElapsed = clock.getElapsedTime();

	var boxGrid = scene.getObjectByName('boxGrid-1');
	boxGrid.children.forEach(function(child, index) {
		var noiseAmount = noise.simplex2(timeElapsed + index, timeElapsed + index) + 1;
		child.scale.y = noiseAmount;
		child.position.y = child.scale.y/2 * child.geometry.parameters.height;
	});
	
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	});
}

var scene = init();