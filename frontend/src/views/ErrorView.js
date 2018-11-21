import React from 'react';
import Logo from "../images/logo.png";

export default class ProfileView extends React.Component {
    render () {
        return (
            <div className="flex-mid h-100">
                <img className="img-rotate" src={Logo} alt="" />
                <div className="position-fixed flex-mid">
                    Text
                </div>
            </div>
        )
    }
}