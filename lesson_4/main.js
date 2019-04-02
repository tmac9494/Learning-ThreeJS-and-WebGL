function init() {
	var scene = new THREE.Scene();

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 0;
	camera.position.x = 0;
	camera.position.y = 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));


	// ------------------------------------------------------ Particle effect


	const particleGeo = new THREE.Geometry();
	const particleMaterial = new THREE.PointsMaterial({
		color: '#fff',
		size: 1,
		map: new THREE.TextureLoader().load('../assets/textures/particle.jpg'),
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
	});

	let particleCount = 20000;
	let particleDistance = 100;

	for (let i = 0;i<particleCount;i++) {
		const posX = (Math.random() - 0.5) * particleDistance;
		const posY = (Math.random() - 0.5) * particleDistance;
		const posZ = (Math.random() - 0.5) * particleDistance;
		const particle = new THREE.Vector3(posX, posY, posZ);
		particleGeo.vertices.push(particle);
	}
	const particleSystem = new THREE.Points(
		particleGeo,
		particleMaterial,
	);
	particleSystem.name = 'particle-system';
	scene.add(particleSystem);


	//particle effect

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearColor('rgb(20, 20, 20)');

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	document.getElementById('webgl').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
}


function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);

	const particleSystem = scene.getObjectByName('particle-system');
	particleSystem.rotation.y += 0.005;

	particleSystem.geometry.vertices.forEach((particle) => {
		particle.x += (Math.random() - 1) * 0.1;
		particle.y += (Math.random() - 0.75) * 0.1;
		particle.z += Math.random() * 0.1;

		if (particle.x < -50) particle.x = 50;
		if (particle.y < -50) particle.y = 50;
		if (particle.z < -50) particle.z = 50;
		if (particle.z > 50) particle.z = -50;
	})
	particleSystem.geometry.verticesNeedUpdate = true;
	
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

var scene = init();
