import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { TweenMax } from "gsap";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default function Rose() {

	let camera, scene, renderer, stats;

	//screen variables
	let width = window.innerWidth;
	let height = window.innerHeight;

	let isMovile = width < 600 ? true : false;

	//post process variables
	const postprocessing = {};
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	//bloom params
	let	params = {
		exposure: 1,
		bloomStrength: 0.5,
		bloomThreshold: 0,
		bloomRadius: 0.1
	};
	//post process variable

	const clock = new THREE.Clock();
	let mixer;

	//rain
	const planes = [];
	let particles;
	const leaves = 100;
	

	//Desktop Keyframes
	let PxKey = [-18.210426085816923, 14.155840851402775, -5.954618240455879, -30.069425753526716, -8.68918959963663];
	let PyKey = [147.7394041347256, 40.16273947145469, -2.315295624737873, -75.43381971571996, -198.43381971571995];
	let PzKey = [-73.81922701216679, 1.1228435519628173, 14.025126995276748, 59.8385966589582, -1.947536332215347];
	let RxKey = [-2.747292795034819, 1.9880055433982746, 1.7244907131919927, 0.08914142778441, 1.5707963267948972];
	let RyKey = [-0.3447327494200625, 1.3428862462967754, 0.04465163038297755, -0.37912502957241256, 0];
	let RzKey = [2.386404290083237, 3.40339, 2.8610561812624917, 0.033067542807483835, 0.2524948722906986];

	//Mobile Keyframes
	let MPxKey = [63.60011752649689, 52.155660078014435, 46.489743123008, 74.27971675946814, 6.90649615121295];
	let MPyKey = [127.67108027624823, 80.17108027624852, -1.8289197237514827 , -114.82891972375148, -264.3289197237515];
	let MPzKey = [-118.03795392193378, -77.92219151225389, -69.08209054795668, -112.4406809918906, -0.7824457669215876];
	let MRxKey = [-3.0991986113708725, -3.0991986113708725, -3.069417134970282, -3.069417134970282, -4.692268316654812033];
	let MRyKey = [0.5195876567127464, 0.5195876567127464, 0.5687914698042928, 0.5687914698042928, 0.016468014160117138];
	let MRzKey = [3.1205335622209334, 3.1205335622209334, 3.102669918113523, 3.102669918113523, 3.8331846057];

	//Testing Variables
	const gui = new GUI();

	init();
	animate();

	function init() {

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 ); //fov 45
		if (isMovile == true) {
			camera.position.set( MPxKey[0], MPyKey[0], MPzKey[0] );
			camera.rotation.set( MRxKey[0], MRyKey[0], MRzKey[0] );
		} else {
			camera.position.set( PxKey[0], PyKey[0], PzKey[0] );
			camera.rotation.set( RxKey[0], RyKey[0], RzKey[0] );
		}

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );

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

		initPostprocessing();

		renderer.autoClear = false;

		container.appendChild( renderer.domElement );

		//Post Process



		//Post process End

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
					moveCamera(1);
					break;
				case "2":
					moveCamera(2);
					break;
				case "3":
					moveCamera(3);
					break;
				case "4":
					moveCamera(4);
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

		const effectController = {

		focus: 75,
		aperture: 1.5,
		maxblur: 0.006

		};

		const matChanger = function ( ) {

			postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
			postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
			postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;

		};

		gui.add( effectController, "focus", 10.0, 3000.0, 5 ).onChange( matChanger );
		gui.add( effectController, "aperture", 0, 10, 0.1 ).onChange( matChanger );
		gui.add( effectController, "maxblur", 0.0, 0.01, 0.001 ).onChange( matChanger );

		gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
			renderer.toneMappingExposure = Math.pow( value, 4.0 );
		} );

		gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
			bloomPass.threshold = Number( value );
		} );

		gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
			bloomPass.strength = Number( value );
		} );

		gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
			bloomPass.radius = Number( value );
		} );
		
		gui.close();
		

	}

	function onWindowResize() {

		if (window.innerWidth < 600) { isMovile = true; } else { isMovile= false; };

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		
		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function moveCamera(keyframe) {
		if (isMovile == true) {
			TweenMax.to(camera.position, {
				x: MPxKey[keyframe], 
				y: MPyKey[keyframe], 
				z: MPzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power2.out"
			});
			TweenMax.to(camera.rotation, {
				x: MRxKey[keyframe], 
				y: MRyKey[keyframe], 
				z: MRzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power2.out"
			});
		} else {
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
		}
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
		//renderer.render( scene, camera );
		postprocessing.composer.render( 0.1 );

		stats.update();
		
	}

	function initPostprocessing() {

		const renderPass = new RenderPass( scene, camera );

		//bloom params
		bloomPass.threshold = params.bloomThreshold;
		bloomPass.strength = params.bloomStrength;
		bloomPass.radius = params.bloomRadius;

		//camera focus
		const bokehPass = new BokehPass( scene, camera, {
			focus: 75, //1.0
			aperture: 1.5, //0.025
			maxblur: 0.006, //0.01

			width: width,
			height: height
		} );

		bokehPass.uniforms[ "focus" ].value = 75;
		bokehPass.uniforms[ "aperture" ].value = 1.5 * 0.00001;
		bokehPass.uniforms[ "maxblur" ].value = 0.006;

		const composer = new EffectComposer( renderer );

		composer.addPass( renderPass );
		composer.addPass( bloomPass );
		composer.addPass( bokehPass );

		postprocessing.composer = composer;
		postprocessing.bokeh = bokehPass;

	}

}