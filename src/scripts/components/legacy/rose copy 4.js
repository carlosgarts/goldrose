import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';

export default function Rose() {

	const params = {
		roughness: 0.0,
		metalness: 0.0,
		exposure: 1.0,
		debug: false
	};

	const loader = new FBXLoader();

	let container, stats;
	let camera, scene, renderer, controls;
	let torusMesh, planeMesh, goldrose;
	let generatedCubeRenderTarget, hdrCubeRenderTarget;
	let hdrCubeMap;

	init();
	animate();

	function getEnvScene() {

		const envScene = new THREE.Scene();

		const geometry = new THREE.BoxGeometry();
		geometry.deleteAttribute( 'uv' );
		const roomMaterial = new THREE.MeshStandardMaterial( { metalness: 0, side: THREE.BackSide } );
		const room = new THREE.Mesh( geometry, roomMaterial );
		room.scale.setScalar( 10 );
		envScene.add( room );

		const mainLight = new THREE.PointLight( 0xffffff, 50, 0, 2 );
		envScene.add( mainLight );

		const lightMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, emissive: 0xffffff, emissiveIntensity: 10 } );

		const light1 = new THREE.Mesh( geometry, lightMaterial );
		light1.material.color.setHex( 0xff0000 );
		light1.position.set( - 5, 2, 0 );
		light1.scale.set( 0.1, 1, 1 );
		envScene.add( light1 );

		const light2 = new THREE.Mesh( geometry, lightMaterial.clone() );
		light2.material.color.setHex( 0x00ff00 );
		light2.position.set( 0, 5, 0 );
		light2.scale.set( 1, 0.1, 1 );
		envScene.add( light2 );

		const light3 = new THREE.Mesh( geometry, lightMaterial.clone() );
		light3.material.color.setHex( 0x0000ff );
		light3.position.set( 2, 1, 5 );
		light3.scale.set( 1.5, 2, 0.1 );
		envScene.add( light3 );

		return envScene;

	}

	async function returnFBX(PATH, scene) {
		return await loader.load('./assets/model/' + PATH + '.fbx', function (object) {
			object.scale.set(.05, .05, .05);
			scene.add( object );
			return object;
		});
	}
	
	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set( 0, 0, 120 );

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );

		renderer = new THREE.WebGLRenderer();
		renderer.physicallyCorrectLights = true;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;

		//
		goldrose = returnFBX( 'goldrose', scene );

		let geometry = new THREE.TorusKnotGeometry( 18, 8, 150, 20 );
		// let geometry = new THREE.SphereGeometry( 26, 64, 32 );
		let material = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			metalness: params.metalness,
			roughness: params.roughness
		} );

		torusMesh = new THREE.Mesh( geometry, material );
		scene.add( torusMesh );

		geometry = new THREE.PlaneGeometry( 200, 200 );
		material = new THREE.MeshBasicMaterial();

		planeMesh = new THREE.Mesh( geometry, material );
		planeMesh.position.y = - 50;
		planeMesh.rotation.x = - Math.PI * 0.5;
		scene.add( planeMesh );

		THREE.DefaultLoadingManager.onLoad = function ( ) {

			pmremGenerator.dispose();

		};

		const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
		hdrCubeMap = new HDRCubeTextureLoader()
			.setPath( './assets/hdri/' )
			.setDataType( THREE.UnsignedByteType )
			.load( hdrUrls, function () {

				hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

				hdrCubeMap.magFilter = THREE.LinearFilter;
				hdrCubeMap.needsUpdate = true;

			} );


		const pmremGenerator = new THREE.PMREMGenerator( renderer );
		pmremGenerator.compileCubemapShader();

		const envScene = getEnvScene();
		generatedCubeRenderTarget = pmremGenerator.fromScene( envScene, 0.04 );

		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		//renderer.toneMapping = ReinhardToneMapping;
		renderer.outputEncoding = THREE.sRGBEncoding;

		stats = new Stats();
		container.appendChild( stats.dom );

		controls = new OrbitControls( camera, renderer.domElement );
		controls.minDistance = 50;
		controls.maxDistance = 300;

		window.addEventListener( 'resize', onWindowResize );

		const gui = new GUI();

		gui.add( params, 'roughness', 0, 1, 0.01 );
		gui.add( params, 'metalness', 0, 1, 0.01 );
		gui.add( params, 'exposure', 0, 2, 0.01 );
		gui.add( params, 'debug', false );
		gui.open();

	}

	function onWindowResize() {

		const width = window.innerWidth;
		const height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );
		console.log(goldrose);
	}

	function animate() {

		requestAnimationFrame( animate );

		stats.begin();
		render();
		stats.end();

	}

	function render() {

		torusMesh.material.roughness = params.roughness;
		torusMesh.material.metalness = params.metalness;

		let renderTarget, cubeMap;

		//Skinning the room HDRI
		renderTarget = hdrCubeRenderTarget;
		cubeMap = hdrCubeMap;


		const newEnvMap = renderTarget ? renderTarget.texture : null;

		if ( newEnvMap && newEnvMap !== torusMesh.material.envMap ) {

			torusMesh.material.envMap = newEnvMap;
			torusMesh.material.needsUpdate = true;

			planeMesh.material.map = newEnvMap;
			planeMesh.material.needsUpdate = true;

		}

		torusMesh.rotation.y += 0.005;
		planeMesh.visible = params.debug;

		scene.background = cubeMap;
		renderer.toneMappingExposure = params.exposure;

		renderer.render( scene, camera );

	}

}