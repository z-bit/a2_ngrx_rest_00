import {count} from "./sample/redux/countActions"

export function appReducer(state = {}, action) {
    return {
        count: count(state.count, action)
    }
}