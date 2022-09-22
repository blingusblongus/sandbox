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
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    

    return <div className='three-scene'>
        <ThreeForeground />
        <Canvas style={{ top: 0, position: 'absolute' }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[3, scroll * .1 - 5, -3]} />
                {[
                    [-5,-5,-5]
                ].map(coords => {
                    coords[1] + scroll*.1;
                    return <Pig 
                    position={coords}
                    rotation={[scroll*.01, scroll*.01, scroll*.01]}
                    />
                })}
                
        </Canvas>
    </div>
}


export default ThreeScene;