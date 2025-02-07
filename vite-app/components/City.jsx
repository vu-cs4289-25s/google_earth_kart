import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

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
            (error) => console.error(error)
        );
    }, []);

    if (!cityObj) return null;

    return (
        <group>
            {/* Physics collisions for each mesh */}
            {cityObj.children.map((child, index) =>
                child.isMesh ? (
                    <CityCollisionBox key={index} mesh={child} />
                ) : null
            )}

            {/* Render the visual city model */}
            <primitive object={cityObj} />

            {/* Add a static floor */}
            <CityFloor />
        </group>
    );
}

// Creates physics-based collision boxes for each building mesh
function CityCollisionBox({ mesh }) {
    const oldbbox = mesh.geometry.boundingBox;
    let bbox = mesh.geometry.boundingBox;
    // const change = 1;
    // bbox.max.x = oldbbox.max.x - change;
    // bbox.max.y = oldbbox.max.y - change;
    // bbox.max.z = oldbbox.max.z - change;
    //
    // bbox.min.x = oldbbox.min.x + change;
    // bbox.min.y = oldbbox.min.y + change;
    // bbox.min.z = oldbbox.min.z + change;

    if (!bbox) return null;

    const size = [
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y,
        bbox.max.z - bbox.min.z,
    ];
    const position = [
        (bbox.max.x + bbox.min.x) / 2,
        (bbox.max.y + bbox.min.y) / 2,
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
