import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

import { Chassis } from "./Chassis";
import { useControls } from "../controls/keyboard-controls.js";
import { Wheel } from "./Wheel";

const Car = forwardRef(function Car(
    {
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
        id,
        socket,
        allowMove,
        carId = "kia-soul",
    },
    ref,
) {
    const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const controls = useControls();
    const lastPosition = useRef(new THREE.Vector3());

    const carWidth = carId === "model3" ? 1.5 : width;
    const carHeight = carId === "model3" ? -0.2 : height;

    const wheelInfo = {
        axleLocal: [-1, 0, 0],
        customSlidingRotationalSpeed: -30,
        dampingCompression: 4.4,
        dampingRelaxation: 10,
        directionLocal: [0, -1, 0],
        frictionSlip: 2,
        maxSuspensionForce: 1e4,
        maxSuspensionTravel: 0.3,
        radius,
        suspensionRestLength: 0.3,
        suspensionStiffness: 30,
        useCustomSlidingRotationalSpeed: true,
    };

    const wheelInfo1 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [-carWidth / 2, carHeight, front],
        isFrontWheel: true,
    };
    const wheelInfo2 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [carWidth / 2, carHeight, front],
        isFrontWheel: true,
    };
    const wheelInfo3 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [-carWidth / 2, carHeight, back],
        isFrontWheel: false,
    };
    const wheelInfo4 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [carWidth / 2, carHeight, back],
        isFrontWheel: false,
    };

    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            angularVelocity,
            args: carId === "model3" ? [1.8, 1.1, 4.2] : [1.7, 1, 4],
            mass: 500,
            onCollide: () => console.log("bonk"),
            position,
            rotation,
        }),
        useRef(null),
    );

    // Expose the chassis's physics body to parent components.
    useImperativeHandle(ref, () => chassisBody.current);

    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
            wheels,
        }),
        useRef(null),
    );

    const { camera } = useThree();

    useFrame(() => {
        if (allowMove) {
            const { backward, brake, forward, left, reset, right } =
                controls.current;

            for (let e = 2; e < 4; e++) {
                vehicleApi.applyEngineForce(
                    forward || backward
                        ? force * (forward && !backward ? -1 : 1)
                        : 0,
                    2,
                );
            }

            for (let s = 0; s < 2; s++) {
                vehicleApi.setSteeringValue(
                    left || right ? steer * (left && !right ? 1 : -1) : 0,
                    s,
                );
            }

            for (let b = 2; b < 4; b++) {
                vehicleApi.setBrake(brake ? maxBrake : 0, b);
            }

            if (reset) {
                chassisApi.position.set(...position);
                chassisApi.velocity.set(0, 0, 0);
                chassisApi.angularVelocity.set(...angularVelocity);
                chassisApi.rotation.set(...rotation);
            }
        }

        // Camera follows and rotates with the car
        if (chassisBody.current) {
            const carPosition = chassisBody.current.getWorldPosition(
                new THREE.Vector3(),
            );
            const carQuaternion = chassisBody.current.getWorldQuaternion(
                new THREE.Quaternion(),
            );

            // Define the camera's offset relative to the car
            // const offset = new THREE.Vector3(0, 200, -5);
            const offset = new THREE.Vector3(0, 3, -12);
            offset.applyQuaternion(carQuaternion);

            const targetPosition = carPosition.clone().add(offset);

            // Smooth movement and rotation
            camera.position.lerp(targetPosition, 0.1);
            camera.quaternion.slerp(carQuaternion, 0.1);
            camera.lookAt(carPosition);

            // Emit movement if the car has moved more than 1 meter
            if (lastPosition.current.distanceTo(carPosition) > 0.1) {
                socket.emit("player moves", {
                    playerid: id,
                    position: carPosition.toArray(),
                    quaternion: [
                        carQuaternion.x,
                        carQuaternion.y,
                        carQuaternion.z,
                        carQuaternion.w,
                    ],
                });
                console.log(carPosition)
                lastPosition.current.copy(carPosition);
            }
        }
    });

    return (
        <group ref={vehicle} position={position}>
            <Chassis ref={chassisBody} carId={carId} />
            <Wheel ref={wheels[0]} radius={radius} leftSide />
            <Wheel ref={wheels[1]} radius={radius} />
            <Wheel ref={wheels[2]} radius={radius} leftSide />
            <Wheel ref={wheels[3]} radius={radius} />
        </group>
    );
});

export default Car;
