import * as CANNON from 'cannon-es';
import * as THREE from "three";
import {handleKeyDown, handleKeyUp} from "../controls/keyboard-controls.js";
const carDimensions = {
    width: 2,
    height: 1,
    depth: 4
}

const mass = 2;
const axisWidth = 2.5;

const wheelRadius = .5;

const wheelShape = new CANNON.Sphere(wheelRadius);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

export class Car{

    constructor(threejsWorld, physicsWorld) {
        this.carBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 6, 0),
            shape: new CANNON.Box(new CANNON.Vec3(carDimensions.width/2, carDimensions.height/2, carDimensions.depth/2)),
        });

        this.vehicle = new CANNON.RigidVehicle({
            chassisBody: this.carBody,
        });

        this.wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
        this.wheelBody1.addShape(wheelShape);
        this.wheelBody1.angularDamping = 0.4;

        this.vehicle.addWheel({
            body:  this.wheelBody1,
            position: new CANNON.Vec3(-.5 * (carDimensions.width), -.5, axisWidth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down,
        });

        this.wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
        this.wheelBody2.addShape(wheelShape);
        this.wheelBody2.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody2,
            position: new CANNON.Vec3(-.5*(carDimensions.width), -.5, -axisWidth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down,
        });

        this.wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
        this.wheelBody3.addShape(wheelShape);
        this.wheelBody3.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody3,
            position: new CANNON.Vec3(.5*(carDimensions.width), -.5, axisWidth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down,
        });

        this.wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
        this.wheelBody4.addShape(wheelShape);
        this.wheelBody4.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody4,
            position: new CANNON.Vec3(.5*(carDimensions.width), -.5, -axisWidth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down,
        });


        const boxGeometry = new THREE.BoxGeometry(carDimensions.width, carDimensions.height, carDimensions.depth);
        const boxMaterial = new THREE.MeshNormalMaterial();
        this.carBodyMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        threejsWorld.scene.add(this.carBodyMesh);

        const sphereGeometry1 = new THREE.SphereGeometry(wheelRadius);
        const sphereMaterial1 = new THREE.MeshNormalMaterial();
        this.wheelMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
        threejsWorld.scene.add(this.wheelMesh1);

        const sphereGeometry2 = new THREE.SphereGeometry(wheelRadius);
        const sphereMaterial2 = new THREE.MeshNormalMaterial();
        this.wheelMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
        threejsWorld.scene.add(this.wheelMesh2);

        const sphereGeometry3 = new THREE.SphereGeometry(wheelRadius);
        const sphereMaterial3 = new THREE.MeshNormalMaterial();
        this.wheelMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
        threejsWorld.scene.add(this.wheelMesh3);

        const sphereGeometry4 = new THREE.SphereGeometry(wheelRadius);
        const sphereMaterial4 = new THREE.MeshNormalMaterial();
        this.wheelMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
        threejsWorld.scene.add(this.wheelMesh4);

        this.vehicle.addToWorld(physicsWorld);

        document.addEventListener('keydown', (event) => {
            handleKeyDown(this.vehicle, event)
        });

// reset car force to zero when key is released
        document.addEventListener('keyup', (event) => {
            handleKeyUp(this.vehicle, event)
        });
    }

    animateCar(threejsWorld){
        // Update car body and wheel positions
        this.carBodyMesh.position.copy(this.carBody.position);
        this.carBodyMesh.quaternion.copy(this.carBody.quaternion);
        this.wheelMesh1.position.copy(this.wheelBody1.position);
        this.wheelMesh1.quaternion.copy(this.wheelBody1.quaternion);
        this.wheelMesh2.position.copy(this.wheelBody2.position);
        this.wheelMesh2.quaternion.copy(this.wheelBody2.quaternion);
        this.wheelMesh3.position.copy(this.wheelBody3.position);
        this.wheelMesh3.quaternion.copy(this.wheelBody3.quaternion);
        this.wheelMesh4.position.copy(this.wheelBody4.position);
        this.wheelMesh4.quaternion.copy(this.wheelBody4.quaternion);

        // Camera follows and rotates with the car
        let carPosition = new THREE.Vector3().copy(this.carBody.position);
        const carQuaternion = new THREE.Quaternion().copy(this.carBody.quaternion);

        // Offset in local car space (behind and above)
        const localOffset = new THREE.Vector3(0, 5, -20); // 3 above, 5 behind
        const worldOffset = localOffset.applyQuaternion(carQuaternion); // Rotate offset with car

        const cameraPosition = carPosition.clone().add(worldOffset);
        threejsWorld.camera.position.copy(cameraPosition);
        threejsWorld.camera.lookAt(carPosition); // Make camera always look at the car
    }
}