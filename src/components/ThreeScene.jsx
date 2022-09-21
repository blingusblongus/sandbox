import React, { useRef, useState, useEffect, Suspense} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Box from './ThreeBox';
import ThreeForeground from './ThreeForeground';
import './ThreeScene.jsx';
import { Pig } from './ThreePig';

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
        <Canvas style={{ top: 0, position: 'absolute' }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[3, scroll * .1, -3]} />
                <Pig position={[-4,-5 + scroll * .1,-2]}/>
        </Canvas>
    </div>
}


export default ThreeScene;