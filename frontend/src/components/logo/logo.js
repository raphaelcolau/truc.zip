import React from 'react';

export default function Logo() {
    const logo = require('../../assets/images/logo.png');

    return (
        <a href="https://raphael.colau.fr"  target="_blank" rel="noreferrer">
            <img
                alt='truc.zip logo'
                src={logo}
                className="logo"
            />
        </a>
    )  
}