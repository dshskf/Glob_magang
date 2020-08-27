const initialState = {
    isLogin: false,
    isLoading: false,
    isShown: "hiding",
    fetchChatUserId: null
}

const reducer = (state = initialState, action) => {
    if (action.type === 'CHANGE_IS_LOGIN') {
        return {
            ...state,
            isLogin: action.value
        }
    }
    if (action.type === 'CHANGE_LOADING') {
        return {
            ...state,
            isLoading: action.value
        }
    }
    if (action.type === "CHANGE_IS_SHOWN") {

        return {
            ...state,
            isShown: action.value
        }
    }
    if (action.type === "CHANGE_FETCH_CHAT_USER") {     
        return {
            ...state,
            fetchChatUserId: action.value
        }
    }
    return state;
}

export default reducer;