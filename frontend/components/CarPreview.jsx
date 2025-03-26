import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    ContactShadows,
    AccumulativeShadows,
    RandomizedLight,
} from "@react-three/drei";
import { Chassis } from "./Chassis";

const CarPreview = ({ carId = "kia-soul" }) => {
    return (
        <Canvas camera={{ position: [0, 1.5, 6], fov: 35 }}>
            {/* Base ambient light - not too bright to allow for contrast */}
            <ambientLight intensity={0.3} />

            {/* Key light - main illumination from front-right */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.4}
                color="#ffffff"
            />

            {/* Fill light - softer light from left side to fill shadows */}
            <directionalLight
                position={[-5, 3, 0]}
                intensity={1.2}
                color="#b0c4de"
            />

            {/* Rim light - from behind to create highlights on edges */}
            <spotLight
                position={[-5, 8, -5]}
                intensity={1.2}
                color="#ffffff"
                angle={0.5}
                penumbra={1}
            />

            {/* Hair light - top light to highlight the top edges */}
            <spotLight
                position={[0, 10, 0]}
                intensity={0.8}
                color="#faf0e6"
                angle={0.7}
                penumbra={0.5}
            />

            {/* Ground reflection light */}
            <directionalLight
                position={[0, -3, 0]}
                intensity={0.5}
                color="#f0f0f0"
            />

            <Suspense fallback={null}>
                <Chassis carId={carId} />
                <Environment preset="sunset" background={false} />
                <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={1.5}
                    far={0.8}
                />
                {/* <AccumulativeShadows 
                temporal 
                frames={24} 
                alphaTest={0.9} 
                opacity={0.8} 
                scale={12} 
                position={[0, -0.5, 0]}
                > */}
                <RandomizedLight
                    amount={2}
                    radius={10}
                    intensity={0.4}
                    ambient={0.5}
                    position={[5, 5, -5]}
                />
                {/* </AccumulativeShadows> */}
            </Suspense>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                autoRotate
                autoRotateSpeed={4}
            />
        </Canvas>
    );
};

export default CarPreview;
