import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="position-fixed side-panel content-height">
                <div className="w100 mt-5 side-container">
                    <div className="icon-text flex-mid">
                        Done
                    </div>
                    <div className="flex-mid side-icon">
                        <FontAwesomeIcon icon="check-circle"/>
                    </div>
                </div>
                <div className="w100 side-container">
                    <div className="icon-text flex-mid">
                        Opened tickets
                    </div>
                    <div className="flex-mid side-icon">
                        <FontAwesomeIcon icon ="box-open" />
                    </div>
                </div>
                <div className="w100 side-container">
                    <div className="icon-text flex-mid">
                        My reports
                    </div>
                    <div className="flex-mid side-icon">
                        <FontAwesomeIcon icon ="user" />
                    </div>
                </div>
            </nav>
        );
    }
}