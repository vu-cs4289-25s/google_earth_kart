import {useState, useEffect, useRef} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Chassis } from "./Chassis";
import { Wheel } from "./Wheel";

export default function ExternalCar({ playerId, players }) {
    const carRef = useRef(null);


    useEffect(() => {
        const playerData = players.find(p => p.id === playerId);

        if (carRef.current && playerData) {
            carRef.current.position.set(...playerData.position);
            const carQuaternion = new THREE.Quaternion(playerData.quaternion? playerData.quaternion[0] : 0, playerData.quaternion? playerData.quaternion[1] : 0, playerData.quaternion? playerData.quaternion[2] : 0, playerData.quaternion? playerData.quaternion[3] : 0);
            carRef.current.rotation.setFromQuaternion(carQuaternion);
        }
    }, [players]);

    return (
        <group ref={carRef}>
            <Chassis />
        </group>
    );
}
