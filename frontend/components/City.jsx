// import { useEffect, useState } from "react";
// import { useLoader } from "@react-three/fiber";
// import { useBox, usePlane } from "@react-three/cannon";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//
//
// export default function City() {
//     const [cityObj, setCityObj] = useState(null);
//
//     useEffect(() => {
//         const loader = new OBJLoader();
//         const gldLoader = new GLTFLoader();
//         // loader.load(
//         //     "../assets/small-city-buildings.obj",
//         //     (object) => {
//         //         object.position.set(0, -1, 0);
//         //         object.traverse((child) => {
//         //             if (child.isMesh) {
//         //                 child.geometry.computeBoundingBox();
//         //             }
//         //         });
//         //         setCityObj(object);
//         //     },
//         //     undefined,
//         //     (error) => console.error(error),
//         // );
//     }, []);
//
//     if (!cityObj) return null;
//
//     return (
//         <group>
//             {/* Physics collisions for each mesh */}
//             {cityObj.children.map((child, index) =>
//                 child.isMesh ? (
//                     <CityCollisionBox key={index} mesh={child} />
//                 ) : null,
//             )}
//
//             {/* Render the visual city model */}
//             <primitive object={cityObj} />
//
//             {/* Add a static floor */}
//             <CityFloor />
//         </group>
//     );
// }
//
// // Creates physics-based collision boxes for each building mesh
// function CityCollisionBox({ mesh }) {
//     let bbox = mesh.geometry.boundingBox;
//
//     if (!bbox) return null;
//
//     const size = [
//         bbox.max.x - bbox.min.x,
//         bbox.max.y - bbox.min.y,
//         bbox.max.z - bbox.min.z,
//     ];
//     const position = [
//         (bbox.max.x + bbox.min.x) / 2,
//         (bbox.max.y + bbox.min.y) / 2 - 1,
//         (bbox.max.z + bbox.min.z) / 2,
//     ];
//
//     useBox(() => ({
//         args: size,
//         position,
//         type: "Static",
//     }));
//
//     return null;
// }
//
// // Adds a large static floor for the city
// function CityFloor() {
//     const [floorRef] = usePlane(() => ({
//         position: [0, -0.5, 0],
//         rotation: [-Math.PI / 2, 0, 0],
//         type: "Static",
//     }));
//
//     return (
//         <mesh ref={floorRef} receiveShadow>
//             <planeGeometry args={[200, 200]} />
//             <meshStandardMaterial color="gray" />
//         </mesh>
//     );
// }

