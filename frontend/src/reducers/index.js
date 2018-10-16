import { TOGGLE_NAVBAR } from '../actions'
import { copyMerge } from '../utils';

const initialState = {
    navbarIsOpen: false
};

export function zeroBugsApp(state = initialState, action) {console.log("reducer", action)
    switch (action.type) {
        case TOGGLE_NAVBAR:
            return copyMerge(state, {
                navbarIsOpen: !state.navbarIsOpen
            });
        default:
            return state;
    }
}