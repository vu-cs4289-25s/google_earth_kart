import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function City() {
    const [cityGltf, setCityGltf] = useState(null);

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(
            "../assets/zeppos.gltf",
            (gltf) => {
                const cityScene = gltf.scene;
                cityScene.position.set(0, 6, 0);
                cityScene.scale.set(100, 100, 100);

                // Compute bounding boxes for physics
                cityScene.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.computeBoundingBox();
                    }
                });

                setCityGltf(cityScene);
            },
            undefined,
            (error) => console.error(error)
        );
    }, []);

    if (!cityGltf) return null;

    return (
        <group>
            {/* Create physics collision boxes for each building */}
            {cityGltf.children.map((child, index) =>
                child.isMesh ? (
                    <CityCollisionBox key={index} mesh={child} />
                ) : null
            )}

            {/* Render the city model */}
            <primitive object={cityGltf} />

            {/* Add a static floor */}
            <CityFloor />
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
        ((bbox.max.y + bbox.min.y) / 2)-1,
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
        <mesh ref={floorRef} visible={false} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}
