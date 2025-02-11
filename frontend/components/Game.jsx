import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';
import { onPlayerJoin, insertCoin } from 'playroomkit';
import { useEffect, useState, useRef } from 'react';

import City from "../components/City.jsx";
import Car from "../components/Car.jsx";

function Game() {
    const [players, setPlayers] = useState([]);

    insertCoin({
        skipLobby: true
    });

    useEffect(() => {
        onPlayerJoin((state) => {

            setPlayers((prev) => {
                if (prev.some((p) => p.state.id === state.id)) return prev; // don't add if player already joined
                return [...prev, { state }];
            });
            state.onQuit(() => {
                setPlayers((prev) => prev.filter((p) => p.state.id !== state.id));
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
                    {(players || []).map(({ state, controls }) => (
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
