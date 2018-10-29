import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="float-left side-panel">
                <div className="w100 mt-5">
                    <div className="icon-box text-center">
                        <FontAwesomeIcon icon ="check-circle"/>
                    </div>
                    {/*<div className="icon-text">*/}
                        {/*Done*/}
                    {/*</div>*/}
                </div>
                <div className="w100">
                    <div className="icon-box text-center">
                        <FontAwesomeIcon icon ="box-open" />
                    </div>
                </div>
                <div className="w100">
                    <div className="icon-box text-center">
                        <FontAwesomeIcon icon ="user" />
                    </div>
                </div>
            </nav>
        );
    }
}