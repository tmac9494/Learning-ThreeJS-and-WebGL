
let flying = 0;
let terrain = {};

// control objects
const perlin = {
	increment: 0.055,
	scale: 125, 
}
const settings = {
	speed: 0.03,
	scale: 70,
}

const h = 4200;
const w = h * 7;
const cols = w / settings.scale;
const rows = h / settings.scale;

const planeMatt = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: true } );

function init() {
	const scene = new THREE.Scene();
	const clock = new THREE.Clock();


	// ----- plane

	const generatedPlane = new THREE.Group();
	const xPos = -(w / 4);


	let yOff = 0;
	for(let y = 0;y < rows;y++) {
		let xOff = 0;
		for(let x = 0;x < cols;x++) {
			const vertexVal = noise.simplex2(xOff, yOff) * perlin.scale;
			if (!terrain[x]) terrain[x] = {};
			terrain[x][y] = vertexVal;
			xOff += perlin.increment;
		}
		yOff += perlin.increment;
	}


	// generate vertecies to draw triangles
	for(let y = 0;y < rows - 1;y++) {
		let geom = new THREE.Geometry();
		for(let x = 0;x < cols;x++) {
			geom.vertices.push(new THREE.Vector3(
				x * settings.scale,
				y * settings.scale,
				terrain[x][y]
			));
			geom.vertices.push(new THREE.Vector3(
				x * settings.scale,
				(y + 1) * settings.scale,
				terrain[x][y + 1]
			));
			geom.faces.push(new THREE.Face3(2 + x, 1 + x, 0 + x))
			// geom.faces.push(new THREE.Face3(3 + x, 1 + x, 2 + x))
		}
		const planeStrip = new THREE.Mesh(geom, planeMatt);
		planeStrip.position.y = y;
		generatedPlane.add(planeStrip);
	}
	generatedPlane.position.x = -(w / 4);
	generatedPlane.position.y = -(h / 4);
	generatedPlane.rotation.x = -(Math.PI / 2);
	generatedPlane.name = 'terrain';
	scene.add(generatedPlane);



	// ----------- Camera	
	const camera = new THREE.PerspectiveCamera( 
		100, // - fov
		window.innerWidth/window.innerHeight, // - aspect ratio
		.2, // - near clippin
		10000 // - far clipping
	)

	camera.position.x = 0;
	camera.position.y = -600;
	camera.position.z = (h / settings.scale) * 6;
	camera.lookAt(new THREE.Vector3(0, -5, -h));
	scene.add(camera);


	// renderer
	const renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(0, 0, 0)')
	document.getElementById("webgl").appendChild(renderer.domElement);

	// var controls = new THREE.OrbitControls(camera, renderer.domElement);
	// controls.target = new THREE.Vector3(0, -5, -h);

	renderer.render(scene, camera);
	update(renderer, scene, camera, clock);
	return scene;

}

function update(renderer, scene, camera, clock, controls) {
	renderer.render(scene, camera);

	flying += settings.speed;

	const plane = scene.getObjectByName('terrain');

	// update vertices to appear to moving forward
	let yOff = flying;
	for(let y = 0;y < rows;y++) {
		let xOff = 0;
		for(let x = 0;x < cols;x++) {
			const vertexVal = noise.simplex2(xOff, yOff) * perlin.scale;
			terrain[x][y] = vertexVal;
			xOff += perlin.increment;
		}
		yOff += perlin.increment;
	}


	for(let y = 0;y < rows - 1;y++) {
		for(let x = 0;x < cols;x++) {
			let adjustedX = x * 2;
			plane.children[y].geometry.vertices[adjustedX].z = terrain[x][y];
			plane.children[y].geometry.vertices[adjustedX + 1].z = terrain[x][y + 1];

			plane.children[y].geometry.vertices[adjustedX].x = x * settings.scale;
			plane.children[y].geometry.vertices[adjustedX + 1].x = x * settings.scale;

			plane.children[y].geometry.vertices[adjustedX].y = y * settings.scale;
			plane.children[y].geometry.vertices[adjustedX + 1].y = (y + 1) * settings.scale;

			plane.children[y].geometry.verticesNeedUpdate = true;
		}
	}


	requestAnimationFrame(function() {
		update(renderer, scene, camera, clock);
	});
}




const sceneRef = init();












