import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="float-left side-panel">
                <div className="w-100 mt-5">
                    <div className="text-center pt-2">
                        <FontAwesomeIcon icon ="check-circle" />
                    </div>
                    {/*<div>*/}
                        {/*sfd*/}
                    {/*</div>*/}
                </div>
                <div className="w-100">
                    <div className="text-center pt-2">
                        <FontAwesomeIcon icon ="box-open" />
                    </div>
                </div>
                <div className="w-100">
                    <div className="text-center pt-2">
                        <FontAwesomeIcon icon ="user" />
                    </div>
                </div>
            </nav>
        );
    }
}