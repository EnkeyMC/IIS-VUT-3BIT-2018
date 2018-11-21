import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Error(props) {
    return (
        <div className={"flex-mid "+props.className}>
            <FontAwesomeIcon icon="exclamation-circle" size="2x" className="mr-3 text-danger" />
            {props.children}
        </div>
    );
}