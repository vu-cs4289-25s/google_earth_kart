import { useBox, useRaycastVehicle } from '@react-three/cannon'
import { useFrame, useThree} from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from "three";


import { Chassis } from './Chassis'
import { useControls } from '../controls/keyboard-controls.js'
import { Wheel } from './Wheel'

export default function Car({
        angularVelocity,
        back = -1.15,
        force = 3000,
        front = 1.3,
        height = -0.04,
        maxBrake = 50,
        position,
        radius = 0.7,
        rotation,
        steer = 0.5,
        width = 1.2,
    }) {
    const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)]

    const controls = useControls()

    const wheelInfo = {
        axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
        customSlidingRotationalSpeed: -30,
        dampingCompression: 4.4,
        dampingRelaxation: 10,
        directionLocal: [0, -1, 0], // set to same as Physics Gravity
        frictionSlip: 2,
        maxSuspensionForce: 1e4,
        maxSuspensionTravel: 0.3,
        radius,
        suspensionRestLength: 0.3,
        suspensionStiffness: 30,
        useCustomSlidingRotationalSpeed: true,
    }

    const wheelInfo1 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [-width / 2, height, front],
        isFrontWheel: true,
    }
    const wheelInfo2 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [width / 2, height, front],
        isFrontWheel: true,
    }
    const wheelInfo3 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [-width / 2, height, back],
        isFrontWheel: false,
    }
    const wheelInfo4 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [width / 2, height, back],
        isFrontWheel: false,
    }

    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            angularVelocity,
            args: [1.7, 1, 4],
            mass: 500,
            onCollide: (e) => console.log('bonk'),
            position,
            rotation,
        }),
        useRef(null),
    )

    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
            wheels,
        }),
        useRef(null),
    )

    // Camera follow setup
    const { camera } = useThree()

    useFrame(() => {
        const { backward, brake, forward, left, reset, right } = controls.current

        for (let e = 2; e < 4; e++) {
            vehicleApi.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2)
        }

        for (let s = 0; s < 2; s++) {
            vehicleApi.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s)
        }

        for (let b = 2; b < 4; b++) {
            vehicleApi.setBrake(brake ? maxBrake : 0, b)
        }

        if (reset) {
            chassisApi.position.set(...position)
            chassisApi.velocity.set(0, 0, 0)
            chassisApi.angularVelocity.set(...angularVelocity)
            chassisApi.rotation.set(...rotation)
        }

        // Camera follows and rotates with the car
        if (chassisBody.current) {
            const carPosition = chassisBody.current.getWorldPosition(new THREE.Vector3());
            const carQuaternion = chassisBody.current.getWorldQuaternion(new THREE.Quaternion());

            // Define the camera's offset relative to the car
            const offset = new THREE.Vector3(0, 3, -12);
            offset.applyQuaternion(carQuaternion); // Apply car's rotation to the offset

            const targetPosition = carPosition.clone().add(offset);

            // Smooth movement and rotation
            camera.position.lerp(targetPosition, 0.1);
            camera.quaternion.slerp(carQuaternion, 0.1); // Smoothly rotate the camera with the car

            camera.lookAt(carPosition);
        }
    })

    return (
        <group ref={vehicle} position={[0, -0.4, 0]}>
            <Chassis ref={chassisBody} />
            <Wheel ref={wheels[0]} radius={radius} leftSide />
            <Wheel ref={wheels[1]} radius={radius} />
            <Wheel ref={wheels[2]} radius={radius} leftSide />
            <Wheel ref={wheels[3]} radius={radius} />
        </group>
    )
}
