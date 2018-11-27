import {withRouter} from "react-router";
import pathToRegexp from "path-to-regexp";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export const Numbering = withRouter((props) => {
    const status = props.match.params.status;
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <div className="font-size">
            <span>{props.thisIdx} of {props.size}</span>
            <Link to={toPath({status: status, id: props.prevId})} className={"ml-3 mr-3 " + (props.prevId ? "" : "disabled")}><FontAwesomeIcon icon ="angle-up"/></Link>
            <Link to={toPath({status: status, id: props.nextId})} className={props.nextId ? "" : "disabled"}><FontAwesomeIcon icon="angle-down"/></Link>
        </div>
    );
});