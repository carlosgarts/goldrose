import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';


export default function Rose() {

	let camera, scene, renderer, stats;
	const clock = new THREE.Clock();
	let mixer;

	//rain
	const planes = [];
	const leaves = 100;

	init();
	animate();

	function init() {

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.set( 100, 200, 300 );

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

		//Env Map

		// THREE.DefaultLoadingManager.onLoad = function ( ) {

		// 	pmremGenerator.dispose();

		// };

		// let hdrCubeRenderTarget;
		// const pmremGenerator = new THREE.PMREMGenerator( renderer );
		const path = './assets/cubemap/';
		const urls = [ path + 'px.png', path + 'nx.png', path + 'py.png', path + 'ny.png', path + 'pz.png', path + 'nz.png' ];
		const reflectionCube = new THREE.CubeTextureLoader().load( urls );

		scene.background = reflectionCube;
		// const hdrCubeMap = new THREE.HDRCubeTextureLoader()
		// 		.setPath( './assets/hdri/' )
		// 		.setDataType( THREE.UnsignedByteType )
		// 		.load( hdrUrls, function () {
		// 			hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

		// 			hdrCubeMap.magFilter = THREE.LinearFilter;
		// 			hdrCubeMap.needsUpdate = true;
		// 		} );
		
		//Env Map Fin

		// Plane Particles

		const planePiece = new THREE.PlaneGeometry( 10, 10, 1, 1 );

		const planeMat = new THREE.MeshPhongMaterial( {
			color: 0xffffff * 0.4,
			shininess: 0.5,
			specular: 0xffffff,
			envMap: reflectionCube,
			side: THREE.DoubleSide
		} );

		const rand = Math.random;

		for ( let i = 0; i < leaves; i ++ ) {

			const plane = new THREE.Mesh( planePiece, planeMat );
			plane.rotation.set( rand(), rand(), rand() );
			plane.rotation.dx = rand() * 0.1;
			plane.rotation.dy = rand() * 0.1;
			plane.rotation.dz = rand() * 0.1;

			plane.position.set( rand() * 150, 0 + rand() * 300, rand() * 150 );
			plane.position.dx = ( rand() - 0.5 );
			plane.position.dz = ( rand() - 0.5 );
			scene.add( plane );
			planes.push( plane );

		}

		//Material Rose
		const texture = new THREE.TextureLoader().load("./assets/texture/metalperla_Base_Color.png");
		const rosematerial = new THREE.MeshStandardMaterial( { envMap: reflectionCube, metalness: 0.9, roughness: 0.0, combine: THREE.MixOperation, reflectivity: 0.3 } );
    	rosematerial.map = texture;

		// Model Rose
		const loader = new FBXLoader();
		loader.load( './assets/model/goldenroseanimated.fbx', function ( object ) {

			mixer = new THREE.AnimationMixer( object );

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

		const controls = new OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 100, 0 );
		controls.update();

		window.addEventListener( 'resize', onWindowResize );

		// stats
		stats = new Stats();
		container.appendChild( stats.dom );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

		const delta = clock.getDelta();

		if ( mixer ) mixer.update( delta );

		//animacion de lluvia
		for ( let i = 0; i < leaves; i ++ ) {

			const plane = planes[ i ];
			plane.rotation.x += (plane.rotation.dx * 0.1);
			plane.rotation.y += (plane.rotation.dy * 0.1);
			plane.rotation.z += (plane.rotation.dz * 0.1);
			plane.position.y -= 0.05;
			// plane.position.x += plane.position.dx;
			// plane.position.z += plane.position.dz;

			if ( plane.position.y < 0 ) plane.position.y += 300;

		}
		//Fin de animacion de lluvia

		renderer.render( scene, camera );

		stats.update();

	}
}