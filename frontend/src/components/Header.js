import React, { Component } from 'react';
import logo from '../images/icon.jpg';

console.log(logo);

class Header extends Component {
    render () {
        return (
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
        )
    }
}

export default Header;