/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Pig(props) {
    
  const { nodes, materials } = useGLTF("/Pig.glb");
  return (
    <group {...props} dispose={null}>
      <group position={[0, 1.19, 0]} rotation={[Math.PI, 0, 0]} scale={-0.03}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle_1.geometry}
          material={materials["Material.002"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/Pig.glb');