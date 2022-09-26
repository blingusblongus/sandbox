import React, { useState, useEffect } from "react";
import './Parallax.css';

interface Props {
    imgSrc: string;
}

interface Styles {
    width: string;
    position: string;
    top: string | number;
    [key: string]: string | number;
}

export default ({imgSrc}: Props) => {
    const [offsetY, setOffsetY] = useState(0)
    const styles = {
        top: offsetY * -2,
    }

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

   

    return <img 
        className="parallax"
        onClick={handleClick} 
        src={imgSrc} 
        style={styles} />
}