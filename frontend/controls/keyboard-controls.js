export function handleKeyDown(vehicle, event) {
    const maxSteerVal = Math.PI / 8;
    const maxForce = 13;

    switch (event.key) {
        case "w":
        case "ArrowUp":
            vehicle.setWheelForce(maxForce, 0);
            vehicle.setWheelForce(maxForce, 2);
            break;

        case "s":
        case "ArrowDown":
            vehicle.setWheelForce(-maxForce / 2, 0);
            vehicle.setWheelForce(-maxForce / 2, 2);
            break;

        case "a":
        case "ArrowLeft":
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 2);
            break;

        case "d":
        case "ArrowRight":
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 2);
            break;
    }
}

export function handleKeyUp(vehicle, event) {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 2);
            break;

        case "s":
        case "ArrowDown":
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 2);
            break;

        case "a":
        case "ArrowLeft":
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 2);
            break;

        case "d":
        case "ArrowRight":
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 2);
            break;
    }
}
