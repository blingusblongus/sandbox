import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Box from './ThreeBox';
import ThreeForeground from './ThreeForeground';
import './ThreeScene.jsx';

const ThreeScene = () => {
    const [scroll, setScroll] = useState(0);

    const handleScroll = () => {
        console.log('scrollling')
        setScroll(window.scrollY);
    }

    useEffect(() => {
        console.log('useEffect')
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    console.log(scroll);
    return <div className='three-scene'>
        <ThreeForeground />
        <Canvas style={{ top: scroll * .5, position: 'absolute' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[0, 0, 0]} />
        </Canvas>
    </div>
}


export default ThreeScene;