const loader = document.createElement('div');
const loaderText = document.createTextNode("Loading Furniture Model...");
loader.appendChild(loaderText);
loader.id = "loader";

let modelInstance = new ModelHandler();
// initialize state and controls
generateModelButtons();
document.getElementById("webgl").appendChild(loader);
modelInstance.loading.notified = true;

// --------------------------------------------------- Model Import 



function init() {
	let scene = new THREE.Scene(); // ------ scene
	const perfStats = new Stats();
	document.getElementById("webgl").appendChild(perfStats.dom);
	// const gui = new dat.GUI();
	const clock = new THREE.Clock();



// --------------------------------------------------- Plane	
	const plane = createPlane(900, 'rgb(175, 175, 175)', 1);
	plane.rotation.x = -(Math.PI / 2);
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
	const bLight = createLight('spot', '#fff', 0.95);
	bLight.position.x = -68;
	bLight.position.y = 300;
	bLight.position.z = -638;
	bLight.castShadow = false;
	bLight.decay = .1;
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
	// const flLightGui = gui.addFolder('Front Left Light');
	// flLightGui.add(flLight, 'intensity', -1,1);
	// flLightGui.add(flLight.position, 'x', -1000,1000);
	// flLightGui.add(flLight.position, 'y', -1000,1000);
	// flLightGui.add(flLight.position, 'z', -1000,1000);
	// flLightGui.add(flLight, 'penumbra', -1,1);
	// const frLightGui = gui.addFolder('Front Right Light');
	// frLightGui.add(frLight, 'intensity', -1,1);
	// frLightGui.add(frLight.position, 'x', -1000,1000);
	// frLightGui.add(frLight.position, 'y', -1000,1000);
	// frLightGui.add(frLight.position, 'z', -1000,1000);
	// frLightGui.add(frLight, 'penumbra', -1,1);
	// const bLightGui = gui.addFolder('Back Light');
	// bLightGui.add(bLight, 'intensity', -3,3);
	// bLightGui.add(bLight.position, 'x', -1000,1000);
	// bLightGui.add(bLight.position, 'y', -1000,1000);
	// bLightGui.add(bLight.position, 'z', -1000,1000);
	// bLightGui.add(bLight, 'penumbra', -1,1);
	// gui.closed = true;

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
	camera.position.z = 150;
	camera.lookAt(new THREE.Vector3(0, 100, 0));
	scene.add(camera);


// --------------------------------------------------- Render

	let renderer = new THREE.WebGLRenderer({antialias: true}); 
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(255, 255, 255)')
	renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(renderer.domElement);


	// orbit controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	modelInstance.controls = controls;
	modelInstance.scene = scene;
	modelInstance.camera = camera;
	modelInstance.renderer = renderer;
	// load Model
	modelInstance.createModel().then(() => {
		modelInstance.centerCamera();
		modelInstance.generateSwatchButtons();
		update(renderer, scene, camera, controls, clock, perfStats, flLight, frLight, bLight);
	})


	return scene;
}


// continous render
// const rotationSegments = Math.PI / 600;
function update(renderer, scene, camera, controls, clock, stats, flLight, frLight, bLight) {
	renderer.render(scene, camera);

	let timeElapsed = clock.getElapsedTime();


	//---- loading notification
	if (modelInstance.loading.is && !modelInstance.loading.notified) {
		document.getElementById('webgl').appendChild(loader);
		modelInstance.loading.notified = true;
		// controls.enabled = false;
	} else if (!modelInstance.loading.is && modelInstance.loading.notified) {
		document.getElementById('loader').remove();
		modelInstance.loading.notified = false;
		// controls.enabled = true;
	}


	stats.update();


	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock, stats, flLight, frLight, bLight);
	})
}




// start
init();




