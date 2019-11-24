import {ON_GET_POSTS_ERROR, RECEIVE_POSTS, REQUEST_POSTS} from "../actions/{action1}";

export default (state = {{state1}: [], {state2}: false}, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            state.{state2} = true;
            return {...state};
        case RECEIVE_POSTS:
            state.{state2} = false;
            state.{state1} = action.payload.posts;
            return {...state};
        case ON_GET_POSTS_ERROR:
            state.{state2} = false;
            return {...state};
        default:
            return state;
    }
};
