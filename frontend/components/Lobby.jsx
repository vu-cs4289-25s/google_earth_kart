import { insertCoin, myPlayer, usePlayersList, usePlayerState, isHost } from 'playroomkit';
import { useEffect, useRef, useState } from 'react';
import app from '../src/main';
import Game from './Game';
import Car from './Car';

function Lobby(){
  // Hook that returns an array of players in the room.
  const players = usePlayersList();

  // We render all players and a joystick for current player.
  return (
    <div>
    Lobby!
    </div>
  );
}

export function Player({player}){
  // Playroom hooks to get and set a player's state.
  // Setting state here will automatically sync value 
  // with other players.
  const [pos, setPos] = usePlayerState(player, "position", {x: 0, y: 0});
  const [dir] = usePlayerState(player, "dir")
  const bodyRef = useRef(null);

  useState(()=>{
    // One player acts as a host, host checks the joystick state for
    // each player, applies forces to the player and updates their pos.
    if (!isHost() || !dir) return;
    if (dir.x === "left"){
      bodyRef.current.applyForce({x: -100, z: 0});
    }
    if (dir.x === "right"){
      bodyRef.current.applyForce({x: 100, z: 0});
    }
    if (dir.z === "forward"){
      bodyRef.current.applyForce({x: 0, z: -100});
    }
    if (dir.z === "back"){
      bodyRef.current.applyForce({x: 0, z: -100});
    }
  }, [dir]);

  return (
    <Car/>
  )
}

// This loads in the playroom lobby UI. To skip this we put in "skipLobby: true" into insertCoin().
// However this means we have to create our own button which will render the game.
insertCoin().then(()=>{
    app.render(
        <Game />,
      )
})

export default Lobby;