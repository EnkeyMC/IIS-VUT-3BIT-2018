import React from "react";
import {RestrictedView, ROLE_PROGRAMMER} from "./RoleRestriction";

export default function CloseBtn(props) {
    return (
            <button className="close close-btn"
                    style={{ position: 'absolute', top: '2px', right: '5px' }}
                    onClick={props.onClick}
            >
                &times;
            </button>
    );
}
