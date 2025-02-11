import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { onPlayerJoin, Joystick, isHost, usePlayerState, useMultiplayerState } from "playroomkit";

import City from "../components/City.jsx";
import Car from "./CarController.jsx";

function Game() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        onPlayerJoin((state) => {
          const controls = new Joystick(state, {
            type: "angular",
            buttons: [{ id: "Respawn", label: "Spawn" }],
            keyboard: true,
          });
          const newPlayer = { state, controls };
          setPlayers((players) => [...players, newPlayer]);
          state.onQuit(() => {
            setPlayers((players) => players.filter((p) => p.state.id !== state.id));
          });
        });
      }, []);

      players.forEach(({state, joystick})=>{
        // Update player position based on joystick state
        const dpad = joystick.dpad();
        if (joystick.isPressed('left')){
          // move player left
        }
        if (joystick.isPressed('right')){
          // move player right
        }
       
        if (joystick.isPressed("forward")){
          // forward
        }
        if (joystick.isPressed("reverse")){
            // reverse
          }
      });

    return (
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics>
                <City/>
                {players.map(({ state, controls }) => (
                <CarController key={state.id} state={state} controls={controls} />
                ))}
                <RigidBody type="fixed" colliders="hull" rotation-y={Math.PI}>
                </RigidBody>
                <RigidBody
                type="fixed"
                sensor
                colliders={false}
                position-y={-5}
                name="void"
                >
                <CuboidCollider args={[20, 3, 20]} />
                </RigidBody>
            </Physics>
            <Stats />
        </Canvas>
    )
}

export default Game
