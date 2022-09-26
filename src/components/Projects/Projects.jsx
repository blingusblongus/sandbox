import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei';
import './Projects.css';

const Projects = () => {
    const [scroll, setScroll] = useState(0);
    const [rotation, setRotation] = useState([0, 0])

    const handleScroll = () => {
        setScroll(window.scrollY);
    }

    const handleMove = (e) => {
        const { clientX, clientY } = e;
        const posX = clientX / window.innerWidth - .5;
        const posY = clientY / window.innerHeight - .5;
        setRotation([posX, posY])
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
                >{"Projects"}</FloatingText>
            </Suspense>
        </Canvas>
        <div className='project-grid'>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rutrum imperdiet hendrerit. Integer turpis dolor, tempus eget mauris sit amet, suscipit maximus purus. Fusce diam arcu, commodo vitae cursus vitae, pretium ac nisl. In porttitor diam nec lorem dignissim ultrices. Aenean semper neque id rutrum elementum. Nam rutrum urna eu felis imperdiet, sed ultrices arcu fermentum. Praesent scelerisque finibus arcu, a iaculis metus pharetra quis. Fusce vitae dapibus tortor, mollis fermentum elit. Vivamus commodo velit nec ex porttitor, ut iaculis purus scelerisque. Morbi viverra vestibulum massa, ut mollis nibh congue a. Duis quis elementum neque. Vestibulum vel turpis nec ipsum pharetra consequat. Aliquam enim mauris, mollis vel ultricies ut, hendrerit pharetra tellus. Fusce vitae purus eros. Nullam euismod justo placerat, venenatis est vitae, lacinia eros.
            </div>
            <div>
                Donec placerat quam nec mi eleifend, id hendrerit ex aliquam. Proin ligula massa, pellentesque sed ipsum non, mattis ultricies velit. Suspendisse tincidunt porta mi et feugiat. Phasellus placerat elit luctus, hendrerit nunc eget, lacinia nibh. Phasellus in mattis eros. Praesent quis ullamcorper mi, ullamcorper posuere urna. Quisque faucibus lacus molestie maximus porta. Integer facilisis dapibus arcu, convallis sodales turpis accumsan vel. Donec sit amet varius erat.
            </div>
            <div>
                Vivamus non turpis eget purus tincidunt feugiat. Maecenas quis mi nec augue pellentesque mattis ac ut tellus. Fusce congue leo in libero scelerisque, at sodales arcu facilisis. In rhoncus sagittis ligula, in euismod sapien tempus eu. Integer at libero vitae tellus gravida porttitor nec nec metus. Fusce et fringilla libero. Fusce et ex vitae turpis tempus euismod ac eget odio. Sed euismod nec magna et iaculis. Curabitur malesuada arcu vitae lectus aliquet, semper molestie nisl congue. Ut rhoncus maximus velit, laoreet pulvinar nisi pharetra quis. Donec non aliquet diam, id commodo orci. Curabitur interdum non velit tincidunt interdum. Nullam scelerisque orci et vestibulum dapibus. Vestibulum pellentesque felis lobortis aliquam imperdiet. Aliquam sagittis felis sed facilisis scelerisque. Proin porttitor metus in pretium laoreet.
            </div>
        </div>
    </div>
}

const FloatingText = ({ children, rot }) => {
    const width = useThree((state) => state.viewport);
    return <Text
        position={[-0, 4, -5]}
        rotation={[rot[1], rot[0], 0]}
        lineHeight={0.8}
        font="assets/fonts/Lobster-Regular.ttf"
        fontSize={5.5}
        material-toneMapped={false}
        anchorX="center"
        anchorY="middle">
        {children}
    </Text>
}


export default Projects;