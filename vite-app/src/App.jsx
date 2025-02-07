import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'

import City from "../components/City.jsx";

function App() {
  return (
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial />
            </mesh>
            <City/>
            <Stats />
        </Canvas>
  )
}

export default App
