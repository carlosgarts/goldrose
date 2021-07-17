import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';

export default function Rose() {

	//Creando la escena
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff ); //Change to 0x000000
	//Creando la camara
	const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 120 );
	//Creando el renderer
	const renderer = new THREE.WebGLRenderer();
	renderer.physicallyCorrectLights = true;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement); //Appending - Reemplazar por elemento del DOM
	//Controles de prueba
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = true;
	controls.target.set(0, 1, 0);

	//luz de prueba
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	scene.add( directionalLight );

	//Material
	const material = new THREE.MeshStandardMaterial( { color: 0xff00ff, metalness: 0.5, roughness: 0.0 } );
	const texture = new THREE.TextureLoader().load("./assets/texture/metalperla_Base_Color.png");
    material.map = texture;
    //material.reflectivity = 0.5;//Cambiar para que se vea mejor al final
    material.metalness = 0.5; //Cambiar para que se vea mejor al final
    material.roughness = 0.0;
	//Material Fin

	//Mesh Loader
	const fbxLoader = new FBXLoader();
	fbxLoader.load(
		'./assets/model/goldrose.fbx',
		(object) => {
			// object.traverse(function (child) {
			//     if ((<THREE.Mesh>child).isMesh) {
			//         (<THREE.Mesh>child).material = material
			//         if ((<THREE.Mesh>child).material) {
			//             ((<THREE.Mesh>child).material as THREE.MeshBasicMaterial).transparent = false
			//         }
			//     }
			// })
			object.material = material;
			object.scale.set(.05, .05, .05);
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		(error) => {
			console.log(error);
		}
	);


	//Funcion Responsive
	window.addEventListener('resize', onWindowResize, false);
	function onWindowResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );
	}

	//Animar y Renderizar
	const stats = Stats(); //Frames por segundo... quitar luego
	function animate() {

		requestAnimationFrame( animate );

		stats.begin();
		render();
		stats.end();

	}
	function render() {
    	renderer.render(scene, camera); //Aqui se hacen cosas del hdri
	}

	//Funcion para crear el cuarto y definir el envelop
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
	//FIN DE: Funcion para crear el cuarto y definir el envelop
	animate();

}