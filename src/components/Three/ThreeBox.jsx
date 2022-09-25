import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const Box = (props) => {
    const mesh = useRef();

    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(true);

    useFrame((state, delta) => mesh.current.rotation.x += 0.01);

    return <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(e)=>setActive(!active)}
        onPointerOver={(e)=>setHovered(true)}
        onPointerOut={(e)=>setHovered(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
}

export default Box;