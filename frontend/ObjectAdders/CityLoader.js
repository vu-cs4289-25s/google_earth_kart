import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import * as CANNON from 'cannon-es';
import * as THREE from "three";
import CannonDebugger from "cannon-es-debugger";

export function loadCity(world, physicsWorld){
    const loader = new OBJLoader();

    loader.load(
        'ObjFiles/small-city-buildings.obj',
        function (object) {
            object.scale.set(1,1,1);
            world.scene.add(object);
            createCannonBody(object, physicsWorld)
            console.log("city added");
        },
        function (xhr) {},
        function (error) {
            console.log(error);
        },
    );

    // create a ground body with a static plane
    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        // infinte geometric plane
        shape: new CANNON.Plane(),
    });


// rotate ground body by 90 degrees
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);



    const floorGeometry = new THREE.PlaneGeometry(200, 200); // Adjust size as needed
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floorMesh.position.y = 0; // Set at y = 0
    world.scene.add(floorMesh);

}


function createCannonBody(model, physicsWorld) {
    model.traverse((child) => {
        if (child.isMesh) {
            const geometry = child.geometry;
            geometry.computeBoundingBox(); // Ensure bounding box exists

            const min = geometry.boundingBox.min;
            const max = geometry.boundingBox.max;

            // Create a simple box shape based on the bounding box
            const halfExtents = new CANNON.Vec3(
                (max.x - min.x) / 2,
                (max.y - min.y) / 2,
                (max.z - min.z) / 2
            );

            const shape = new CANNON.Box(halfExtents);
            const body = new CANNON.Body({
                mass: 0, // Static
                shape: shape,
            });

            // Position the physics body at the center of the Three.js object
            body.position.set(
                (max.x + min.x) / 2,
                (max.y + min.y) / 2,
                (max.z + min.z) / 2
            );

            physicsWorld.addBody(body);
        }
    });
}