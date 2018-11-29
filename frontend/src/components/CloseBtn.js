import React from "react";
import {RestrictedView, ROLE_PROGRAMMER} from "./RoleRestriction";

export default function CloseBtn() {
    return (
            <button className="close close-btn"
                    style={{ position: 'absolute', top: '2px', right: '5px' }}
                    onClick={(e) => e.preventDefault()}
            >
                &times;
            </button>
    );
}
