import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { KeyboardControls } from "./controls/keyboard-controls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

camera.position.y = 3;
camera.position.z = 5;

const loader = new OBJLoader();

let player;
let keyboardControls;

loader.load(
    "ObjFiles/TestObj.obj",
    function (object) {
        object.scale.set(0.01, 0.01, 0.01);
        scene.add(object);
        console.log("city added");
    },
    function (xhr) {},
    function (error) {
        console.log("An error happened");
    },
);

loader.load(
    "ObjFiles/jeff.obj",
    function (object) {
        object.scale.set(0.01, 0.01, 0.01);
        player = object;
        scene.add(player);
        console.log("player added");

        keyboardControls = new KeyboardControls(player, camera);
    },
    function (xhr) {},
    function (error) {
        console.log("An error happened");
    },
);

function animate() {
    if (keyboardControls) {
        keyboardControls.update();
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
