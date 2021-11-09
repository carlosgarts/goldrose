import * as THREE from 'three';	

const rand = Math.random;

function randEx() {
	let number = Math.random();
	if(number >= 0.5 && number <= 0.7){
		return (number + 0.3);
	} else if (number >= 0.3 && number < 0.5) {
		return (number - 0.3);
	}
	else {
		return number;
	}
}

function SetFlakes(flakes, particles, planePiece, planeMat) {
    for ( let i = 0; i < flakes; i ++ ) {
		const plane = new THREE.Mesh( planePiece, planeMat );
		plane.position.set( randEx() - 0.5, randEx() - 0.5, randEx() - 0.5 ).normalize();
		plane.position.multiplyScalar( rand() * 400 * 2);
		plane.rotation.set( rand() * 2, rand() * 2, rand() * 2 );
		particles.add( plane );
	}
}

export default SetFlakes;