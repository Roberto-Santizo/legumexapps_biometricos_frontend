import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/features/auth/auth";

interface AuthState {
    isSignedIn: boolean;
    user?: AuthUser;
}

const initialState: AuthState = {
    isSignedIn: false,
    user: undefined
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isSignedIn = false;
            state.user = undefined;
            localStorage.removeItem('AUTH_TOKEN');
        },

        login: (state, actions: PayloadAction<AuthUser>) => {
            state.user = actions.payload;
            state.isSignedIn = true;
            localStorage.setItem('AUTH_TOKEN', actions.payload.token);
        }
    }
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;