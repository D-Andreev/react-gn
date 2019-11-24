import {ON_GET_POSTS_ERROR, RECEIVE_POSTS, REQUEST_POSTS} from "../actions/postsActions";

export default (state = {posts: [], isLoadingPosts: false}, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            state.isLoadingPosts = true;
            return {...state};
        case RECEIVE_POSTS:
            state.isLoadingPosts = false;
            state.posts = action.payload.posts;
            return {...state};
        case ON_GET_POSTS_ERROR:
            state.isLoadingPosts = false;
            return {...state};
        default:
            return state;
    }
};
