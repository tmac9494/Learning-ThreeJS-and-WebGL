function init() {
	var scene = new THREE.Scene();
	var clock = new THREE.Clock();

	// initialize objects
	var planeMaterial = getMaterial('basic', 'rgb(255, 255, 255)');
	var plane = getPlane(planeMaterial, 30, 60);
	plane.name = 'plane-1';

	// manipulate objects
	plane.rotation.x = Math.PI/2;
	plane.rotation.z = Math.PI/4;

	// add objects to the scene
	scene.add(plane);

	// camera
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

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('webgl').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	update(renderer, scene, camera, controls, clock);

	return scene;
}

function getPlane(material, size, segments) {
	var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;
	obj.castShadow = true;

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

function update(renderer, scene, camera, controls, clock) {
	controls.update();

	var elapsedTime = clock.getElapsedTime();

	var plane = scene.getObjectByName('plane-1');
	var planeGeo = plane.geometry;
	planeGeo.vertices.forEach(function(vertex, index) {
		vertex.z += Math.sin(elapsedTime + index * 0.1) * 0.005;
	});
	planeGeo.verticesNeedUpdate = true;

	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	});
}

var scene = init();
