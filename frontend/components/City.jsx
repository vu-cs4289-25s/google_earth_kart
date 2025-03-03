import { useEffect, useState } from "react";
import { useBox, usePlane } from "@react-three/cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function City() {
    const [cityGltf, setCityGltf] = useState(null);

    useEffect(() => {
        const loader = new GLTFLoader();
        const modelPath = new URL("../assets/zeppos.gltf", import.meta.url).href;

        loader.load(
            modelPath,
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
            (error) => console.error("Error loading GLTF:", error)
        );
    }, []);

    if (!cityGltf) return null;

    return (
        <group>
            {cityGltf.children.map((child) =>
                child.isMesh ? <CityCollisionBox key={child.uuid} mesh={child} /> : null
            )}
            <primitive object={cityGltf} />
            <CityFloor />
        </group>
    );
}

// An attempt to add physics / collision, but this does not work yet
function CityCollisionBox({ mesh }) {
    mesh.geometry.computeBoundingBox();
    let bbox = mesh.geometry.boundingBox;
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

function CityFloor() {
    const [floorRef] = usePlane(() => ({
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        type: "Static",
    }));

    return (
        <mesh ref={floorRef} visible={false}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}
