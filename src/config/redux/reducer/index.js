const initialState = {
    isLogin: false,
    isLoading: false,
    isShown: "hiding",
    isSidebarRendered: false,
    isContactListScreen: true,
    fetchChatUserId: null,
    io: null
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

    if (action.type === "SET_SIDEBAR") {
        return {
            ...state,
            isSidebarRendered: action.value
        }
    }

    if (action.type === "SET_CHAT_SCREEN") {
        return {
            ...state,
            isContactListScreen: action.value
        }
    }

    if (action.type === "SET_IO_CONNECTION") {        
        return {
            ...state,
            io: action.value
        }
    }

    return state;
}

export default reducer;