import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export default function City() {
    const [cityObj, setCityObj] = useState(null);
    const [terrainMesh, setTerrainMesh] = useState(null);
    const [boundingBox, setBoundingBox] = useState(null);
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [debugCollision, setDebugCollision] = useState(false); // State to toggle collision visibility
    const customBoxes = [
        { size: [420 * 2, 70, 1], position: [-30 + 364, -30, -435 + 226], rotation: [0, 31, 0] },  // Rotate 45 degrees around Y-axis
        { size: [370 * 2, 70, 1], position: [-45+ 364, -30, -393+ 226], rotation: [0, 31.1, 0] }, // Rotate 30 degrees around X-axis
        { size: [187 * 2, 70, 1], position: [-265+ 364, -30, -42+ 226], rotation: [0, 121.1, 0] }, // Rotate 90 degrees around Y-axis
        { size: [185 * 2, 70, 1], position: [-296+ 364, -30, -70+ 226], rotation: [0, 122.1, 0] },
        { size: [50* 2, 70, 1], position: [-203+ 364, -30, 136+ 226], rotation: [0, -96.1, 0] },
        { size: [41* 2, 70, 1], position: [-188+ 364, -30, 132+ 226], rotation: [0, -96.1, 0] },
        { size: [82* 2, 70, 1], position: [-111+ 364, -30, 182+ 226], rotation: [0, -6.7, 0] },
        { size: [78* 2, 70, 1], position: [-130+ 364, -30, 195+ 226], rotation: [0, -6.7, 0] },
        { size: [179* 2, 70, 1], position: [-55+ 364, -30, 367+ 226], rotation: [0, -96.1, 0] },
        { size: [179* 2, 70, 1], position: [-72+ 364, -30, 382+ 226], rotation: [0, -96.3, 0] },
        { size: [230* 2, 70, 1], position: [127+ 364, -30, 581+ 226], rotation: [0, -6.1, 0] },
        { size: [202* 2, 70, 1], position: [126+ 364, -30, 565+ 226], rotation: [0, -6.1, 0] },
        { size: [466* 2, 70, 1], position: [398+ 364, -30, 150+ 226], rotation: [0, 83.4, 0] },
        { size: [459* 2, 70, 1], position: [380+ 364, -30, 128+ 226], rotation: [0, 83.4, 0] },
        { size: [151* 2, 70, 1], position: [352+ 364, -30, -456+ 226], rotation: [0, 121.5, 0] },
        { size: [200* 2, 70, 1], position: [363+ 364, -30, -456+ 226], rotation: [0, 121.5, 0] },
    ];

    // const customBoxes = [
    // { size: [395.63, 13.68, 1], position: [-380 / 2, 20, -210 / 2], rotation: [0, 31.5, 0] },    // Example: box with size [width, height, depth] at position
    // { size: [20, 3, 10], position: [15, -2, -5] }, // Another custom box
    // { size: [5, 0.5, 15], position: [-10, -1, 10] },
    // ];

    useEffect(() => {
        const gltfLoader = new GLTFLoader();
        const objLoader = new OBJLoader();

        // Load the city GLB model
        gltfLoader.load(
            "../assets/localassets/vanderbilt.glb",
            (gltf) => {
                gltf.scene.position.set(384,-30,226)
                setCityObj(gltf.scene);
            },
            undefined,
            (error) => console.error("GLB Load Error:", error)
        );

        // Load the terrain OBJ model
        objLoader.load(
            "../assets/localassets/terrain.obj",
            (object) => {
                let terrainMesh = null;
                object.traverse((child) => {
                    if (child.isMesh) {
                        terrainMesh = child;
                    }
                });

                if (terrainMesh) {
                    // Compute bounding box for physics
                    const bbox = new THREE.Box3().setFromObject(terrainMesh);
                    setBoundingBox(bbox);

                    // Get terrain rotation (assuming it's already rotated)
                    const euler = new THREE.Euler();
                    terrainMesh.matrix.decompose(new THREE.Vector3(), euler, new THREE.Vector3());
                    setRotation([euler.x, euler.y, euler.z]);

                    // Hide the terrain visually
                    terrainMesh.visible = false;
                    setTerrainMesh(terrainMesh);
                }
            },
            undefined,
            (error) => console.error("OBJ Load Error:", error)
        );
    }, []);

    if (!cityObj || !boundingBox) return null;

    return (
        <group>
            {/* Render the city visually */}
            <primitive object={cityObj} />

            {/* Render custom collision boxes */}
            {customBoxes.map((box, index) => (
                <InvisibleBox key={index} size={box.size} position={box.position} rotation={box.rotation} />
            ))}

            {/* Hide the terrain but use it for calculations */}
            {/*{terrainMesh && <primitive object={terrainMesh} />}*/}
            <CityFloor />

            {/* Add a rotated bounding box collider */}
            {/*<BoundingBoxCollider bbox={boundingBox} rotation={rotation} />*/}
        </group>
    );
}

// Creates a rotated bounding box for the terrain
function BoundingBoxCollider({ bbox, rotation }) {
    const size = [
        bbox.max.x - bbox.min.x,  // Width
        bbox.max.y - bbox.min.y,  // Height
        bbox.max.z - bbox.min.z,  // Depth
    ];

    const position = [
        (bbox.max.x + bbox.min.x+ 600) / 2 ,
        (bbox.max.y + bbox.min.y) / 2 - 30,  // Adjust height lower
        (bbox.max.z + bbox.min.z+ 226) / 2 ,
    ];

    useBox(() => ({
        args: size,
        position,
        rotation,  // Apply rotation so it's not flat
        type: "Static",
    }));

    return null;
}

function InvisibleBox({ size, position, visible, rotation }) {
    // Convert degrees to radians
    const radians = rotation.map(degree => degree * (Math.PI / 180));

    useBox(() => ({
        args: size,
        position,
        rotation: radians, // Apply rotation in radians
        type: "Static", // Ensures the box doesn't move
    }));

    if (!visible) return null; // Don't render anything if not visible

    return (
        <mesh position={position} rotation={radians}>
            <boxGeometry args={size} />
            <meshStandardMaterial color="red" /> {/* Solid box for debugging */}
        </mesh>
    );
}

// Adds a large static floor for the city
function CityFloor() {
    const boxMaterial = {
        restitution: 0, // High bounciness
    };

    const [floorRef] = usePlane(() => ({
        position: [0, -20, 0],
        material: boxMaterial,
        rotation:[  1.5127371+ Math.PI,  -2.3244867 + Math.PI, -0.0423494  + Math.PI],
        // rotation: [-0.0423 - Math.PI, -2.324,  1.512], -04235/(Math.PI) -2.3244867 + (Math.PI * 2)
        type: "Static",
    }));

    return (
        <mesh ref={floorRef}>
             <planeGeometry args={[10, 10]} />
             {/*<meshStandardMaterial color="gray" />*/}
         </mesh>
    );
}

