import * as THREE from 'three';			
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { TweenMax } from "gsap";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import SetFlakes from './utils/SetFlakes';
import * as Keyframes from './assets/keyframes.json';

let camera;
const renderer = new THREE.WebGLRenderer( { antialias: true } );
const scene = new THREE.Scene();

var loadingManager;

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
var mixer;

//particles
const flakes = 100;
var particles = new THREE.Object3D();

const keyFr = Keyframes;

export default {
	name: 'Rose',
	methods: {
		init: function(element) {

			const container = document.getElementById('rose');
			//Load Screen
			loadingManager = new THREE.LoadingManager( () => {
				const loadingScreen = document.getElementById( 'loadscreen' );
				loadingScreen.classList.add( 'fade-out' );
				setTimeout(() => loadingScreen.style.display = "none" , 1000);
			} );

			//Env Map
			let path = './assets/cubemap/';
			let urls = [ path + 'px.png', path + 'nx.png', path + 'py.png', path + 'ny.png', path + 'pz.png', path + 'nz.png' ];
			const reflectionCube = new THREE.CubeTextureLoader().load( urls );
			scene.background = reflectionCube;

			this.initLights(scene);
			this.initCameras(window.innerHeight, window.innerWidth, keyFr);

			// Plane Particles
			scene.add( particles );
			const planePiece = new THREE.PlaneGeometry( 10, 10, 1, 1 );
			const planeMat = new THREE.MeshPhongMaterial( {
				color: 0xffffff * 0.4,
				shininess: 0.5,
				specular: 0xffffff,
				envMap: reflectionCube,
				side: THREE.DoubleSide
			} );

			SetFlakes(flakes, particles, planePiece, planeMat);

			//Material Rose
			const texture = new THREE.TextureLoader().load("./assets/texture/metalperla_Base_Color.png");
			const rosematerial = new THREE.MeshStandardMaterial( { envMap: reflectionCube, metalness: 1.0, roughness: 0.0 } );
    		rosematerial.map = texture;

			// Model Rose
			this.initMesh('./assets/model/goldenroseanimated.fbx', rosematerial);

			this.initRenderer(renderer, window.innerWidth, window.innerHeight);

			container.appendChild( renderer.domElement );

			window.addEventListener( 'resize', this.onWindowResize );

		},
		onWindowResize: function() {
			if (window.innerWidth < 600) { isMovile = true; } else { isMovile= false; };

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			
			renderer.setSize( window.innerWidth, window.innerHeight );
		},
		animate: function() {
			//requestAnimationFrame( animate );
			const delta = clock.getDelta();

			if ( mixer ) mixer.update( delta );

			//animacion de particulas
			particles.rotation.x -= 0.0005;
			particles.rotation.y -= 0.001;
			particles.traverse( function(child) {
				if ( child.isMesh ) {
					child.rotation.x += 0.005;
					child.rotation.y += 0.005;
					child.rotation.z += 0.005;
				}
			});
			//Fin de animacion de particula
			//renderer.render( scene, camera );
			postprocessing.composer.render( 0.1 );
			
		},
		initLights: function(scene) {
			const ambient = new THREE.AmbientLight( 0xffffff );
			const pointLight = new THREE.PointLight( 0xffffff, 2 );
			const light1 = new THREE.PointLight(0xffffff, 2);
			light1.position.set(-7.52, 179.5, 3.48);

			scene.add( ambient );
			scene.add( pointLight );
			scene.add(light1);
		},
		initCameras: function(height, width, keyframes) {
			camera = new THREE.PerspectiveCamera( 70, width / height, 1, 2000 ); //fov 45
			if (isMovile == true) {
				camera.position.set( 
					keyframes.movil.PxKey[0],
					keyframes.movil.PyKey[0],
					keyframes.movil.MPzKey[0] 
					);
				camera.rotation.set( 
					keyframes.movil.MRxKey[0],
					keyframes.movil.MRyKey[0],
					keyframes.movil.MRzKey[0] 
					);
			} else {
				camera.position.set( 
					keyframes.desk.PxKey[0], 
					keyframes.desk.PyKey[0],
					keyframes.desk.PzKey[0] 
					);
				camera.rotation.set( 
					keyframes.desk.RxKey[0],
					keyframes.desk.RyKey[0],
					keyframes.desk.RzKey[0]
					);
			}
		},
		initRenderer: function(renderer, width, height) {
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			renderer.shadowMap.enabled = true;

			this.initPostprocessing();

			renderer.autoClear = false;
		},
		moveCamera: function(keyframe) {
			if (isMovile == true) {
			TweenMax.to(camera.position, {
				x: keyFr.movil.PxKey[keyframe], 
				y: keyFr.movil.PyKey[keyframe], 
				z: keyFr.movil.PzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power0.out"
			});
			TweenMax.to(camera.rotation, {
				x: keyFr.movil.RxKey[keyframe], 
				y: keyFr.movil.RyKey[keyframe], 
				z: keyFr.movil.RzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power0.out"
			});
		} else {
			TweenMax.to(camera.position, {
				x: keyFr.desk.PxKey[keyframe], 
				y: keyFr.desk.PyKey[keyframe], 
				z: keyFr.desk.PzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power2.out"
			});
			TweenMax.to(camera.rotation, {
				x: keyFr.desk.RxKey[keyframe], 
				y: keyFr.desk.RyKey[keyframe], 
				z: keyFr.desk.RzKey[keyframe],
				delay:0.5,
				duration:3.5,
				ease: "power2.out"
			});
		}

		},
		initMesh: function(meshUrl, rosematerial) {
				const loader = new FBXLoader( loadingManager );
				loader.load( meshUrl, function ( object ) {

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
		},
		initPostprocessing: function() {

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

};