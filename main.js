import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {keyCodes} from "./utils/keycodes"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);


camera.position.y = 3
camera.position.z = 5;

function animate() {
    updateCameraMovement();
    renderer.render( scene, camera );
}

const loader = new OBJLoader();

// load a resource
loader.load(
    // resource URL
    'ObjFiles/TestObj.obj',
    // called when resource is loaded
    function ( object ) {

        object.scale.set(0.01, 0.01, 0.01)
        scene.add( object );
        console.log("added")

    },
    // called when loading is in progress
    function ( xhr ) {


    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const player = new THREE.Mesh( geometry, material );
scene.add( player );

player.position.y = 1
player.position.z = 0;

let xSpeed = .25
let ySpeed = .25
let zSpeed = .25


// Track the state of the keys being pressed
let keysPressed = {
w: false,
s: false,
a: false,
d: false,
space: false,
shift: false
};

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;

    if (keyCode === keyCodes.w) {
        keysPressed.w = true;
    } else if (keyCode === keyCodes.s) {
        keysPressed.s = true;
    } else if (keyCode === keyCodes.a) {
        keysPressed.a = true;
    } else if (keyCode === keyCodes.d) {
        keysPressed.d = true;
    } else if (keyCode === keyCodes.space) {
        keysPressed.space = true;
    } else if (keyCode === keyCodes.shift) {
        keysPressed.shift = true;
    }
}

function onDocumentKeyUp(event) {
    var keyCode = event.which;

    if (keyCode === keyCodes.w) {
        keysPressed.w = false;
    } else if (keyCode === keyCodes.s) {
        keysPressed.s = false;
    } else if (keyCode === keyCodes.a) {
        keysPressed.a = false;
    } else if (keyCode === keyCodes.d) {
        keysPressed.d = false;
    } else if (keyCode === keyCodes.space) {
        keysPressed.space = false;
    } else if (keyCode === keyCodes.shift) {
        keysPressed.shift = false;
    }
}

// Update the camera position based on the keys pressed
function updateCameraMovement() {
    if (keysPressed.w) {
        player.position.z -= zSpeed;
        camera.position.z -= zSpeed;
    }
    if (keysPressed.s) {
        player.position.z += zSpeed
        camera.position.z += zSpeed;
    }
    if (keysPressed.a) {
        player.position.x -= xSpeed
        camera.position.x -= xSpeed;
    }
    if (keysPressed.d) {
        player.position.x += xSpeed;
        camera.position.x += xSpeed;
    }
    if (keysPressed.space) {
        player.position.y += ySpeed;
        camera.position.y += ySpeed;
    }
    if (keysPressed.shift) {
        player.position.y -= ySpeed;
        camera.position.y -= ySpeed;
    }
}

renderer.setAnimationLoop( animate );