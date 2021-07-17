import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';

import glslify from 'glslify';
import vertexShader from './assets/rose.vert';
import fragmentShader from './assets/rose.frag';


const vertex = glslify(vertexShader);
const fragment = glslify(fragmentShader);

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

	const light = new THREE.DirectionalLight(0xffda6f, 0.1);
	light.position.set(0,1.25,1.25);
	scene.add(light);


	//Env Map

	const envCube = new THREE.CubeTextureLoader()
			.setPath( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/' )
			.load( [
				'skybox2_px.jpg',
				'skybox2_nx.jpg',
				'skybox2_py.jpg',
				'skybox2_ny.jpg',
				'skybox2_pz.jpg',
				'skybox2_nz.jpg'
			] );

	const uniforms = THREE.UniformsUtils.merge( [
	THREE.UniformsLib[ "common" ],
	THREE.UniformsLib[ "lights" ]
	]);

	uniforms.u_color = { value: new THREE.Color(0xa6e4fa) };
	uniforms.u_light_position = { value: light.position.clone() };
	uniforms.u_rim_color = { value: new THREE.Color(0xffffff) };
	uniforms.u_rim_strength = { value: 1.6 };
	uniforms.u_rim_width = { value: 0.6 };
	uniforms.u_envmap_cube = { value: envCube };
	uniforms.u_envmap_strength = { value: 0.7 };


    //Material
	const rosematerial = new THREE.ShaderMaterial( {
	uniforms: uniforms,
	vertexShader: vertex,
	fragmentShader: fragment,
	lights: true
	} );
    

	// model
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

	renderer.render( scene, camera );

	stats.update();

}
}