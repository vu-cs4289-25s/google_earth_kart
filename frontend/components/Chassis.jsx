import { useGLTF } from "@react-three/drei";
import { forwardRef } from "react";
import { getCarById } from "./CarRegistry.js";

// Preload base models
useGLTF.preload("/2020_kia_soul_ex.glb");
useGLTF.preload("/Beetle.glb");
useGLTF.preload("/vandy-van.glb");
useGLTF.preload("/Model3.glb");
useGLTF.preload("/McQueen.glb");
useGLTF.preload("/mario.glb");
useGLTF.preload("/low_poly_tesla-_cyber_truck.glb");
useGLTF.preload("/McQueen.glb");
useGLTF.preload("/toyota_sienna_2016.glb");

export const Chassis = forwardRef((props, ref) => {
    const carId = props.carId || "kia-soul";
    const car = getCarById(carId);
    let modelPath = car.modelPath || "/2020_kia_soul_ex.glb";

    if (carId === "beetle") {
        try {
            const { nodes, materials } = useGLTF("/Beetle.glb");

            return (
                <mesh ref={ref}>
                    <group position={[0, -0.6, 0]}>
                        <mesh
                            castShadow
                            material={materials["Black paint"]}
                            geometry={nodes.chassis_1.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials.Rubber}
                            geometry={nodes.chassis_2.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials.Paint}
                            geometry={nodes.chassis_3.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials.Underbody}
                            geometry={nodes.chassis_4.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials.Chrom}
                            geometry={nodes.chassis_5.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Interior (dark)"]}
                            geometry={nodes.chassis_6.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Interior (light)"]}
                            geometry={nodes.chassis_7.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials.Reflector}
                            geometry={nodes.chassis_8.geometry}
                        />
                        <mesh
                            material={materials.Glass}
                            geometry={nodes.chassis_9.geometry}
                            material-transparent={false}
                            material-color="black"
                        />
                        <mesh
                            castShadow
                            material={materials.Steel}
                            geometry={nodes.chassis_10.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Black plastic"]}
                            geometry={nodes.chassis_11.geometry}
                        />
                        <mesh
                            material={materials.Headlight}
                            geometry={nodes.chassis_12.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Reverse lights"]}
                            geometry={nodes.chassis_13.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Orange plastic"]}
                            geometry={nodes.chassis_14.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["Tail lights"]}
                            geometry={nodes.chassis_15.geometry}
                        />
                        <mesh
                            castShadow
                            material={materials["License Plate"]}
                            geometry={nodes.chassis_16.geometry}
                        />
                    </group>
                </mesh>
            );
        } catch (error) {
            console.error("Error loading Beetle model:", error);
            // Fallback to generic model
            return (
                <mesh ref={ref}>
                    <boxGeometry args={[1.7, 1, 4]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            );
        }
    } else if (carId === "vandyVan") {
        try {
            const { nodes, materials } = useGLTF("/vandy-van.glb");
            return (
                <mesh ref={ref}>
                    <group position={[0, -0.6, 0]}>
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.Mesh_0.geometry}
                            material={materials.Material_0}
                            position={[0, 1.12, -1.254]}
                            scale={3}
                        />
                    </group>
                </mesh>
            );
        } catch (error) {
            console.error("Error loading Vandy Van model:", error);
            return (
                <mesh ref={ref}>
                    <boxGeometry args={[1.7, 1, 4]} />
                    <meshStandardMaterial color="yellow" />
                </mesh>
            );
        }
    } else if (carId === "model3") {
        try {
            const { nodes, materials } = useGLTF("/Model3.glb");
            return (
                <mesh ref={ref}>
                    <group position={[0, 0, 0]}>
                        <group rotation={[0, Math.PI, 0]}>
                            <group
                                rotation={[-Math.PI / 2, 0, 0]}
                                scale={0.123}
                            >
                                <group scale={6.5}>
                                    <group position={[0, 1.771, -0.362]}>
                                        <group position={[0, -1.771, 0.362]}>
                                            {/* Include all the car components */}
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_12.geometry
                                                }
                                                material={
                                                    materials["movsteer_1.0.1"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_16.geometry
                                                }
                                                material={
                                                    materials["dvorright.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_17.geometry
                                                }
                                                material={
                                                    materials["movsteer_1.0.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_18.geometry
                                                }
                                                material={
                                                    materials["JUST_BLACK.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_19.geometry
                                                }
                                                material={materials.primary}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_20.geometry
                                                }
                                                material={materials.primary}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_21.geometry
                                                }
                                                material={
                                                    materials["primary.001"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_22.geometry
                                                }
                                                material={
                                                    materials["black_lights.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_23.geometry
                                                }
                                                material={
                                                    materials[
                                                        "back_chrome_light.0"
                                                    ]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_24.geometry
                                                }
                                                material={
                                                    materials["pantulans.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_25.geometry
                                                }
                                                material={
                                                    materials.right_rear_light
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_26.geometry
                                                }
                                                material={
                                                    materials.breaklight_l
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_27.geometry
                                                }
                                                material={materials.foglight_r}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_28.geometry
                                                }
                                                material={materials.foglight_l}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_29.geometry
                                                }
                                                material={
                                                    materials.right_front_light
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_30.geometry
                                                }
                                                material={
                                                    materials.left_front_light
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_31.geometry
                                                }
                                                material={
                                                    materials[
                                                        "aluminium_light.0"
                                                    ]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_32.geometry
                                                }
                                                material={
                                                    materials["tembus_red.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_33.geometry
                                                }
                                                material={materials.light_night}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_34.geometry
                                                }
                                                material={
                                                    materials.indicator_lf
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_35.geometry
                                                }
                                                material={
                                                    materials.indicator_rf
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_36.geometry
                                                }
                                                material={materials["hitam.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_37.geometry
                                                }
                                                material={
                                                    materials["Plastic.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_38.geometry
                                                }
                                                material={materials["belt.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_39.geometry
                                                }
                                                material={
                                                    materials["satin_red.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_42.geometry
                                                }
                                                material={
                                                    materials["aluminium2.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_43.geometry
                                                }
                                                material={materials["Putih.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_44.geometry
                                                }
                                                material={materials["Carpet.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_45.geometry
                                                }
                                                material={
                                                    materials["Carpet_Light.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_46.geometry
                                                }
                                                material={
                                                    materials[
                                                        "texture_Buttons.0"
                                                    ]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_47.geometry
                                                }
                                                material={materials["LCDs.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_48.geometry
                                                }
                                                material={
                                                    materials[
                                                        "Seat_Leather_white.0"
                                                    ]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_49.geometry
                                                }
                                                material={
                                                    materials["mirror_inside.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_50.geometry
                                                }
                                                material={materials["glass.0"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_51.geometry
                                                }
                                                material={materials["glass.1"]}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_52.geometry
                                                }
                                                material={
                                                    materials["platnomor.1"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_53.geometry
                                                }
                                                material={
                                                    materials["platnomor.2"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_54.geometry
                                                }
                                                material={
                                                    materials.indicator_rr
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_55.geometry
                                                }
                                                material={
                                                    materials.indicator_lr
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_56.geometry
                                                }
                                                material={
                                                    materials.left_rear_light
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_57.geometry
                                                }
                                                material={materials.revlight_L}
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_58.geometry
                                                }
                                                material={
                                                    materials["door_lf.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_59.geometry
                                                }
                                                material={
                                                    materials["door_lf.5"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_60.geometry
                                                }
                                                material={
                                                    materials["primary.002"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_61.geometry
                                                }
                                                material={
                                                    materials["primary.004"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_62.geometry
                                                }
                                                material={
                                                    materials["front_black.0"]
                                                }
                                            />
                                            <mesh
                                                castShadow
                                                receiveShadow
                                                geometry={
                                                    nodes.Object_63.geometry
                                                }
                                                material={
                                                    materials[
                                                        "light_pantulan.0"
                                                    ]
                                                }
                                            />
                                        </group>
                                        <mesh
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Object_71.geometry}
                                            material={materials["chassis.0"]}
                                        />
                                    </group>
                                    <mesh
                                        castShadow
                                        receiveShadow
                                        geometry={nodes.Object_76.geometry}
                                        material={materials["primary.002"]}
                                        position={[1.033, -0.131, -0.063]}
                                    />
                                </group>
                            </group>
                        </group>
                    </group>
                </mesh>
            );
        } catch (error) {
            console.error("Error loading Untitled model:", error);
            return (
                <mesh ref={ref}>
                    <boxGeometry args={[1.7, 1, 4]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            );
        }
    } else if (carId === "mario-kart") {
        try {
            const { nodes, materials } = useGLTF("/mario.glb");
            return (
                <mesh ref={ref}>
                     <group position={[0, -0.6, 0]} rotation={[0, 0, 0]} scale={1.5}>
                        <group rotation={[-Math.PI / 2, 0, 0]}>
                            <group rotation={[Math.PI / 2, 0, 0]}>
                                <mesh castShadow receiveShadow geometry={nodes.mt_mario.geometry} material={materials.mt_mario} />
                                <mesh castShadow receiveShadow geometry={nodes.mt_kart_Mario_S.geometry} material={materials.mt_kart_Mario_S} />
                                <mesh castShadow receiveShadow geometry={nodes.mt_Kart_Mario_Tire_S.geometry} material={materials.mt_Kart_Mario_Tire_S} />
                            </group>
                        </group>
                    </group>
                </mesh>
            );
        } catch (error) {
            console.error("Error loading Mario Kart model:", error);
            return ( <mesh ref={ref}> <boxGeometry args={[1.7, 1, 4]} /> <meshStandardMaterial color="red" /> </mesh> );
        }
    } else if (carId === "cybertruck") {
        try {
           const { nodes, materials } = useGLTF("/low_poly_tesla-_cyber_truck.glb");
           return (
               <mesh ref={ref}>
                   <group position={[0, 0.4, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.7}>
                   <group>
                           <group>
                               <mesh castShadow receiveShadow geometry={nodes.Body_body_0.geometry} material={materials.body} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_buffer_0.geometry} material={materials.buffer} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_edges_0.geometry} material={materials.edges} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_headlight_0.geometry} material={materials.headlight} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_glass_0.geometry} material={materials.glass} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_Material_0.geometry} material={materials.Material} />
                               <mesh castShadow receiveShadow geometry={nodes.Body_backlight_0.geometry} material={materials.backlight} />
                           </group>
                           <group position={[1251.072, 3107.976, -38985.191]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={838.914}>
                               <mesh castShadow receiveShadow geometry={nodes.tyres_tyre_0.geometry} material={materials.tyre} />
                               <mesh castShadow receiveShadow geometry={nodes.tyres_alowheel_0.geometry} material={materials.alowheel} />
                           </group>
                           <group position={[1217.655, 3157.224, -41526.387]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={875.564}>
                               <mesh castShadow receiveShadow geometry={nodes.backtyres_tyre_0.geometry} material={materials.tyre} />
                               <mesh castShadow receiveShadow geometry={nodes.backtyres_alowheel_0.geometry} material={materials.alowheel} />
                           </group>
                           <mesh castShadow receiveShadow geometry={nodes.tyres001_tyre_0.geometry} material={materials.tyre} position={[1275.81, 3415.513, -37491.227]} rotation={[1.934, -1.561, 0.764]} scale={838.914} />
                           <mesh castShadow receiveShadow geometry={nodes.backtyre1_tyre_0.geometry} material={materials.tyre} position={[1336.616, 1708.248, -41079.234]} rotation={[2.7, -1.556, -1.438]} scale={875.564} />
                           <mesh castShadow receiveShadow geometry={nodes.backrim1_alowheel_0.geometry} material={materials.alowheel} position={[491.767, 2649.769, -40619.418]} rotation={[2.587, -1.556, -1.413]} scale={875.564} />
                           <mesh castShadow receiveShadow geometry={nodes.frontrim1_alowheel_0.geometry} material={materials.alowheel} position={[499.072, 2592.645, -38097.063]} rotation={[-0.404, -1.533, 1.879]} scale={838.914} />
                       </group>
                   </group>
                </mesh>
           );
        } catch (error) {
           console.error("Error loading Cybertruck model:", error);
            return ( <mesh ref={ref}> <boxGeometry args={[1.7, 1, 4]} /> <meshStandardMaterial color="silver" /> </mesh> );
        }
    } else if (carId === "mcqueen") {
        try {
           const { nodes, materials } = useGLTF("/McQueen.glb");
           return (
            <mesh ref={ref}>
            <group position={[0.085, -0.6, 0]} rotation={[0, 0, 0]} scale={0.75}>
                <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.material_0} position={[-0.339, 0.012, 10.225]} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials.material_1} position={[-0.339, 0.012, 10.225]} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials.material_2} position={[-0.339, 0.012, 10.225]} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials.material_3} position={[-0.339, 0.012, 10.225]} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials.material_4} position={[-0.339, 0.012, 10.225]} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
        </mesh>
        );
    } catch (error) {
        console.error("Error loading McQueen model:", error);
        return ( <mesh ref={ref}> <boxGeometry args={[1.7, 1, 4]} /> <meshStandardMaterial color="red" /> </mesh> ); 
    }
    } else if (carId === "sienna") {
        try {
           const { nodes, materials } = useGLTF("/toyota_sienna_2016.glb");
           return (
               <mesh ref={ref}>
                   <group position={[0, -0.7, 0]} rotation={[0, Math.PI, 0]} scale={0.2}>
                       <group rotation={[-Math.PI / 2, 0, 0]}>
                           <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials['Blinker_l.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_3.geometry} material={materials['Blinker_r.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials['Display.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials['Exhaust.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials['Glass2Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_9.geometry} material={materials['Griil.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials['Head_light.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_11.geometry} material={materials['Head_light_2.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials['MainFrame1Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_13.geometry} material={materials['Meshesemblem11Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_14.geometry} material={materials['Meshesemblem31Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_15.geometry} material={materials['Meshesfahrradobj1Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_16.geometry} material={materials['Meshessienna1022Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_17.geometry} material={materials['Meshessienna1121Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_18.geometry} material={materials['Meshessienna1122Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_19.geometry} material={materials['Meshessienna541Mtl.004']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_20.geometry} material={materials['Meshessienna761Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_21.geometry} material={materials['Meshessienna7621Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_22.geometry} material={materials['Meshessienna1082Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_23.geometry} material={materials['Meshessienna1152Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_24.geometry} material={materials['Meshessienna1231Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_25.geometry} material={materials['Meshessienna781Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_26.geometry} material={materials['Meshessiennabody242Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_27.geometry} material={materials['Meshessiennabody242Mtl.006']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_28.geometry} material={materials['Meshessiennabody91Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_29.geometry} material={materials['Meshessienna791Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_30.geometry} material={materials['Meshessienna801Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_31.geometry} material={materials['Meshessienna881Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_32.geometry} material={materials['Meshessienna891Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_33.geometry} material={materials['Meshessienna901Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_34.geometry} material={materials['Meshessienna911Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_35.geometry} material={materials['Meshessienna931Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_36.geometry} material={materials['Meshessienna952Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_37.geometry} material={materials['Meshessiennabody11Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_38.geometry} material={materials['Meshessiennadfl11Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_39.geometry} material={materials['Meshessiennadfr21Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_40.geometry} material={materials['Meshessiennadfr61Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_41.geometry} material={materials['No1Mtl.007']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_42.geometry} material={materials['No1Mtl.008']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_43.geometry} material={materials['No1Mtl.009']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_44.geometry} material={materials['No1Mtl.010']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_45.geometry} material={materials['Meshpart1Mtl.004']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_46.geometry} material={materials['Meshpart3Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_47.geometry} material={materials['Mirror.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_48.geometry} material={materials['Mirror_Color.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_49.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_50.geometry} material={materials['Part2Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_51.geometry} material={materials['Part4Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_52.geometry} material={materials['RoofRackC1Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_53.geometry} material={materials['Roof_rack.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_54.geometry} material={materials['RearCassette1Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_55.geometry} material={materials['Reverse.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_56.geometry} material={materials['Union1Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_57.geometry} material={materials['Union3Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_58.geometry} material={materials['Roof_window.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_59.geometry} material={materials['Template1Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_100.geometry} material={materials['Windows.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_101.geometry} material={materials['Wiper.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_102.geometry} material={materials['Tail_ligjt.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_60.geometry} material={materials['Brake_dish.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_61.geometry} material={materials['Brake_dish.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_62.geometry} material={materials['Brake_pads.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_63.geometry} material={materials['Brake_pads.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_64.geometry} material={materials['Brake_pads.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_65.geometry} material={materials['Brake_pads.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_66.geometry} material={materials['Logo.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_67.geometry} material={materials['Logo_on_Rim.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_68.geometry} material={materials['Logo_on_Rim.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_69.geometry} material={materials['Meshessienna1001Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_70.geometry} material={materials['Meshessienna1001Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_71.geometry} material={materials['Meshessienna1001Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_72.geometry} material={materials['Meshessienna1001Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_73.geometry} material={materials['Meshessienna1001Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_74.geometry} material={materials['Meshessienna1002Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_75.geometry} material={materials['Meshessienna1002Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_76.geometry} material={materials['Meshessienna1091Mtl.002']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_77.geometry} material={materials['Meshessienna541Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_78.geometry} material={materials['Meshessienna1172Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_79.geometry} material={materials['Meshessienna351Mtl.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_80.geometry} material={materials['No1Mtl.006']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_81.geometry} material={materials['No1Mtl.006']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_82.geometry} material={materials['No1Mtl.006']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_83.geometry} material={materials['Nuts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_84.geometry} material={materials['Nuts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_85.geometry} material={materials['Nuts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_86.geometry} material={materials['Nuts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_87.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_88.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_89.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_90.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_91.geometry} material={materials['Paintts.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_92.geometry} material={materials['Rims.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_93.geometry} material={materials['Rims.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_94.geometry} material={materials['Rims.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_95.geometry} material={materials['Rims.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_96.geometry} material={materials['Tires.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_97.geometry} material={materials['Tires.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_98.geometry} material={materials['Tires.003']} />
                           <mesh castShadow receiveShadow geometry={nodes.Object_99.geometry} material={materials['Tires.003']} />
                       </group>
                   </group>
               </mesh>
          );
        } catch (error) {
          console.error("Error loading Sienna model:", error);
           return ( <mesh ref={ref}> <boxGeometry args={[1.7, 1, 4]} /> <meshStandardMaterial color="blue" /> </mesh> );
        }
  }

    try {
        const { nodes, materials } = useGLTF(modelPath);

        if (materials.Paint) {
            materials.Paint.color.set("#ff3333"); // Brighter red
        }

        if (materials.Paint) {
            materials.Paint.emissive.set("#500000"); // Subtle red glow
            materials.Paint.emissiveIntensity = 1.0; // Control intensity
        }

        return (
            <mesh ref={ref}>
                <group position={[0, -0.6, 0]}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_4.geometry}
                        material={materials.material}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_6.geometry}
                        material={materials.Glass}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_8.geometry}
                        material={materials.Texture}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_10.geometry}
                        material={materials.Black}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_12.geometry}
                        material={materials.darker_glass}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_14.geometry}
                        material={materials.black_chrome}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_16.geometry}
                        material={materials.Paint}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_18.geometry}
                        material={materials.mirror_ind}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_20.geometry}
                        material={materials.Chrome}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_22.geometry}
                        material={materials.Headlight}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_24.geometry}
                        material={materials.Clear_Glass}
                    />
                </group>
            </mesh>
        );
    } catch (error) {
        console.error("Error loading car model:", error);

        return (
            <mesh ref={ref}>
                <boxGeometry args={[1.7, 1, 4]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        );
    }
});

export default Chassis;
