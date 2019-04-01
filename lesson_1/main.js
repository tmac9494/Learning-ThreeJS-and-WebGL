
//============= CORE FUNCTIONALITY TIPS


//-- scene

//---- camera
// need fov, aspect ration, near clipping plane, far clipping plane
// adjust camera angle with [camera].lookat( new Vector3(x, y z))

// ---- Objects
// need a geometry(shape) and a material(appearance)

// ---- Planes





//============= IMPLEMENTATION NOTEs

//Cant See Anything but no errors?
// - all objects add including camera, will be at 0,0 you need to adjust the z axis position to put objects into view

// rotating in 3d
// uses radians instead of degrees (90deg = PI / 2)

// How do i constantly render?
// - window.requestAnimationFrame

// not all lights are casting shadows??
// - light has a camera like view that sometimes needs to be adjusted to fit all the objects into its fov
// - (THREE.CameraHelper) can will outline the fov of the light source and help you figure out where its being casted
// - adjust fov with [light instance].shadow.camera(left, right, bottom, top -- all default to -5 or 5)



function init() {
	let scene = new THREE.Scene(); // ------ scene
	const gui = new dat.GUI();
	const clock = new THREE.Clock();

// --------------------------------------------------- Fog
	let enableFog = true;
	if (enableFog) { scene.fog = new THREE.FogExp2(0xffffff, 0.01); }



// ------------------------------------------------------------------- Objects -------------------
	//  plane
	let plane = getPlane(100);
	plane.rotation.x = Math.PI / 2; // - 90 degree rotation in 3d space
	plane.name = 'plane-1';

	// box
	// var box = getBox(1, 1, 1);
	// box.position.y = box.geometry.parameters.height / 2; // - adjust box positoin to be on top of the plane
	let boxGrid = getBoxGrid(20, 2.5);
	boxGrid.name = 'box-grid';


	// light
	let directionalLight = getDirectionalLight(1);
	let sphere = getSphere(.05);
	directionalLight.add(sphere);
	directionalLight.intensity = 2;
	directionalLight.position.x = 13;
	directionalLight.position.y = 14;
	directionalLight.position.z = 10;
	// let helper = new THREE.CameraHelper(directionalLight.shadow.camera); // - shows lighting fov outlines

	// ambient
	// let ambientLight = getAmbientLight(2);


	// --- light gui controls
	gui.add(directionalLight, 'intensity', 0, 10);
	gui.add(directionalLight.position, 'x', -10, 20);
	gui.add(directionalLight.position, 'y', -5, 50);
	gui.add(directionalLight.position, 'z', -10, 20);
	// gui.add(directionalLight, 'penumbra', 0, 1) // only for spot light

	scene.add(directionalLight);
	// scene.add(ambientLight);
	// scene.add(helper);
	scene.add(boxGrid);
	// scene.add(box);
	scene.add(plane);



// --------------------------------------------------- Camera	
	let camera = new THREE.PerspectiveCamera( 
		45, // - fov
		window.innerWidth/window.innerHeight, // - aspect ratio
		1, // - near clippin plane
		1000 // - far clipping plane (plane area that is visible to the camera)
	)
	// let camera = new THREE.OrthographicCamera( 
	// 	-15,
	// 	15,
	// 	15,
	// 	-15,
	// 	1,
	// 	1000
	// )

	// ---------- Static Camera
	// camera.position.x = 10;
	// camera.position.y = 18;
	// camera.position.z = -18;
	// camera.lookAt(new THREE.Vector3(0, 0, 0))

// ------------------------------------------- Animated Camera
	// example of animating camera using an "animation rig" to make the animations more manageable
	let cameraZPosition = new THREE.Group();
	let cameraYPosition = new THREE.Group();
	let cameraYRotation = new THREE.Group();
	let cameraZRotation = new THREE.Group();
	let cameraXRotation = new THREE.Group();

	cameraZRotation.name = 'cameraZRotation';
	cameraZPosition.name = 'cameraZPosition';
	cameraYPosition.name = 'cameraYPosition';
	cameraYRotation.name = 'cameraYRotation';
	cameraXRotation.name = 'cameraXRotation';

	cameraXRotation.rotation.x = -Math.PI / 2;
	cameraYPosition.position.y = 1;
	cameraZPosition.position.z = 100;

	new TWEEN.Tween({val: 100})
		.to({val: -50}, 12000)
		.onUpdate(function() {
			cameraZPosition.position.z = this.val;
		})
		.start();

	new TWEEN.Tween({val: -Math.PI / 2})
		.to({val: 0}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraXRotation.rotation.x = this.val;
		})
		.start();

	new TWEEN.Tween({val: 0})
		.to({val: Math.PI/2}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraYRotation.rotation.y = this.val;
		})
		.start();

	// group camera controllers together and add to scene
	cameraZRotation.add(camera);
	cameraYPosition.add(cameraZRotation);
	cameraZPosition.add(cameraYPosition);
	cameraXRotation.add(cameraZPosition);
	cameraYRotation.add(cameraXRotation);
	scene.add(cameraYRotation);



	// --- anim cmaera gui controls
	gui.add(cameraZPosition.position, 'z', 0, 100);
	 // -- use pi for radians instead of degrees
	gui.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);
	gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
	gui.add(cameraZRotation.rotation, 'z', -Math.PI, Math.PI);
