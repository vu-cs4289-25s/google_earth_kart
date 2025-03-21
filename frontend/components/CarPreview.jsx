import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Chassis } from "./Chassis";

const CarPreview = ({ carId = 'kia-soul' }) => {
    return (
        <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
                <Chassis carId={carId} />
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