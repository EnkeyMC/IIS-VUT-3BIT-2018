import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="position-fixed side-panel content-height">
                <div className="w100 mt-5 side-icon">
                    <div className="icon-text">
                        Done
                    </div>
                    <FontAwesomeIcon icon="check-circle"/>
                </div>
                <div className="w100 side-icon">
                    <div className="icon-text">
                        Opened tickets
                    </div>
                    <FontAwesomeIcon icon ="box-open" />
                </div>
                <div className="w100 side-icon">
                    <div className="icon-text">
                        My reports
                    </div>
                    <FontAwesomeIcon icon ="user" />
                </div>
            </nav>
        );
    }
}