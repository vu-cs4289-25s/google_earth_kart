import React, {useEffect, useState} from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import CANNON from "cannon-es";

export default function City(props) {
    const [cityObj, setCityObj] = useState(null);

    useEffect(() => {
        const loader = new OBJLoader();
        loader.load(
            "../assets/small-city-buildings.obj",
            (object) => {
                console.log("city loaded")
                object.scale.set(1, 1, 1);
                setCityObj(object);
            },
            undefined,
            (error) => console.error(error)
        );
    }, []);

    if (!cityObj) return null; // Don't render anything until the model is loaded

    return <primitive object={cityObj} />;
}

// function createCannonBody(model, physicsWorld) {
//     model.traverse((child) => {
//         if (child.isMesh) {
//             const geometry = child.geometry;
//             geometry.computeBoundingBox(); // Ensure bounding box exists
//
//             const min = geometry.boundingBox.min;
//             const max = geometry.boundingBox.max;
//
//             // Create a simple box shape based on the bounding box
//             const halfExtents = new CANNON.Vec3(
//                 (max.x - min.x) / 2,
//                 (max.y - min.y) / 2,
//                 (max.z - min.z) / 2,
//             );
//
//             const shape = new CANNON.Box(halfExtents);
//             const body = new CANNON.Body({
//                 mass: 0, // Static
//                 shape: shape,
//             });
//
//             // Position the physics body at the center of the Three.js object
//             body.position.set(
//                 (max.x + min.x) / 2,
//                 (max.y + min.y) / 2,
//                 (max.z + min.z) / 2,
//             );
//
//             physicsWorld.addBody(body);
//         }
//     });
// }

