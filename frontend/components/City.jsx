import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

export default function City() {
    const [cityObj, setCityObj] = useState(null);

    useEffect(() => {
        const loader = new OBJLoader();
        loader.load(
            "../assets/small-city-buildings.obj",
            (object) => {
                object.position.set(0, -1, 0);
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.computeBoundingBox();
                    }
                });
                setCityObj(object);
            },
            undefined,
            (error) => console.error(error),
        );
    }, []);

    if (!cityObj) return null;

    return (
        <group>
            {/* Physics collisions for each mesh */}
            {cityObj.children.map((child, index) =>
                child.isMesh ? (
                    <CityCollisionBox key={index} mesh={child} />
                ) : null,
            )}

            {/* Render the visual city model */}
            <primitive object={cityObj} />

            {/* Add a static floor */}
            <CityFloor />

            <Checkpoints />
        </group>
    );
}

// Creates physics-based collision boxes for each building mesh
function CityCollisionBox({ mesh }) {
    let bbox = mesh.geometry.boundingBox;

    if (!bbox) return null;

    const size = [
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y,
        bbox.max.z - bbox.min.z,
    ];
    const position = [
        (bbox.max.x + bbox.min.x) / 2,
        (bbox.max.y + bbox.min.y) / 2 - 1,
        (bbox.max.z + bbox.min.z) / 2,
    ];

    useBox(() => ({
        args: size,
        position,
        type: "Static",
    }));

    return null;
}

// Adds a large static floor for the city
function CityFloor() {
    const [floorRef] = usePlane(() => ({
        position: [0, -0.5, 0],
        rotation: [-Math.PI / 2, 0, 0],
        type: "Static",
    }));

    return (
        <mesh ref={floorRef} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}

function Checkpoints() {
    const checkpoints = [
        { position: [0, 1, 10], rotation: [0, 3, 0] },
        { position: [0, 1, 20], rotation: [0, 3, 0] },
        { position: [0, 1, 30], rotation: [0, 3, 0] },
    ];

    return (
        <>
            {checkpoints.map((checkpoint, index) => (
                <Checkpoint
                    key={index}
                    position={checkpoint.position}
                    rotation={checkpoint.rotation}
                    id={index + 1}
                />
            ))}
        </>
    );
}

function Checkpoint({ position, rotation, id }) {
    const [ref] = usePlane(() => ({
        position,
        rotation,
        isTrigger: true, 
        //do something here when the player collides with the checkpoint (update leaderboard, etc)
        onCollide: () => {
            console.log(`Checkpoint ${id} reached!`);
        },
    }));

    //once we're done developing, set visible={false} (or we could keep them visible to guide players idk)
    //change the planeGeometry args to change the size of the planes
    return (
        <mesh ref={ref} visible={true}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial color="blue" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
    );
}
