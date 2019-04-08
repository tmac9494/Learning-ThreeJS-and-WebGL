let camChange = {
	move: {
		active: false,
		direct: 0,
	}
}
let moveTracker = {
	directions: {
		l: false,
		r: false,
		b: false, 
		f: false,
	},
	actions: {
		run: false,
		crouch: false,
	}
}
let barriers = [];
function addBarrier(x, y, z) {
	barriers.push({
		x:x,
		y:y,
		z:z
	})
}
function checkBarriers(x, z, grid) {
	let notify = {
		x: x,
		z: z,
	}
	if (x !== 0 || z !== 0) {
		grid.children.forEach(child => {
			let barrCoords = child.matrixWorld.elements;
			const barrX = barrCoords[14];
			const barrZ = barrCoords[12];
			const xCalc = barrX - notify.x;
			const zCalc = barrZ - notify.Z; 
			// console.log(barrX + "   " + barrZ)
			if (xCalc > -1 && zCalc < 1) {
				notify.x = null;
				console.log('------------------------\n------------------------collision X\n------------------------');
				console.log(barrier.x)
				console.log(x)
			}
			if (zCalc > -1 && zCalc < 1) {
				notify.z = null;
				console.log('------------------------\n------------------------collision Z\n------------------------')
				console.log(barrier.z)
				console.log(z)
			}
		})
	} else {
		notify.x = x;
		notify.z =z;
	}
	return notify;
}

const mainCanvas = document.getElementById('webgl');


// start actions
window.addEventListener('keydown', (e) => {
    e = e || window.event;
    if (e.keyCode == '38' || e.keyCode == '87') {
        // up/w arrow
        // camChange.move.direct = -1;
        // camChange.move.active = true;
        moveTracker.directions.f = true;
    } else if (e.keyCode == '40' || e.keyCode == '83') {
        // down/s arrow
        // camChange.move.direct = 1;
        // camChange.move.active = true;
        moveTracker.directions.b = true;
    } else if (e.keyCode == '37' || e.keyCode == '65') {
       // left/a arrow
        // camChange.rotate.direct = 1;
        // camChange.rotate.active = true;
        moveTracker.directions.l = true;
    } else if (e.keyCode == '39' || e.keyCode == '68') {
       // right/d arrow
        // camChange.rotate.direct = -1;
        // camChange.rotate.active = true;
        moveTracker.directions.r = true;
    } else if (e.keyCode == '16') {
       // shift -- run
        moveTracker.actions.run = true;
    } else if (e.keyCode == '67') {
       // shift -- run
        moveTracker.actions.crouch = true;
    }

});
// stop actions
window.addEventListener('keyup', (e) => {
    if (e.keyCode == '38' || e.keyCode == '87') moveTracker.directions.f = false
    else if (e.keyCode == '40' || e.keyCode == '83') moveTracker.directions.b = false
    else if (e.keyCode == '37' || e.keyCode == '65') moveTracker.directions.l = false
    else if (e.keyCode == '39' || e.keyCode == '68') moveTracker.directions.r = false
    else if (e.keyCode == '16') moveTracker.actions.run = false
    else if (e.keyCode == '67') moveTracker.actions.crouch = false;
})


//-------------------- Player Movement

function moveCamera(rotation, zcoords) {

	// const charge = rotation < 0 ? -1 : 1;
	let rotateInt = rotation < 0 ? (rotation * -1) : rotation;
	let rotateGuide;
	if (rotateInt >= 1) rotateInt = rotateInt - 1;
	if (rotateInt >= .75) rotateInt = rotateInt - .75;
	if (rotateInt >= .5) rotateInt = rotateInt - .5;
	if (rotateInt >= .25) rotateInt = rotateInt - .25;

	let x = 0; 
	let z = 0;
	let quadX = 0;
	let quadZ = 0;
	let quad = 1;

	// find quadrant
	if (
		(rotation < 0 && rotation >= -.25) ||
		(rotation > 0 && rotation < 1 && rotation >= .75)
	) {
		// front-right
		quad = 1;
		quadX = 1;
		quadZ = -1;
	

	} else if (
		(rotation < 0 && rotation >= -.5 && rotation < -.25) ||
		(rotation > 0 && rotation < .75 && rotation >= .5)
	) {
		// bottom-right
		quad = 2;
		quadX = 1;
		quadZ = 1;
	

	} else if (
		(rotation < 0 && rotation >= -.75 && rotation < -.5) ||
		(rotation > 0 && rotation < .5 && rotation >= .25)
	) {
		//bottom-left
		quad = 3;
		quadX = -1;
		quadZ = 1;
	

	} else if (
		(rotation < 0 && rotation >= -1) ||
		(rotation > 0 && rotation < .25)
	) {
		// top-left
		quad = 4;
		quadX = -1;
		quadZ = -1;
	}


	const ratioDif = rotateInt / .25;
	if (
		(rotation <= .25 && rotation >= -.25) || 
		(rotation <= -.75 && rotation >= -1) ||
		(rotation >= .75 && rotation < 1)
	) {
		console.log('Hemisphere: Top')
		console.log('Quadrant: ' + quad);
		x = ratioDif;
		z = 1 - ratioDif;
		// fix inverse
		if (
			(rotation > 0 && rotation > .5) ||
			(rotation < 0 && rotation < -.5)
		) {
			console.log('---> inverse')
			z = ratioDif;
			x = 1 - ratioDif;
		}

	} else if(
		(rotation > .25 && rotation < .75) ||
		(rotation < -.25 && rotation > -.75)
	) {
		console.log('Hemisphere: Bottom')
			console.log('Quadrant: ' + quad);
		z = ratioDif;
		x = 1 - ratioDif;
		// fix inverse
		if (
			(rotation < -.5 && rotation >= -.75) ||
			(rotation > .5 && rotation <= .75)
		) {
			console.log('---> inverse')
			x = ratioDif;
			z = 1 - ratioDif;
		}

	}


	// using quadrants
	z = z * quadZ;
	x = x * quadX;

	// reverse values based on controls
	// ---------------------------------
	// forward/backward
	if (moveTracker.directions.b) {
		z = z * -1;
		x = x * -1;
	}

	// right/left
	const origX = x;
	const inverseFix = moveTracker.directions.b ? -1 : 1;
	if (moveTracker.directions.r) {
		x = z * -1;			
		z = origX;
	}
	if (moveTracker.directions.l) {
		x = z;			
		z = -origX;
	}



	// console.log(rotateInt)
	return({x:x,z:z});
}


// ----------- get speed and steps

function playerSteps(value) {
	if (moveTracker.actions.crouch) {
		return value/30;
	} else if (moveTracker.actions.run) {
		return value/10;
	} else {
		return value/20;
	}
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
  } else {
	console.log('The pointer lock status is now unlocked');
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
	}, 9)

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