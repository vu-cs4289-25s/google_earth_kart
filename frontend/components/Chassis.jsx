import { useGLTF } from "@react-three/drei";
import { forwardRef } from "react";
import { getCarById } from "./CarRegistry";

// Preload base models
useGLTF.preload("/2020_kia_soul_ex.glb");
useGLTF.preload("/Beetle.glb");
useGLTF.preload("/vandy-van.glb");

export const Chassis = forwardRef((props, ref) => {
    const carId = props.carId || 'kia-soul';
    const car = getCarById(carId);
    let modelPath = car.modelPath || "/2020_kia_soul_ex.glb";
    
    if (carId === 'beetle') {
        try {
            const { nodes, materials } = useGLTF("/Beetle.glb");
            
            return (
                <mesh ref={ref}>
                    <group position={[0, -0.6, 0]}>
                        <mesh castShadow material={materials["Black paint"]} geometry={nodes.chassis_1.geometry} />
                        <mesh castShadow material={materials.Rubber} geometry={nodes.chassis_2.geometry} />
                        <mesh castShadow material={materials.Paint} geometry={nodes.chassis_3.geometry} />
                        <mesh castShadow material={materials.Underbody} geometry={nodes.chassis_4.geometry} />
                        <mesh castShadow material={materials.Chrom} geometry={nodes.chassis_5.geometry} />
                        <mesh castShadow material={materials["Interior (dark)"]} geometry={nodes.chassis_6.geometry} />
                        <mesh castShadow material={materials["Interior (light)"]} geometry={nodes.chassis_7.geometry} />
                        <mesh castShadow material={materials.Reflector} geometry={nodes.chassis_8.geometry} />
                        <mesh 
                            material={materials.Glass} 
                            geometry={nodes.chassis_9.geometry} 
                            material-transparent={false} 
                            material-color="black" 
                        />
                        <mesh castShadow material={materials.Steel} geometry={nodes.chassis_10.geometry} />
                        <mesh castShadow material={materials["Black plastic"]} geometry={nodes.chassis_11.geometry} />
                        <mesh material={materials.Headlight} geometry={nodes.chassis_12.geometry} />
                        <mesh castShadow material={materials["Reverse lights"]} geometry={nodes.chassis_13.geometry} />
                        <mesh castShadow material={materials["Orange plastic"]} geometry={nodes.chassis_14.geometry} />
                        <mesh castShadow material={materials["Tail lights"]} geometry={nodes.chassis_15.geometry} />
                        <mesh castShadow material={materials["License Plate"]} geometry={nodes.chassis_16.geometry} />
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
    } else if (carId === 'vandyVan') {
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
    }

    try {
        const { nodes, materials } = useGLTF(modelPath);

        if (materials.Paint) {
            materials.Paint.color.set('#ff3333'); // Brighter red
        }

        if (materials.Paint) {
            materials.Paint.emissive.set('#500000');  // Subtle red glow
            materials.Paint.emissiveIntensity = 1.0;  // Control intensity
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