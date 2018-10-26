import React  from 'react';
import { connect } from 'react-redux';
import {loadData} from "../actions";

function Tmp(props) {
    return (
        <div>
            <button onClick={props.onLoadData}>Load data</button>
            {props.ajaxInProgress > 0 ? <p>Loading...</p> : null}
            <ul>
                {props.data.map((item) => <li key={item.id}>{item.name}</li>)}
            </ul>
        </div>
    );
}

export default Tmp = connect(
    state => {
        return { data: state.data, error: state.error, ajaxInProgress: state.ajaxInProgress }
    },
    dispatch => {
        return {
            onLoadData: () => dispatch(loadData())
        }
    }
)(Tmp);