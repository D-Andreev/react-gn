
export const count = (currentCount) => dispatch => {
    console.log({currentCount})
    dispatch({
        type: 'COUNT',
        payload: currentCount
    });
}
