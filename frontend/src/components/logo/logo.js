import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
    const logo = require('../../assets/images/logo.png');

    return (
        <Link to={'/'}>
            <img
                alt='truc.zip logo'
                src={logo}
                className="logo"
            />
        </Link>
    )  
}