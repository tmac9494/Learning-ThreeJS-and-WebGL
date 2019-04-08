
function init() {
	let scene = new THREE.Scene(); // ------ scene
	const perfStats = new Stats();
	document.body.appendChild(perfStats.dom);
	const gui = new dat.GUI();
	const clock = new THREE.Clock();

// --------------------------------------------------- Camera	
	let camera = new THREE.PerspectiveCamera( 
		40, // - fov
		window.innerWidth/window.innerHeight, // - aspect ratio
		.2, // - near clippin plane
		10000 // - far clipping plane (plane area that is visible to the camera)
	)

	// ---------- Static Camera
	camera.position.x = 200;
	camera.position.y = 800;
	camera.position.z = 300;
	camera.lookAt(new THREE.Vector3(0, 2, 0));





// --------------------------------------------------- Model Import 
	const modelLoader = new THREE.OBJLoader();
	const textureLoader = new THREE.TextureLoader();
	modelLoader.load('../assets/models/test-chair/Capdell_Moon_b.obj', function(obj) {
		let materialTexture = textureLoader.load('../assets/models/test-chair/Leater.jpg');
		let woodTexture = textureLoader.load('../assets/models/test-chair/wood-color.jpg');
		let woodMap = textureLoader.load('../assets/models/test-chair/wood-reflect.jpg');
		let materialMaster = new THREE.MeshStandardMaterial({
			color: '#fff'
		})
		let materialMasterAlt = new THREE.MeshStandardMaterial({
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
				materialMasterAlt.bumpMap.repeat.set(10,10);
				materialMasterAlt.bumpMap.wrapS = THREE.RepeatWrapping;
				materialMasterAlt.bumpMap.wrapT = THREE.RepeatWrapping;
				materialMasterAlt.roughness = 2;
			}
			if (child.name == "Cylinder065") {
				child.material = materialMaster;
				materialMaster.map = woodTexture;
				materialMaster.roughnessMap = woodMap;
				materialMaster.roughness = 0.4;
				materialMaster.metalness = 0.2;
			}
		})

		scene.add(obj);
	})

// --------------------------------------------------- Plane	
	const plane = createPlane(400, 'rgb(175, 175, 175)', 0, 2);
	plane.rotation.x = Math.PI / 2;
	plane.position.y = .001;
	scene.add(plane);


// --------------------------------------------------- Lighting 


	var light = new THREE.DirectionalLight('#fff', 1.5);
	light.castShadow = true;
	light.shadow.camera.far = 5000;
	light.shadow.camera.near = .002;
	light.shadow.camera.left = -60;
	light.shadow.camera.right = 60;
	light.shadow.camera.bottom = -60;
	light.shadow.camera.top = 100;
	light.shadow.bias = .01;

	// increase shdow resolution
	light.shadow.mapSize.width = 5000;
	light.shadow.mapSize.height = 5000;
	light.position.x = 200;
	light.position.y = 300;
	light.position.z = 300;
	// let helper = new THREE.CameraHelper(light.shadow.camera)
	scene.add(light);
	// scene.add(helper);


// ----------------------------------- GUI
	gui.add(light, 'intensity', -2,2);
	gui.add(light.position, 'x', -1000,1000);
	gui.add(light.position, 'y', -1000,1000);
	gui.add(light.position, 'z', -1000,1000);



// --------------------------------------------------- Render

	let renderer = new THREE.WebGLRenderer(); 
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(200, 200, 200)')
	renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(renderer.domElement);

	// orbit controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls, clock, perfStats);

	return scene;
}


// continous render
// const rotationSegments = Math.PI / 600;
function update(renderer, scene, camera, controls, clock, stats) {
	renderer.render(scene, camera);

	let timeElapsed = clock.getElapsedTime();
	stats.update();



	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock, stats);
	})
}

// function textureMapper()

function createPlane(size, color, roughness, shiny) {
	const geo = new THREE.PlaneGeometry(size, size);
	const matt = new THREE.MeshPhongMaterial({
		color: color,
		side: THREE.DoubleSide
	})
	// matt = attribs;
	const mesh = new THREE.Mesh(
		geo,
		matt,
	)
	mesh.receiveShadow = true;
	matt.roughness = roughness;
	matt.shininess = shiny;
	return mesh;
}





// run
const scene = init();




