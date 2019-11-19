import {ON_GET_POSTS_ERROR, RECEIVE_POSTS, REQUEST_POSTS} from "../actions/{actions1}";

export default (state = {}, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            state.{reducer}.{state2} = true;
            return {...state};
        case RECEIVE_POSTS:
            state.{reducer}.{state2} = false;
            state.{reducer}.{state1} = action.payload.posts;
            return {...state};
        case ON_GET_POSTS_ERROR:
            state.{reducer}.{state2} = false;
            return {...state};
        default:
            return state;
    }
};
