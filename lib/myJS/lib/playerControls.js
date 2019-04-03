let camChange = {
	move: {
		active: false,
		direct: 0,
	}
}
let moveTracker = {
	left: false,
	right: false,
	back: false, 
	forward: false,
}
const mainCanvas = document.getElementById('webgl');


// start actions
window.addEventListener('keydown', (e) => {
    e = e || window.event;
    if (e.keyCode == '38' || e.keyCode == '87') {
        // up/w arrow
        // camChange.move.direct = -1;
        // camChange.move.active = true;
        moveTracker.forward = true;
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        // down/s arrow
        // camChange.move.direct = 1;
        // camChange.move.active = true;
        moveTracker.back = true;
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
       // left/a arrow
        // camChange.rotate.direct = 1;
        // camChange.rotate.active = true;
        moveTracker.left = true;
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
       // right/d arrow
        // camChange.rotate.direct = -1;
        // camChange.rotate.active = true;
        moveTracker.right = true;
    }

});
// stop actions
window.addEventListener('keyup', (e) => {
    // if (e.keyCode == '38' || e.keyCode == '87') camChange.move.active = false;
    // else if (e.keyCode == '40' || e.keyCode == '83') camChange.move.active = false;
    // else if (e.keyCode == '37' || e.keyCode == '65') camChange.rotate.active = false;
    // else if (e.keyCode == '39' || e.keyCode == '68') camChange.rotate.active = false;
    if (e.keyCode == '38' || e.keyCode == '87') moveTracker.forward = false;
    else if (e.keyCode == '40' || e.keyCode == '83') moveTracker.back = false;
    else if (e.keyCode == '37' || e.keyCode == '65') moveTracker.left = false;
    else if (e.keyCode == '39' || e.keyCode == '68') moveTracker.right = false;
})


//-------------------- Player Movement

function moveCamera(rotation, zcoords) {
	// console.log(rotation);
	// console.log(zcoords);
	// console.log(rotation)
	const charge = rotation < 0 ? -1 : 1;
	const rotateInt = rotation < 0 ? (rotation * -1) : rotation;
	let x = 0; 
	let z = 0;
	let ratioX = 0;
	let ratioY = 0;

	// find quadrant
	// if (charge == 1 && rotateInt <= .5) {
	// 	ratio
	// }



	// console.log(charge);
	// right quadrant
	const ratioGuide = rotateInt <= .25 ? .25 : rotateInt <= .75 ? .75 : 1; // - <= .5 is top quadrant of plane > .5 is bottom qaudrant

	// caculate ratio of movement
	if (moveTracker.forward || moveTracker.back) {
		z = ratioGuide / rotateInt;
		if (z > 1) z = 1;
	}
	if (moveTracker.left || moveTracker.right) {
		x = ratioGuide / rotateInt;
		if (x > 1) x = 1;
	}

	// adjust value charge based on rotation
	const ratioDif = rotateInt / ratioGuide;
	console.log(ratioGuide)
	console.log(rotateInt);
	console.log(ratioDif);
	if (rotateInt <= .25) {
		// top of plane
		// if (rotateInt < ratioGuide) {
			// < perfect 1/1 ratio
			// 1 / 0
			x = ratioDif;
			z = 1 - ratioDif;

		// } else {
			// > perfect 1/1 ratio
			// 0 / 1
			// x = 1 - ratioDif;
			// z = ratioDif;
		// }

	} else {
		//bottom of plaen

		x = ratioDif;
		z = 1 -ratioDif;
		// if (rotateInt < ratioGuide) {
			// < perfect 1/1 ratio
			// 0 / 1
		// } else {
			// > perfect 1/1 ratio
			// 1 / 0
		// }

	}
	// give negative values back
	if (rotateInt > ratioGuide && z !== null) z = -1 * z;
	// else if (ratioGuide == .75) z = (-1 * z) * charge;
	if (rotateInt > ratioGuide && x !== null) x = x * charge;
	else if (ratioGuide == .25) x = (-1 * x) * charge;

	// if (x !== null) x = (-1 * x) * charge;
	// else z = (-1 * z) * charge;


	// reverse values based on controls
	if (ratioGuide == .25 && z !== 0 && moveTracker.forward) z = z * -1;
	if (ratioGuide == .25 && x !== 0 && moveTracker.left) x = x * -1;




	return({x:x,z:z});
}





//-------------------- Camera Rotation with mouse

// using pointer lock
// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

mainCanvas.addEventListener('click', e => {
	mainCanvas.requestPointerLock = mainCanvas.requestPointerLock || mainCanvas.mozRequestPointerLock;
	mainCanvas.requestPointerLock();
})
function lockChangeAlert() {
  if (document.pointerLockElement === mainCanvas ||
      document.mozPointerLockElement === mainCanvas) {
    console.log('The pointer lock status is now locked');
    // document.addEventListener("mousemove", false);
  } else {
    console.log('The pointer lock status is now unlocked');
    // document.removeEventListener("mousemove", false);
  }
}


let mouseTrack = {
	active: false,
	x: null,
	y: null,
}
const maxDelta = 12; 

let mouseTimeout;
document.addEventListener('mousemove', e => {
	
	const position = {x: e.clientX, y:e.clientY};
	mouseTrack.active = true;
	clearTimeout(mouseTimeout);
	mouseTimeout = setTimeout(() => {
		mouseTrack.active = false;
		console.log('mouseStopped');
	}, 10)

	const xCalc = cameraCalc(-e.movementY);
	const yCalc = cameraCalc(-e.movementX);
	mouseTrack.x = xCalc;
	mouseTrack.y = yCalc;


	// all done
	// console.log(mouseTrack)
});

function cameraCalc(number) {
	let calc = number;
	const chargeHolder = number < 0 ? -1 : 1;
	if (number < 0) calc = number * -1;

	calc = chargeHolder * (calc < maxDelta ? calc : maxDelta);
	return calc;
}