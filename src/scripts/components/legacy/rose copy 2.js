import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';

export default function Rose() {

	const params = {
		envMap: 'HDR',
		roughness: 0.0,
		metalness: 0.0,
		exposure: 1.0,
		debug: false
	};

	let container, stats;
	let camera, scene, renderer, controls;
	let torusMesh, planeMesh;
	let generatedCubeRenderTarget, ldrCubeRenderTarget, hdrCubeRenderTarget, rgbmCubeRenderTarget;
	let ldrCubeMap, hdrCubeMap, rgbmCubeMap;

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

		let geometry = new THREE.TorusKnotGeometry( 18, 8, 150, 20 );
		// let geometry = new THREE.SphereGeometry( 26, 64, 32 );
		let material = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			metalness: params.metalness,
			roughness: params.roughness
		} );


		//ROSE AND ROSE MATERIAL
		const rosematerial = new THREE.MeshPhysicalMaterial({});
    
		const texture = new THREE.TextureLoader().load("./assets/texture/metalperla_Base_Color.png");
		rosematerial.map = texture;
		rosematerial.reflectivity = 1.0;
		rosematerial.metalness = 1.0;
		rosematerial.roughness = 0.0;
		// const envTexture = new THREE.CubeTextureLoader().load(["img/px_50.png", "img/nx_50.png", "img/py_50.png", "img/ny_50.png", "img/pz_50.png", "img/nz_50.png"])
		// envTexture.mapping = THREE.CubeReflectionMapping
		// //envTexture.mapping = THREE.CubeRefractionMapping
		// material.envMap = envTexture

		const loader = new FBXLoader();
		loader.load( './assets/model/goldrose.fbx', function ( object ) {

			// mixer = new THREE.AnimationMixer( object );

			// const action = mixer.clipAction( object.animations[ 0 ] );
			// action.play();

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
		//ROSE AND ROSE MATERIAL END LINE

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

		gui.add( params, 'envMap', [ 'Generated', 'LDR', 'HDR', 'RGBM16' ] );
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

		switch ( params.envMap ) {

			case 'Generated':
				renderTarget = generatedCubeRenderTarget;
				cubeMap = generatedCubeRenderTarget.texture;
				break;
			case 'LDR':
				renderTarget = ldrCubeRenderTarget;
				cubeMap = ldrCubeMap;
				break;
			case 'HDR':
				renderTarget = hdrCubeRenderTarget;
				cubeMap = hdrCubeMap;
				break;
			case 'RGBM16':
				renderTarget = rgbmCubeRenderTarget;
				cubeMap = rgbmCubeMap;
				break;

		}

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