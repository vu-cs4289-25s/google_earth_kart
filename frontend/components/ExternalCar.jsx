import { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Chassis } from "./Chassis";
import { Wheel } from "./Wheel";
import { Text } from "@react-three/drei";

export default function ExternalCar({ playerId, players, carId }) {
    const carRef = useRef(null);
    const textRef = useRef(null);
    const [playerName, setPlayerName] = useState("");
    const { camera } = useThree();

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
            if (playerData.username) {
                setPlayerName(playerData.username);
            }
        }
    }, [players, playerId]);

    useFrame(() => {
        if (textRef.current) {
            textRef.current.lookAt(camera.position);
        }
    });

    return (
        <group ref={carRef}>
            <Chassis carId={carId} />
            {playerName && (
                <Text
                    ref={textRef}
                    position={[0, 2, 0]} 
                    fontSize={1}
                    color="white" 
                    anchorX="center"
                    anchorY="middle"
                >
                    {playerName}
                </Text>
            )}
        </group>
    );
}
