import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';
import { onPlayerJoin, usePlayersList, insertCoin } from 'playroomkit';
import { useEffect, useState } from 'react';

import City from "../components/City.jsx";
import Car from "../components/Car.jsx";

function Game() {
    insertCoin({
        skipLobby: true
    });

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        console.log("Use effect");
        onPlayerJoin((state) => {
            setPlayers((prev) => [...prev, { state }]);
            console.log("Player joined");
        
            state.onQuit(() => {
                setPlayers((prev) => prev.filter((p) => p.state !== state));
            });
        });
    }, []);

    return (
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics>
                {/*<Debug color="black" >*/}
                    <City/>
                    {players.map(({ state, controls }) => (
                        <Car key={state.id} state={state} controls={controls} />
                    ))}
                    {/* <Car></Car> */}
                {/*</Debug>*/}
            </Physics>
            <Stats />
        </Canvas>
    )
}

export default Game
