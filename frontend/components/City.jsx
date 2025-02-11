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
                child
            )}

            {/* Render the visual city model */}
            <primitive object={cityObj} />

            {/* Add a static floor */}
            <planeGeometry args={[18, 18]} />
        </group>
    );
}
