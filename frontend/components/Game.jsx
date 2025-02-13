import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';
import { onPlayerJoin, Joystick, usePlayersList } from 'playroomkit';
import ReactNipple from 'react-nipple';


import City from "../components/City.jsx";
import Car from "../components/Car.jsx";
import { Player } from './Lobby.jsx';

function Game() {
    let players = usePlayersList();

    // Create a joystick controller for each joining player
    onPlayerJoin((state)=>{
    // Joystick will only create UI for current player (myPlayer)
    // For others, it will only sync their state
    const joystick = new Joystick(state, {
        type: "dpad",
        keyboard: true
    });
    players.push({state, joystick});
    })
    
    return (
        <group>
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics gravity={[0, -9.8, 0]}>
                {/*<Debug color="black" >*/}
                    <City/>
                    {players.map((playerState) => (
                    <Player key={playerState.id} player={playerState} />
                    ))}
                {/*</Debug>*/}
            </Physics>
            <Stats />
        </Canvas>
        <ReactNipple
        onEnd={()=> myPlayer().setState("dir", undefined)}
        onPlain={(e, data)=> 
          myPlayer().setState("dir", data.direction)} />
        </group>
    )
}

export default Game
