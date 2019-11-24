export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
function receivePosts(posts) {
    return {
        type: RECEIVE_POSTS,
        payload: {posts},
        receivedAt: Date.now()
    }
}

export const ON_GET_POSTS_ERROR = 'ON_GET_POSTS_ERROR';
export function onError() {
    return {
        type: ON_GET_POSTS_ERROR,
    }
}

export function postsActions() {
    return function(dispatch) {
        dispatch(requestPosts());
        return fetch('https://jsonplaceholder.typicode.com/posts')
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receivePosts(json))
            )
    }
}
