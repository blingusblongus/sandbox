import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei';

const Projects = () => {
    const [scroll, setScroll] = useState(0);
    const [rotation, setRotation] = useState([0,0])

    const handleScroll = () => {
        setScroll(window.scrollY);
    }

    const handleMove = (e) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // console.log([width, height]);
        const {clientX, clientY} = e;
        // console.log([clientX, clientY]);

        const posX = clientX / width - .5;
        const posY = clientY / height - .5;

        console.log(posX, posY);
        setRotation([posX,posY])
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMove);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMove)
        }
    }, [])

    return <div className='three-scene'>
        <Canvas style={{ top: 0, position: 'absolute' }}>
            <Suspense fallback={null}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <FloatingText
                    rot={rotation}
                >{"Hello"}</FloatingText>
            </Suspense>
        </Canvas>
    </div>
}

const FloatingText = ({ children, rot }) => {
    const width = useThree((state) => state.viewport);
    return <Text
        position={[-0, -0, -5]}
        rotation={[rot[1],rot[0],0]}
        lineHeight={0.8}
        font="assets/fonts/Lobster-Regular.ttf"
        fontSize={6}
        material-toneMapped={false}
        anchorX="center"
        anchorY="middle">
        {children}
    </Text>
}


export default Projects;