import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export default function Rose() {
let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;

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

	// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	// hemiLight.position.set( 0, 200, 0 );
	// scene.add( hemiLight );

	const light1 = new THREE.PointLight(0xffffff, 2);
	const light2 = new THREE.PointLight(0xffffff, 2);
	const light3 = new THREE.PointLight(0xffffff, 2);
	light1.position.set(-7.52, 179.5, 3.48);
	light2.position.set(-18.52, 25.49, 64.49);
	light3.position.set(10, -183.54, 10);
	scene.add(light1);
	scene.add(light2);
	scene.add(light3);

    //Material
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

    //Variables DAT.GUI
    const gui = new GUI();
    const meshPhysicalMaterialFolder = gui.addFolder("THREE.meshPhysicalMaterialFolder");
    meshPhysicalMaterialFolder.add(rosematerial, 'reflectivity', 0, 1);
    meshPhysicalMaterialFolder.add(rosematerial, 'envMapIntensity', 0, 1);
    meshPhysicalMaterialFolder.add(rosematerial, 'roughness', 0, 1);
    meshPhysicalMaterialFolder.add(rosematerial, 'metalness', 0, 1);
    meshPhysicalMaterialFolder.add(rosematerial, 'clearcoat', 0, 1, 0.01);
    meshPhysicalMaterialFolder.add(rosematerial, 'clearcoatRoughness', 0, 1, 0.01);
    meshPhysicalMaterialFolder.open();

	const lightsFolder1 = gui.addFolder("THREE.PointLight");
	lightsFolder1.add(light1, 'intensity', 0, 500);
	lightsFolder1.add(light1, 'distance', 0, 500);
	lightsFolder1.add(light1, 'decay', 0, 10);
	lightsFolder1.add(light1.position, 'x', -500, 500, 0.01);
	lightsFolder1.add(light1.position, 'y', -500, 500, 0.01);
	lightsFolder1.add(light1.position, 'z', -500, 500, 0.01);

	const lightsFolder2 = gui.addFolder("THREE.PointLight2");
	lightsFolder2.add(light2, 'intensity', 0, 500);
	lightsFolder2.add(light2, 'distance', 0, 500);
	lightsFolder2.add(light2, 'decay', 0, 10);
	lightsFolder2.add(light2.position, 'x', -500, 500, 0.01);
	lightsFolder2.add(light2.position, 'y', -500, 500, 0.01);
	lightsFolder2.add(light2.position, 'z', -500, 500, 0.01);

	const lightsFolder3 = gui.addFolder("THREE.PointLight3");
	lightsFolder3.add(light3, 'intensity', 0, 500);
	lightsFolder3.add(light3, 'distance', 0, 500);
	lightsFolder3.add(light3, 'decay', 0, 10);
	lightsFolder3.add(light3.position, 'x', -500, 500, 0.01);
	lightsFolder3.add(light3.position, 'y', -500, 500, 0.01);
	lightsFolder3.add(light3.position, 'z', -500, 500, 0.01);
	

	//ayudantes
	var helper = new THREE.PointLightHelper(light1);
	scene.add(helper);
	var helper2 = new THREE.PointLightHelper(light2);
	scene.add(helper2);
	var helper3 = new THREE.PointLightHelper(light3);
	scene.add(helper3);
    //FIN VARIABLES


	// model
	const loader = new FBXLoader();
	loader.load( './assets/model/goldenroseanimated.fbx.fbx', function ( object ) {

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

	renderer.render( scene, camera );

	stats.update();

}
}