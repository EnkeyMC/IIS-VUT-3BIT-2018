import React from "react";
import Header from "../../components/Header";
import SidePanel from "../../components/SidePanel";

export default function DefaultLayout(props) {
    return (
        <div>
            <Header />
            <div className="pt-header position-relative">
                <SidePanel/>
                <div className="position-relative content-with-side-panel">
                    {props.children}
                </div>
            </div>
        </div>
    );
}