import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

import { Chassis } from "./Chassis";
import { useControls } from "../controls/keyboard-controls.js";
import { Wheel } from "./Wheel";

import accelMP3 from "../assets/acceleration.mp3"; 
import brakeMP3 from "../assets/brake.mp3";

const bias = 0.003;


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


    const carWidth = carId === "model3" ? 1.5
                    : carId === "cybertruck" ? 0.9
                    : carId === "mcqueen" ? 1.1
                    : carId === "sienna" ? 1.2 
                    : width;
    const carHeight = carId === "model3" ? -0.2
                    : carId === "cybertruck" ? 0.1 
                    : height;

    let wheelOffsetX = carWidth / 2;
    if (["mario-kart", "cybertruck", "sienna", "mcqueen"].includes(carId)) {
        wheelOffsetX += 0.1;
    }

    const wheelsHidden = {
        frontLeft: false,
        frontRight: false,
        rearLeft: false,
        rearRight: false,
    };

    if (carId === "mario-kart") {
        wheelsHidden.frontLeft = true;
        wheelsHidden.frontRight = true;
        wheelsHidden.rearLeft = true;
        wheelsHidden.rearRight = true;
    } else if (carId === "mcqueen") {
        wheelsHidden.rearLeft = true;
        wheelsHidden.rearRight = true;
    } 
    // else if (carId === "cybertruck") {
    //     wheelsHidden.frontRight = true;
    //     wheelsHidden.rearLeft = true;
    //     wheelsHidden.rearRight = true;
    // }

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
        chassisConnectionPointLocal: [-wheelOffsetX, carHeight, front],
        isFrontWheel: true,
    };
    const wheelInfo2 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [wheelOffsetX, carHeight, front],
        isFrontWheel: true,
    };
    const wheelInfo3 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [-wheelOffsetX, carHeight, back],
        isFrontWheel: false,
    };
    const wheelInfo4 = {
        ...wheelInfo,
        chassisConnectionPointLocal: [wheelOffsetX, carHeight, back],
        isFrontWheel: false,
    };

    const chassisArgs = carId === "model3" ? [1.8, 1.1, 4.2]
                      : carId === "cybertruck" ? [2.0, 1.0, 5.0]
                      : carId === "mcqueen" ? [1.8, 0.9, 4.5]
                      : carId === "sienna" ? [1.9, 1.2, 4.8]
                      : [1.7, 1, 4];

    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            angularVelocity: angularVelocity ?? [0, 0, 0],
            args: chassisArgs,
            mass: 500,
            // onCollide: () => console.log("bonk"),
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

    // Create audio elements for acceleration and braking sounds.
    const accelSound = useRef(new Audio(accelMP3));
    const brakeSound = useRef(new Audio(brakeMP3));

    // Configure the audio elements on mount.
    useEffect(() => {
        accelSound.current.loop = true;
        accelSound.current.volume = 1;
        brakeSound.current.loop = true;
        brakeSound.current.volume = 1;
    }, []);

    useEffect(() => {
        if (chassisBody.current) {
          chassisBody.current.userData = {
            playerId: id,
            username: socket?.username,
          };
        }
      }, [chassisBody, id, socket]);
      

    useFrame(() => {
        if (allowMove) {
            const { backward, brake, forward, left, reset, right} =
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
                const steerDirection =
                    left || right ? steer * (left && !right ? 1 : -1) : 0;

                // Add tiny rightward bias
                vehicleApi.setSteeringValue(steerDirection - bias, s);
            }

            for (let b = 2; b < 4; b++) {
                vehicleApi.setBrake(brake ? maxBrake : 0, b);
            }

            if (reset) {
                chassisApi.position.set(...position);
                chassisApi.velocity.set(0, 0, 0);
                chassisApi.angularVelocity.set(0, 0, 0);
                chassisApi.rotation.set(0, 0, 0);
                chassisApi.quaternion.set(0, 0, 0,1);
            }

            // Sound logic
            if (forward || backward) {
                // If accelerating or decelerating, play acceleration sound.
                if (accelSound.current.paused) {
                    accelSound.current.play().catch((err) =>
                        console.warn("Acceleration sound play error:", err)
                    );
                }
                // Ensure brake sound is stopped.
                if (!brakeSound.current.paused) {
                    brakeSound.current.pause();
                    brakeSound.current.currentTime = 0;
                }
            } else if (brake) {
                // When braking, play braking sound.
                if (brakeSound.current.paused) {
                    brakeSound.current.play().catch((err) =>
                        console.warn("Brake sound play error:", err)
                    );
                }
                // Stop acceleration sound.
                if (!accelSound.current.paused) {
                    accelSound.current.pause();
                    accelSound.current.currentTime = 0;
                }
            } else {
                // No input – stop both sounds.
                if (!accelSound.current.paused) {
                    accelSound.current.pause();
                    accelSound.current.currentTime = 0;
                }
                if (!brakeSound.current.paused) {
                    brakeSound.current.pause();
                    brakeSound.current.currentTime = 0;
                }
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
            // const offset = new THREE.Vector3(50, 1000, -5);
            const offset = new THREE.Vector3(0, 3, -12);
            offset.applyQuaternion(carQuaternion);

            const targetPosition = carPosition.clone().add(offset);

            // Smooth movement and rotation
            camera.position.lerp(targetPosition, 1);
            camera.quaternion.slerp(carQuaternion, 1);
            camera.lookAt(carPosition);

            // Emit movement if the car has moved more than 0.1 meter
            if (lastPosition.current.distanceTo(carPosition) > 0.1) {
                // console.log("Position: ", carPosition.toArray()); // For dev purposes
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
                lastPosition.current.copy(carPosition);
            }
        }
    });

    return (
        <group ref={vehicle} position={position}>
            <Chassis ref={chassisBody} carId={carId} />
            <Wheel ref={wheels[0]} radius={radius} leftSide hidden={wheelsHidden.frontLeft} />
            <Wheel ref={wheels[1]} radius={radius} hidden={wheelsHidden.frontRight} />
            <Wheel ref={wheels[2]} radius={radius} leftSide hidden={wheelsHidden.rearLeft} />
            <Wheel ref={wheels[3]} radius={radius} hidden={wheelsHidden.rearRight} />
        </group>
    );
});

export default Car;