//animated camera


	let renderer = new THREE.WebGLRenderer(); // - create renderer
	// canvas, svg, webGL(best renderer because it leverages the gpu instead of the cpu)
	renderer.setSize(window.innerWidth, window.innerHeight); // - set size renderer
	renderer.setClearColor('rgb(120, 120, 120)')
	renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(renderer.domElement);

	// orbit controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls, clock)
	return scene;
}

//  build box
function getBox(w, h, d) {
	// create box
	let geometry = new THREE.BoxGeometry(w, h, d);
	let material = new THREE.MeshPhongMaterial({
		color: 0x2194ce,
	});
	let mesh = new THREE.Mesh(
		geometry,
		material
	);
	mesh.castShadow = true;
	return mesh;
}

function getBoxGrid(amount, seperationMuliplier) {
	let group = new THREE.Group(); // three group is like html div(container)

	for (let i = 0;i<amount;i++) {
		// create box and set its position based on place in loop
		let obj = getBox(1, 3, 1);
		obj.position.x = i * seperationMuliplier;
		obj.position.y = obj.geometry.parameters.height / 2;
		group.add(obj);
		// create the rows of blocks
		for (let j = 1;j<amount;j++) {
			let obj = getBox(1, 3, 1);
			obj.position.x = i * seperationMuliplier;
			obj.position.y = obj.geometry.parameters.height / 2;
			obj.position.z = j * seperationMuliplier;
			group.add(obj);
		}
	}

	group.position.x = -(seperationMuliplier * (amount - 1)) / 2;
	group.position.z = -(seperationMuliplier * (amount - 1)) / 2;
	return group;
}

//  build sphere(size = radius)
function getSphere(size) {
	// create box
	let geometry = new THREE.SphereGeometry(size, 24, 24);
	let material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	let mesh = new THREE.Mesh(
		geometry,
		material
	);
	return mesh;
}


// build plane
function getPlane(size) {
	// create box
	let geometry = new THREE.PlaneGeometry(size, size);
	let material = new THREE.MeshPhysicalMaterial({
		color: 'rgb(55, 55, 55)',
		side: THREE.DoubleSide
	});
	let mesh = new THREE.Mesh(
		geometry,
		material
	);
	mesh.receiveShadow = true;
	return mesh;
}


// build point light
function getPointLight(intensity) {
	var light = new THREE.PointLight('#fff', intensity);
	light.castShadow = true;
	return light;
}

// build spot light
function getSpotLight(intensity) {
	var light = new THREE.SpotLight('#fff', intensity);
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.bias = .001; // fixes glithy shadow where they meet their corrosponding object(.001 is not always the fix, may need to play with this value to get it right)
	return light;
}
// build directional light
function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight('#fff', intensity);
	light.castShadow = true;
	light.shadow.camera.left = -60;
	light.shadow.camera.right = 60;
	light.shadow.camera.bottom = -60;
	light.shadow.camera.top = 60;

	// increase shdow resolution
	light.shadow.mapSize.width = 4096;
	light.shadow.mapSize.height = 4096;
	light.shadow.bias = .0001;

	return light;
}

// build ambient light
function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
	return light;
}


// continous render
function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
	)

	let timeElapsed = clock.getElapsedTime();
	let boxGrid = scene.getObjectByName('box-grid');
	
// ---------- Animated Camera

	// let cameraXRotation = scene.getObjectByName('cameraXRotation');
	// let cameraYRotation = scene.getObjectByName('cameraYRotation');
	// let cameraZPosition = scene.getObjectByName('cameraZPosition');
	let cameraZRotation = scene.getObjectByName('cameraZRotation');

	// cameraZPosition.position.z -= 0.25;
	cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.05;
	// if (cameraXRotation.rotation.x < 0) {
	// 	cameraXRotation.rotation.x += .01;
	// }

//Animated Camera
	
// ----------- box Grid

	boxGrid.children.forEach((child, index) => {
		// ---- noise
		// let x = timeElapsed * 2.5 + index; //-------- faster by multiplier example 
		let x = timeElapsed + index;
		child.scale.y = (noise.simplex2(x, x) + 1) / 2 + .001; 

		// ---- sine
		// child.scale.y = (Math.sin(timeElapsed * 5 + index) + 1) / 2 + .001; 
			// -- adds one to the generated value(between -1 & 1) add one and divide by two forces the end result to be between 0 & 1,
			// + .001 forces the value to never be totaly 0 witch causes a graphical glitch,
			// time elapsed * (speed multiplier)
			// adding index to sin param makes each box use a different piece of the sin curve to prevent uniformity 


		child.position.y = child.scale.y / 2; // -- keeps the animating boxes on top of the plane
	})
//box grid

	controls.update();
	TWEEN.update();

	requestAnimationFrame(() => {
		update(renderer, scene, camera, controls, clock);
	})
}


// run
var scene = init();




