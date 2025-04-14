import { useEffect, useState, useMemo, useRef } from "react";
import { useBox, usePlane } from "@react-three/cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useSocket } from "./SocketContext";
import { useFrame } from "@react-three/fiber";

export default function City({ setLoaded }) {
    const [cityObj, setCityObj] = useState(null);
    const { socket } = useSocket();
    const customBoxes = [
        //walls
        // For debugging, add "highlight: true" to any mesh to make it red so you can find it in the game.
        { size: [420 * 2, 70, 1], position: [-30 + 364, -30, -435 + 226], rotation: [0, 31, 0] },  // Rotate 45 degrees around Y-axis
        { size: [370 * 2, 70, 1], position: [-45+ 364, -30, -393+ 226], rotation: [0, 31.1, 0] }, // Rotate 30 degrees around X-axis
        { size: [187 * 2, 70, 1], position: [-265+ 364, -30, -42+ 226], rotation: [0, 121.1, 0] }, // Rotate 90 degrees around Y-axis
        { size: [185 * 2, 70, 1], position: [-296+ 364, -30, -70+ 226], rotation: [0, 122.1, 0] },
        { size: [50* 2, 70, 1], position: [-203+ 364, -30, 136+ 226], rotation: [0, -96.1, 0] },
        { size: [41* 2, 70, 1], position: [-188+ 364, -30, 132+ 226], rotation: [0, -96.1, 0] },
        { size: [82* 2, 70, 1], position: [-111+ 364, -30, 182+ 226], rotation: [0, -6.7, 0] },
        { size: [78* 2, 70, 1], position: [-130+ 364, -30, 195+ 226], rotation: [0, -6.7, 0] },
        { size: [178* 2, 70, 1], position: [-55+ 364, -30, 367+ 226], rotation: [0, -96.1, 0] },
        { size: [179* 2, 70, 1], position: [-72+ 364, -30, 382+ 226], rotation: [0, -96.3, 0] },
        { size: [230* 2, 70, 1], position: [127+ 364, -30, 581+ 228], rotation: [0, -7.1, 0] },
        { size: [202* 2, 70, 1], position: [126+ 364, -30, 565+ 225], rotation: [0, -6.1, 0]},
        { size: [466* 2, 70, 1], position: [398+ 364, -30, 150+ 226], rotation: [0, 83.4, 0] },
        { size: [466* 2, 70, 1], position: [398+ 367, -30, 150+ 200], rotation: [0, 83.4, 0] },
        { size: [25* 2, 70, 1], position: [398+ 402, -30, 150+ -280], rotation: [0, 135.4, 0]},
        { size: [445* 2, 70, 1], position: [380+ 364, -30, 128+ 226], rotation: [0, 83.4, 0] },
        { size: [7* 2, 70, 1], position: [380+ 413, -30, 128+ -222], rotation: [0, 105.4, 0]},
        { size: [151* 2, 70, 1], position: [352+ 360, -30, -456+ 226], rotation: [0, 121.5, 0]},
        { size: [150* 2, 70, 1], position: [363+ 350, -30, -456+ 190], rotation: [0, 121.5, 0]},
        // { size: [50, 10, 0.5], position: [15, -32.5, -1.4], rotation: [0, 121.5, 0], highlight: true}, // FINISH WALL

        //floors
        // For debugging, add "highlight: true" to any mesh to make it red so you can find it in the game.
        { size: [300,1,25], position: [-260+ 364, -32, -30+ 226], rotation: [-1.9, 121.1, 0]}, 
        { size: [20,1,15], position: [-188+ 359, -27.8, 92+ 226], rotation: [0, 100.1, -3.4]}, 
        { size: [90,1,25], position: [-195+ 364, -29, 145+ 226], rotation: [1.5, -96.1, 0]}, 
        { size: [38,1,25], position: [-195+ 365, -27.95, 145+ 200], rotation: [2, -96.1, 0]}, 
        { size: [132,1,25], position: [-121+ 364, -28.5, 183+ 226], rotation: [0, -6.7, 1.2]},
        { size: [23,1,25], position: [-45+ 364, -27, 192+ 226], rotation: [0, -6.7, 0]}, 
        { size: [80,1,25], position: [-50.5+ 364, -26.3, 278+ 190], rotation: [-1.05, -96.1, 0]},  
        { size: [80,1,25], position: [-50.5+ 355, -26, 278+ 265], rotation: [1, -96.1, 0]},
        { size: [80,1,25], position: [-61.5+ 364, -28.5, 390+ 226], rotation: [2.8, -96.1, 0]},
        { size: [80,1,25], position: [-70.5+ 364, -29.7, 462+ 226], rotation: [-1.4, -96.1, 0]},
        { size: [60,1,25], position: [-80.5+ 364, -28, 531+ 226], rotation: [-1.5, -96.1, 0]},
        { size: [175,1,28], position: [-80.5+ 458, -27.5, 531+ 262], rotation: [0, -6.5, 0]}, 
        { size: [175,1,25], position: [-80.5+ 545, -26.5, 531+ 265], rotation: [0, -6.5, 1.2]}, 
        { size: [150,1,25], position: [-80.5+ 695, -21.5, 531+ 280], rotation: [0, -6.5, 2.5]},
        { size: [240,1,25], position: [-80.5+ 798, -21.4, 531+ 125], rotation: [0, -96.1, 1.8]},
        { size: [50,1,25], position: [-80.5+ 780, -18.1, 531+ 275], rotation: [0, -96.1, -0.8]},
        { size: [50,1,25], position: [-80.5+ 787, -18.1, 531+ 226], rotation: [0, -96.1, 1]},
        { size: [250,1,25], position: [-80.5+ 830, -29.5, 531+ -115], rotation: [0, -96.5, 2]}, 
        { size: [150,1,25], position: [-80.5+ 850, -35, 531+ -310], rotation: [0, -96.5, 1]},
        { size: [150,1,25], position: [-80.5+ 870, -37.9, 531+ -458], rotation: [0, -96.5, 1.25]}, 
        { size: [100,1,25], position: [-80.5+ 878, -40.9, 531+ -580], rotation: [0, -96.5, 1.7]}, 
        { size: [100,1,25], position: [-80.5+ 878, -40.9, 531+ -580], rotation: [0, -96.5, 1.7]},
        { size: [50,1,15], position: [-80.5+ 885, -41.9, 531+ -650], rotation: [0, -58, 0]},
        { size: [100,1,25], position: [-80.5+ 870, -41.9, 531+ -650], rotation: [0, -58, 0]},
        { size: [100,1,25], position: [-80.5+ 820, -40.8, 531+ -730], rotation: [0, -58, -1.2]},
        { size: [100,1,25], position: [-80.5+ 768, -41.2, 531+ -816], rotation: [0, -58, 1.7]},
        { size: [100,1,25], position: [-80.5+ 720, -43.5, 531+ -900], rotation: [0, -58, 1]}, 
        { size: [200,1,40], position: [-80.5+ 625, -38.5, 531+ -845], rotation: [0, 30, -3.1]}, 
        { size: [205,1,40], position: [-80.5+ 450, -33.6, 531+ -745], rotation: [0, 30, 0.35]}, 
        { size: [200,1,40], position: [-80.5+ 275, -35.2, 531+ -645], rotation: [0.3, 31, 0.4]},
        { size: [40,1,40], position: [-80.5+ 190, -36.5, 531 + -580], rotation: [0.5, 32, 1.8]}, 
        { size: [200,1,40], position: [-80.5+ 115, -37, 531+ -540], rotation: [0, 30, 0]}, 
        { size: [50,1,25], position: [-80.5+ 95, -36.9, 531+ -480], rotation: [-1, -60, 0]},
        { size: [50,1,5], position: [-80.5+ 110, -36.9, 531+ -540], rotation: [0, -60, 0], highlight: true}, // FINISH LINE

    ];

    useEffect(() => {
        const gltfLoader = new GLTFLoader();
        const dLoader = new DRACOLoader();
        dLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/")
        dLoader.setDecoderConfig({type: 'js'});
        gltfLoader.setDRACOLoader(dLoader)

        // Load the city GLB model
        gltfLoader.load(
            `${import.meta.env.VITE_ENVIRONMENT === "development" ? "../" :import.meta.env.VITE_BACKEND_URL}assets/localassets/vanderbilt.glb`,
            (gltf) => {
                gltf.scene.position.set(384,-30,226)
                setCityObj(gltf.scene);
                setLoaded(true);
                setLoaded(true);
            },
            undefined,
            (error) => console.error("GLB Load Error:", error)
        );

    }, []);

    function Checkpoints() {
        const checkpoints = [
            {position: [-2.269622325897217, -36.156700134277344, 25.91889762878418], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [13.427854537963867, -35.436832427978516, 51.04945373535156], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [45.147560119628906, -33.61881637573242, 103.22740936279297], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [69.89505767822266, -32.12342834472656, 148.2618408203125], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [103.48445129394531, -30.425745010375977, 199.42855834960938], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [157.7025604248047, -27.42766761779785, 289.7845764160156], rotation: [0, 120 * Math.PI / 180, 0] },
            {position: [171.6375274658203, -26.15873908996582, 320.9764709472656], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [165.81143188476562, -27.49252700805664, 369.21612548828125], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [163.0688934326172, -28.249792098999023, 397.97943115234375], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [174.59994506835938, -28.437171936035156, 404.9355163574219], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [272.2798767089844, -26.408506393432617, 417.8084716796875], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [318.4217834472656, -25.482484817504883, 433.43011474609375], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [309.0734558105469, -24.249561309814453, 526.3851928710938], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [291.973388671875, -28.89249038696289, 661.2779541015625], rotation: [0, 90 * Math.PI / 180, 0] },     
            {position: [279.16998291015625, -26.286819458007812, 766.7279663085938], rotation: [0, 90 * Math.PI / 180, 0] }, 
            {position: [294.0141906738281, -26.03759765625, 776.3765258789062], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [421.3318176269531, -25.946300506591797, 792.48974609375], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [542.4381713867188, -23.19383430480957, 808.0729370117188], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [677.9442749023438, -17.218881607055664, 825.21923828125], rotation: [0, 0 * Math.PI / 180, 0] },
            {position: [700.6286010742188, -16.747987747192383, 813.4385375976562], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [703.0405883789062, -16.560945510864258, 761.3602294921875], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [706.7909545898438, -17.6856746673584, 727.1535034179688], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [710.4937133789062, -18.738712310791016, 693.73681640625], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [720.23828125, -21.514339447021484, 605.953369140625], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [731.962890625, -25.045129776000977, 500.3515625], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [744.69580078125, -29.123056411743164, 384.27105712890625], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [766.7474365234375, -33.139163970947266, 243.9053955078125], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [781.31298828125, -35.173057556152344, 130.58529663085938], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [807.2791748046875, -40.362571716308594, -79.2123794555664], rotation: [0, 90 * Math.PI / 180, 0] },
            {position: [798.7846069335938, -40.4481086730957, -112.59747314453125], rotation: [0, 130 * Math.PI / 180, 0] },
            {position: [756.8560791015625, -40.01597213745117, -171.89073181152344], rotation: [0, 130 * Math.PI / 180, 0] },
            {position: [681.0520629882812, -40.0962028503418, -294.798828125], rotation: [0, 130 * Math.PI / 180, 0] },
            {position: [647.9467163085938, -41.76429748535156, -355.58013916015625], rotation: [0, 130 * Math.PI / 180, 0] },
            {position: [618.0789184570312, -41.92839050292969, -367.08551025390625], rotation: [0, 10 * Math.PI / 180, 0] },
            {position: [533.0257568359375, -36.571144104003906, -316.57012939453125], rotation: [0, 30 * Math.PI / 180, 0] },
            {position: [413.3964538574219, -31.82054328918457, -242.5343475341797], rotation: [0, 30 * Math.PI / 180, 0] },
            {position: [320.2214660644531, -32.47792434692383, -188.5987091064453], rotation: [0, 30 * Math.PI / 180, 0] },
            {position: [258.23919677734375, -33.02665710449219, -151.5540771484375], rotation: [0, 30 * Math.PI / 180, 0] },
            {position: [200.40911865234375, -33.775577545166016, -111.99581909179688], rotation: [0, 30 * Math.PI / 180, 0]}, 
            {position: [28.604637145996094, -35.36733627319336, -10.3054838180542], rotation: [0, 10, 0], finish: true}, // finish line
        ];
    
        return (
            <>
                {checkpoints.map((checkpoint, index) => (
                    <Checkpoint
                        key={index}
                        position={checkpoint.position}
                        rotation={checkpoint.rotation}
                        id={index + 1}
                        finish={checkpoint.finish}
                    />
                ))}
            </>
        );
    }
    
    function Checkpoint({ position, rotation, id, finish }) {
        const crossedRef = useRef(false);
        const justCollidedRef = useRef(false);
        const finishedRef = useRef(finish);

        const [ref] = useBox(() => ({
            position,
            rotation: rotation,
            args: [0.1, 15, 20], // width, height, depth
            isTrigger: true,
            onCollide: () => {
                if (!crossedRef.current) {
                    justCollidedRef.current = true; 
                    socket.emit("checkpoint hit", id);
                }
                if (finishedRef.current) {
                    console.log("finish line crossed!");
                    socket.emit("player finished");
                }
            },
        }));

        useFrame(() => {
            if (justCollidedRef.current && !crossedRef.current) {
                crossedRef.current = true;
                justCollidedRef.current = false;
                socket.emit("checkpoint hit", id);
    
                if (finish) {
                    console.log("finish line crossed!");
                    socket.emit("player finished");
                }
            }
        });

        return null
    }



    if (!cityObj) return null;

    let isVisible = true
    return (
        <group>
            {/* Render the city visually */}
            <primitive object={cityObj} />

            {/* Render custom collision boxes */}
            {customBoxes.map((box, index) => (
                <InvisibleBox key={index} size={box.size} visible = {isVisible} position={box.position} rotation={box.rotation} highlight={box.highlight} />
            ))}

            <CityFloor />

            <Checkpoints />
        </group>
    );
}

