

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
		light.shadow.camera.far = 4000;
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
	}
	light.intensity = intensity;
	// increase shdow resolution
	light.shadow.mapSize.width = 6000;
	light.shadow.mapSize.height = 6000;
	// const sphere = getSphere(2)
	// light.add(sphere);
	return light;
}
