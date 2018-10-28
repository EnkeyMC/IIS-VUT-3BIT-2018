import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="float-left side-panel">
                <div className="w100 mt-5">
                    <div className="icon-box text-center pt-2">
                        <FontAwesomeIcon icon ="check-circle" />
                    </div>
                    <div className="icon-text">
                        Done
                    </div>
                </div>
                <div className="w100">
                    <div className="icon-box text-center pt-2">
                        <FontAwesomeIcon icon ="box-open" />
                    </div>
                    <div className="icon-text">
                        Solving
                    </div>
                </div>
                <div className="w100">
                    <div className="icon-box text-center pt-2">
                        <FontAwesomeIcon icon ="user" />
                        <div className="icon-text">
                            My
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}