function InvisibleBox({ size, position, visible, rotation, highlight }) {
    // Convert degrees to radians
    const radians = rotation.map(degree => degree * (Math.PI / 180));

    const [ref] = useBox(() => ({
        args: size,
        position,
        rotation: radians,
        type: "Static",
    }));

    if (!visible) return null; // Don't render anything if not visible

    let materialProps = {
        color: 'white',
        transparent: true,
        opacity: 0, // default invisible
    };

    if (highlight) {
        materialProps = {
            color: 'red',
            transparent: true,
            opacity: 0.5,
        };
    }

    return (
        <mesh position={position} rotation={radians}>
            <boxGeometry args={size} />
            <meshStandardMaterial {...materialProps} />
        </mesh>
    );
}

// Adds a large static floor for the city
function CityFloor() {
    const boxMaterial = {
        restitution: 0, // High bounciness
    };

    const [floorRef] = usePlane(() => ({
        position: [0, -50, 0],
        material: boxMaterial,
        rotation:[-Math.PI/2, 0,0],
        // rotation: [-0.0423 - Math.PI, -2.324,  1.512], -04235/(Math.PI) -2.3244867 + (Math.PI * 2)
        type: "Static",
    }));

    return (
        <mesh ref={floorRef}>
             <planeGeometry args={[10, 10]} />
             {/*<meshStandardMaterial color="gray" />*/}
         </mesh>
    );
}

