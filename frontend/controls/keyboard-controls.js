import { keyCodes } from "../utils/keycodes";
import * as THREE from "three";

export class KeyboardControls {
    constructor(player, camera, obstacles) {
        this.upKey = "w";
        this.downKey = "s";
        this.leftKey = "a";
        this.rightKey = "d";
        this.flyKey = "space";
        this.sinkKey = "shift";

        this.player = player;
        this.camera = camera;
        this.obstacles = obstacles; // Array of obstacle meshes
        this.moveSpeed = 1;
        this.rotationSpeed = 0.1;
        this.flySpeed = 3;
        this.gravity = -9.81;
        this.velocityY = 0;

        this.keysPressed = {
            up: false,
            down: false,
            left: false,
            right: false,
            fly: false,
            sink: false,
        };

        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }

    onKeyDown(event) {
        const keyCode = event.which;

        if (keyCode === keyCodes[this.upKey]) this.keysPressed.up = true;
        else if (keyCode === keyCodes[this.downKey])
            this.keysPressed.down = true;
        else if (keyCode === keyCodes[this.leftKey])
            this.keysPressed.left = true;
        else if (keyCode === keyCodes[this.rightKey])
            this.keysPressed.right = true;
        else if (keyCode === keyCodes[this.flyKey]) this.keysPressed.fly = true;
        else if (keyCode === keyCodes[this.sinkKey])
            this.keysPressed.sink = true;
    }

    onKeyUp(event) {
        const keyCode = event.which;

        if (keyCode === keyCodes[this.upKey]) this.keysPressed.up = false;
        else if (keyCode === keyCodes[this.downKey])
            this.keysPressed.down = false;
        else if (keyCode === keyCodes[this.leftKey])
            this.keysPressed.left = false;
        else if (keyCode === keyCodes[this.rightKey])
            this.keysPressed.right = false;
        else if (keyCode === keyCodes[this.flyKey])
            this.keysPressed.fly = false;
        else if (keyCode === keyCodes[this.sinkKey])
            this.keysPressed.sink = false;
    }

    update() {
        const previousPosition = this.player.position.clone();

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

        this.calculateGravity();

        if (this.checkCollisions()) {
            this.player.position.copy(previousPosition); // Revert to previous position if collision detected
        }

        this.updateCameraPosition();
    }

    updateCameraPosition() {
        const distance = 5;
        const height = 2;

        const backward = new THREE.Vector3(0, 0, 1)
            .applyQuaternion(this.player.quaternion)
            .normalize();

        const cameraPosition = this.player.position
            .clone()
            .add(backward.multiplyScalar(distance))
            .add(new THREE.Vector3(0, height, 0));

        this.camera.position.copy(cameraPosition);

        this.camera.lookAt(this.player.position);
    }

    calculateGravity() {
        const deltaTime = 0.033; // Assuming 60 FPS

        if (this.player.position.y > 0) {
            this.velocityY += this.gravity * deltaTime;
            this.player.position.y += this.velocityY * deltaTime;

            if (this.player.position.y < 0) {
                this.player.position.y = 0;
                this.velocityY = 0;
            }
        } else {
            this.velocityY = 0;
        }

        if (this.keysPressed.fly) {
            this.velocityY = this.flySpeed;
        }
    }

    checkCollisions() {
        const playerBox = new THREE.Box3().setFromObject(this.player);

        for (const obstacle of this.obstacles) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            if (playerBox.intersectsBox(obstacleBox) && obstacle.position.y > 0) {
                console.log("Collision Detected");
                return true;
            }
        }
        return false;
    }
}