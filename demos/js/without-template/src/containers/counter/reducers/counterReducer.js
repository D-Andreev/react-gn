export default (state = {currentCount: 0}, action) => {
    switch (action.type) {
        case 'COUNT':
            console.log(action.payload)
            return {
                currentCount: ++action.payload
            }
        default:
            return state
    }
}
