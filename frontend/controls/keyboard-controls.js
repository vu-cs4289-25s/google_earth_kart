import {keyCodes} from "../utils/keycodes"
import * as THREE from 'three';

export class KeyboardControls {

    constructor(player, camera) {
        this.upKey = "w";
        this.downKey = "s";
        this.leftKey = "a";
        this.rightKey = "d";
        this.flyKey = "space";
        this.sinkKey = "shift"
        
        this.player = player;
        this.camera = camera;
        this.moveSpeed = 0.25;
        this.rotationSpeed = 0.1;
        this.flySpeed = 0.1

        this.keysPressed = {
            up: false,
            down: false,
            left: false,
            right: false,
            fly: false,
            sink: false
        };

        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }

    onKeyDown(event) {
        const keyCode = event.which;

        if (keyCode === keyCodes[this.upKey]) this.keysPressed.up = true;
        else if (keyCode === keyCodes[this.downKey]) this.keysPressed.down = true;
        else if (keyCode === keyCodes[this.leftKey]) this.keysPressed.left = true;
        else if (keyCode === keyCodes[this.rightKey]) this.keysPressed.right = true;
        else if (keyCode === keyCodes[this.flyKey]) this.keysPressed.fly = true;
        else if (keyCode === keyCodes[this.sinkKey]) this.keysPressed.sink = true;
    }

    onKeyUp(event) {
        const keyCode = event.which;

        if (keyCode === keyCodes[this.upKey]) this.keysPressed.up = false;
        else if (keyCode === keyCodes[this.downKey]) this.keysPressed.down = false;
        else if (keyCode === keyCodes[this.leftKey]) this.keysPressed.left = false;
        else if (keyCode === keyCodes[this.rightKey]) this.keysPressed.right = false;
        else if (keyCode === keyCodes[this.flyKey]) this.keysPressed.fly = false;
        else if (keyCode === keyCodes[this.sinkKey]) this.keysPressed.sink = false;
    }

    update() {
        if (this.keysPressed.up) {
            const forward = new THREE.Vector3(0, 0, -1)
                .applyQuaternion(this.player.quaternion)
                .normalize();

            this.player.position.add(forward.multiplyScalar(this.moveSpeed));
        }

        if (this.keysPressed.down) {
            const backward = new THREE.Vector3(0, 0, 1)
                .applyQuaternion(this.player.quaternion) 
                .normalize();

            this.player.position.add(backward.multiplyScalar(this.moveSpeed));
        }

        if (this.keysPressed.left) {
            this.player.rotation.y += this.rotationSpeed; 
        }

        if (this.keysPressed.right) {
            this.player.rotation.y -= this.rotationSpeed; 
        }

        if (this.keysPressed.fly) {
            this.player.position.y += this.flySpeed; 
        }

        if (this.keysPressed.sink) {
            this.player.position.y -= this.flySpeed;
        }

        this.updateCameraPosition();
    }

    updateCameraPosition() {
        const distance = 5;
        const height = 2;   
    
        const backward = new THREE.Vector3(0, 0, 1)
            .applyQuaternion(this.player.quaternion) 
            .normalize();
    
        const cameraPosition = this.player.position.clone()
            .add(backward.multiplyScalar(distance))
            .add(new THREE.Vector3(0, height, 0)); 
    
        this.camera.position.copy(cameraPosition);
    
        this.camera.lookAt(this.player.position);
    }
}
