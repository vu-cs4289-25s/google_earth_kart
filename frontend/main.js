import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import SceneInit from './utils/SceneInit';
import {loadCity} from "./ObjectAdders/CityLoader.js";
import {Car} from "./ObjectAdders/CarLoader.js";


const threejsWorld = new SceneInit('myThreeJsCanvas');
threejsWorld.initialize();
threejsWorld.animate();

const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

const axesHelper = new THREE.AxesHelper(8);
threejsWorld.scene.add(axesHelper);

const cannonDebugger = new CannonDebugger(threejsWorld.scene, physicsWorld, {
});
loadCity(threejsWorld, physicsWorld);

let car = new Car(threejsWorld, physicsWorld);


const animate = () => {
    physicsWorld.fixedStep();
    cannonDebugger.update();

    car.animateCar(threejsWorld);

    window.requestAnimationFrame(animate);
};
animate();


