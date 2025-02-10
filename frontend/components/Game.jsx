import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';



import City from "../components/City.jsx";
import Car from "../components/Car.jsx";

function Game() {
    return (
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics>
                {/*<Debug color="black" >*/}
                    <City/>
                    <Car/>
                {/*</Debug>*/}
            </Physics>
            <Stats />
        </Canvas>
    )
}

export default Game
