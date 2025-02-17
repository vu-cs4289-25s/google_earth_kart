import { useCompoundBody } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'

useGLTF.preload('/wheel.glb')

// Initially Auto-generated by: https://github.com/pmndrs/gltfjsx

export const Wheel = forwardRef(({ leftSide, radius = 0.7, ...props }, ref) => {
    const {
        materials: { Chrom, Rubber, Steel },
        nodes,
    } = useGLTF('/wheel.glb')

    useCompoundBody(
        () => ({
            collisionFilterGroup: 0,
            mass: 1,
            material: 'wheel',
            shapes: [{ args: [radius, radius, 0.5, 16], rotation: [0, 0, -Math.PI / 2], type: 'Cylinder' }],
            type: 'Kinematic',
            ...props,
        }),
        ref,
    )

    return (
        <group ref={ref}>
            <group rotation={[0, 0, ((leftSide ? 1 : -1) * Math.PI) / 2]}>
                <mesh material={Rubber} geometry={nodes.wheel_1.geometry} />
                <mesh material={Steel} geometry={nodes.wheel_2.geometry} />
                <mesh material={Chrom} geometry={nodes.wheel_3.geometry} />
            </group>
        </group>
    )
})