import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { TweenMax } from "gsap";

import { BokehShader, BokehDepthShader } from 'three/examples/jsm/shaders/BokehShader2.js';


export default function Rose() {

	let camera, scene, renderer, stats;
	const clock = new THREE.Clock();
	let mixer;

	//rain
	const planes = [];
	let particles;
	const leaves = 100;
	

	//Keyframes
	let PxKey = [-18.210426085816923, 14.155840851402775, -5.954618240455879, -30.069425753526716, -8.68918959963663];
	let PyKey = [147.7394041347256, 40.16273947145469, -2.315295624737873, -75.43381971571996, -198.43381971571995];
	let PzKey = [-73.81922701216679, 1.1228435519628173, 14.025126995276748, 59.8385966589582, -1.947536332215347];
	let RxKey = [-2.747292795034819, 1.9880055433982746, 1.7244907131919927, 0.08914142778441, 1.5707963267948972];
	let RyKey = [-0.3447327494200625, 1.3428862462967754, 0.04465163038297755, -0.37912502957241256, 0];
	let RzKey = [2.386404290083237, 3.40339, 2.8610561812624917, 0.033067542807483835, 0.2524948722906986];

	//Testing Variables
	const gui = new GUI();

	init();
	animate();

	function init() {

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 ); //fov 45
		camera.position.set( PxKey[0], PyKey[0], PzKey[0] );
		camera.rotation.set( RxKey[0], RyKey[0], RzKey[0] );

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );
		//scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

		// const light = new THREE.DirectionalLight(0xffda6f, 0.1);
		// light.position.set(0,1.25,1.25);
		// scene.add(light);

		const ambient = new THREE.AmbientLight( 0xffffff );
		scene.add( ambient );

		let pointLight = new THREE.PointLight( 0xffffff, 2 );
		scene.add( pointLight );

		const light1 = new THREE.PointLight(0xffffff, 2);
		light1.position.set(-7.52, 179.5, 3.48);
		scene.add(light1);
		//Env Map
	
		const path = './assets/cubemap/';
		const urls = [ path + 'px.png', path + 'nx.png', path + 'py.png', path + 'ny.png', path + 'pz.png', path + 'nz.png' ];
		const reflectionCube = new THREE.CubeTextureLoader().load( urls );

		scene.background = reflectionCube;
		
		//Env Map Fin

		// Plane Particles

		particles = new THREE.Object3D();
		scene.add( particles );

		const planePiece = new THREE.PlaneGeometry( 10, 10, 1, 1 );

		const planeMat = new THREE.MeshPhongMaterial( {
			color: 0xffffff * 0.4,
			shininess: 0.5,
			specular: 0xffffff,
			envMap: reflectionCube,
			side: THREE.DoubleSide
		} );

		const rand = Math.random;

		function randEx() {
			let number = Math.random();
			if(number >= 0.5 && number <= 0.7){
				//console.log(number + 0.3);
				return (number + 0.3);
			} else if (number >= 0.3 && number < 0.5) {
				//console.log(number - 0.3);
				return (number - 0.3);
			}
			else {
				return number;
			}
		}

		for ( let i = 0; i < leaves; i ++ ) {

			const plane = new THREE.Mesh( planePiece, planeMat );
			plane.position.set( randEx() - 0.5, randEx() - 0.5, randEx() - 0.5 ).normalize();
			plane.position.multiplyScalar( rand() * 400 * 2);
			plane.rotation.set( rand() * 2, rand() * 2, rand() * 2 );
			particles.add( plane );
		}

		//Material Rose
		const texture = new THREE.TextureLoader().load("./assets/texture/metalperla_Base_Color.png");
		const rosematerial = new THREE.MeshStandardMaterial( { envMap: reflectionCube, metalness: 1.0, roughness: 0.0 } );
    	rosematerial.map = texture;

		// Model Rose
		const loader = new FBXLoader();
		loader.load( './assets/model/goldenroseanimated.fbx', function ( object ) {

			mixer = new THREE.AnimationMixer( object );
			//cameraMixer = new THREE.AnimationMixer( object );

			const action = mixer.clipAction( object.animations[ 0 ] );
			action.timeScale = 0.2;
			action.play();


			object.traverse( function ( child ) {

				if ( child.isMesh ) {
					
					child.castShadow = true;
					child.receiveShadow = true;
					child.material = rosematerial;

				}

			} );

			object.scale.set(.05, .05, .05);
			scene.add( object );

		} );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		container.appendChild( renderer.domElement );

		// const controls = new OrbitControls( camera, renderer.domElement );
		// controls.target.set( 0, 100, 0 );
		// controls.update();

		window.addEventListener( 'resize', onWindowResize );

		// stats
		stats = new Stats();
		container.appendChild( stats.dom );

		//Camara de desarrollo
		const controls = new PointerLockControls(camera, renderer.domElement);

			const onKeyDown = function (KeyboardEvent) {
			switch (event.key) {
				case "w":
					controls.moveForward(.5)
					break;
				case "a":
					controls.moveRight(-.5)
					break;
				case "s":
					controls.moveForward(-.5)
					break;
				case "d":
					controls.moveRight(.5)
					break;
				case "q":
					//controls.moveUp(.10)
					camera.position.y += .5;
					break;
				case "e":
					//controls.moveUp(-.10)
					camera.position.y -= .5;
					break;
				case "r":
					console.log('----DATA----');
					console.log('::posicion x:: - ' + camera.position.x);
					console.log('::posicion y:: - ' + camera.position.y);
					console.log('::posicion z:: - ' + camera.position.z);
					console.log('::rotacion x:: - ' + camera.rotation.x);
					console.log('::rotacion y:: - ' + camera.rotation.y);
					console.log('::rotacion z:: - ' + camera.rotation.z);
					console.log('----END----');
					break;
				case "0":
					moveCamera(0);
					break;
				case "1":
					moveCamera(2);
					break;
				case "z":
					if ( controls.isLocked ){
						controls.unlock();
						break;
					}
					else {
						controls.lock();
						break;
					}
			}
		};
		document.addEventListener('keydown', onKeyDown, false);

		const meshPhysicalMaterialFolder = gui.addFolder("Main Camera Rotation");
		meshPhysicalMaterialFolder.add(camera.rotation, 'x', 0, 6, 0.01);
		meshPhysicalMaterialFolder.add(camera.rotation, 'y', 0, 6, 0.01);
		meshPhysicalMaterialFolder.add(camera.rotation, 'z', 0, 6, 0.01);
		meshPhysicalMaterialFolder.open();
		//Fin Camara de desarrollo

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function moveCamera(keyframe) {
		TweenMax.to(camera.position, {
			x: PxKey[keyframe], 
			y: PyKey[keyframe], 
			z: PzKey[keyframe],
			delay:0.5,
			duration:3.5,
			ease: "power2.out"
		});
		TweenMax.to(camera.rotation, {
			x: RxKey[keyframe], 
			y: RyKey[keyframe], 
			z: RzKey[keyframe],
			delay:0.5,
			duration:3.5,
			ease: "power2.out"
		});
		// camera.position.x = PxKey[keyframe];
		// camera.position.y = PyKey[keyframe];
		// camera.position.z = PzKey[keyframe];
		// camera.rotation.set( RxKey[keyframe], RyKey[keyframe], RzKey[keyframe] );

		//Tweening
		// let tweencam = new TWEEN.Tween(camera.position);
		// tweencam
		// .to({ x: PxKey[keyframe], y: PyKey[keyframe], z: PzKey[keyframe] }, 1000)
		// .easing(TWEEN.Easing.Quadratic.Out)
		// .onUpdate(() => {
		// 	// Called after tween.js updates 'coords'.
		// 	// Move 'box' to the position described by 'coords' with a CSS translation.
		// 	//box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`)
		// })
		// .start();
		//Tweening End
	}

	function animate() {

		requestAnimationFrame( animate );

		const delta = clock.getDelta();

		if ( mixer ) mixer.update( delta );

		//animacion de particulas o lluvia
		particles.rotation.x -= 0.0005;
		particles.rotation.y -= 0.001;
		particles.traverse( function(child) {
			if ( child.isMesh ) {
				child.rotation.x += 0.005;
				child.rotation.y += 0.005;
				child.rotation.z += 0.005;
			}
		});
		//Fin de animacion de lluvia
		renderer.render( scene, camera );

		stats.update();
		
	}

}