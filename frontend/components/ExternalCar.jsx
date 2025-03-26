import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Chassis } from "./Chassis";
import { Wheel } from "./Wheel";

export default function ExternalCar({ playerId, players, carId }) {
    const carRef = useRef(null);

    useEffect(() => {
        const playerData = players.find((p) => p.id === playerId);
    
        if (carRef.current && playerData) {
            if (playerData.position) {
                carRef.current.position.set(...playerData.position);
            }
    
            if (playerData.quaternion) {
                const carQuaternion = new THREE.Quaternion(...playerData.quaternion);
                carRef.current.rotation.setFromQuaternion(carQuaternion);
            }
        }
    }, [players]);
    

    return (
        <group ref={carRef}>
            <Chassis carId={carId} />
        </group>
    );
}
