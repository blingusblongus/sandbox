import React, { useState, useEffect } from "react";

export default () => {
    const [offsetY, setOffsetY] = useState(0)

    const handleScroll = () => {
        console.log('scrolling');
        setOffsetY(window.pageYOffset);
    } 

    const handleClick = () => {
        console.log('click')
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },[])

    console.log(offsetY);
    console.log('component mounted');

    const styles = {
        width: '200%',
        position: 'absolute',
        top: offsetY * -2,
        zIndex: -1,
        filter: 'blur(10px) opacity(10%)',
        transform: 'scale(2) translateX(-10%)',
        // objectFit: 'cover'
    }

    return <img onClick={handleClick} 
        src="/sandbox/images/album_art.jpeg" 
        style={styles} />
}