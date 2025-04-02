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
        //walls
        // For debugging, add "highlight: true" to any mesh to make it red so you can find it in the game.
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
        { size: [445* 2, 70, 1], position: [380+ 364, -30, 128+ 226], rotation: [0, 83.4, 0] },
        { size: [7* 2, 70, 1], position: [380+ 413, -30, 128+ -222], rotation: [0, 105.4, 0]},
        { size: [151* 2, 70, 1], position: [352+ 360, -30, -456+ 226], rotation: [0, 121.5, 0]},
        { size: [200* 2, 70, 1], position: [363+ 368, -30, -456+ 226], rotation: [0, 121.5, 0]},

        //floors
        // For debugging, add "highlight: true" to any mesh to make it red so you can find it in the game.
        { size: [320,1,25], position: [-260+ 364, -32, -30+ 226], rotation: [-1.9, 121.1, 0]}, 
        { size: [20,1,15], position: [-188+ 359, -27.8, 92+ 226], rotation: [0, 100.1, -3.4]}, 
        { size: [90,1,25], position: [-195+ 364, -29, 145+ 226], rotation: [1.5, -96.1, 0]}, 
        { size: [132,1,25], position: [-121+ 364, -28.5, 183+ 226], rotation: [0, -6.7, 1.2]},
        { size: [23,1,25], position: [-45+ 364, -27, 192+ 226], rotation: [0, -6.7, 0]}, 
        { size: [80,1,25], position: [-50.5+ 364, -26.3, 278+ 190], rotation: [-1.05, -96.1, 0]},  
        { size: [80,1,25], position: [-50.5+ 355, -26, 278+ 265], rotation: [1, -96.1, 0]},
        { size: [80,1,25], position: [-61.5+ 364, -28.5, 390+ 226], rotation: [2.8, -96.1, 0]},
        { size: [80,1,25], position: [-70.5+ 364, -29.7, 462+ 226], rotation: [-1.4, -96.1, 0]},
        { size: [60,1,25], position: [-80.5+ 364, -28, 531+ 226], rotation: [-1.5, -96.1, 0]},
        { size: [175,1,25], position: [-80.5+ 458, -27.5, 531+ 262], rotation: [0, -6.5, 0]}, 
        { size: [175,1,25], position: [-80.5+ 545, -26.5, 531+ 265], rotation: [0, -6.5, 1.2]}, 
        { size: [150,1,25], position: [-80.5+ 695, -21.5, 531+ 280], rotation: [0, -6.5, 2.5]},
        { size: [240,1,25], position: [-80.5+ 798, -21.4, 531+ 125], rotation: [0, -96.1, 1.8]},
        { size: [50,1,25], position: [-80.5+ 780, -18.1, 531+ 275], rotation: [0, -96.1, -0.8]},
        { size: [50,1,25], position: [-80.5+ 787, -18.1, 531+ 226], rotation: [0, -96.1, 1]},
        { size: [250,1,25], position: [-80.5+ 830, -29.5, 531+ -115], rotation: [0, -96.5, 2]}, 
        { size: [150,1,25], position: [-80.5+ 850, -35, 531+ -310], rotation: [0, -96.5, 1]},
        { size: [150,1,25], position: [-80.5+ 870, -37.9, 531+ -458], rotation: [0, -96.5, 1.25]}, 
        { size: [100,1,25], position: [-80.5+ 878, -40.9, 531+ -580], rotation: [0, -96.5, 1.7]}, 
        { size: [100,1,25], position: [-80.5+ 878, -40.9, 531+ -580], rotation: [0, -96.5, 1.7]},
        { size: [100,1,25], position: [-80.5+ 870, -41.9, 531+ -650], rotation: [0, -58, 0]},
        { size: [100,1,25], position: [-80.5+ 820, -40.8, 531+ -730], rotation: [0, -58, -1.2]},
        { size: [100,1,25], position: [-80.5+ 768, -41.2, 531+ -816], rotation: [0, -58, 1.7]},
        { size: [100,1,25], position: [-80.5+ 720, -43.5, 531+ -900], rotation: [0, -58, 1]}, 
        { size: [200,1,40], position: [-80.5+ 625, -38.5, 531+ -845], rotation: [0, 30, -3.1]}, 
        { size: [205,1,40], position: [-80.5+ 450, -33.6, 531+ -745], rotation: [0, 30, 0.35]}, 
        { size: [200,1,40], position: [-80.5+ 275, -35.2, 531+ -645], rotation: [0.3, 31, 0.4]},
        { size: [200,1,40], position: [-80.5+ 115, -37, 531+ -540], rotation: [1, 31, 0]}, 
        { size: [50,1,25], position: [-80.5+ 95, -36.9, 531+ -480], rotation: [-2.3, -60, 0]},

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

    let isVisible = true
    return (
        <group>
            {/* Render the city visually */}
            <primitive object={cityObj} />

            {/* Render custom collision boxes */}
            {customBoxes.map((box, index) => (
                <InvisibleBox key={index} size={box.size} visible = {isVisible} position={box.position} rotation={box.rotation} highlight={box.highlight} />
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

function InvisibleBox({ size, position, visible, rotation, highlight }) {
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
            <meshStandardMaterial color={highlight ? "red" : "gray"} /> Solid box for debugging
        </mesh>
    );
}

// Adds a large static floor for the city
function CityFloor() {
    const boxMaterial = {
        restitution: 0, // High bounciness
    };

    const [floorRef] = usePlane(() => ({
        position: [0, -50, 0],
        material: boxMaterial,
        rotation:[-Math.PI/2, 0,0],
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

