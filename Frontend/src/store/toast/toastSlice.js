import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  messages: [], // { id, type, message, duration }
};

let nextToastId = 0;

// Slice
const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { type = 'info', message, duration = 5000 } = action.payload;
      const id = nextToastId++;
      state.messages.push({ id, type, message, duration });
    },
    removeToast: (state, action) => {
      state.messages = state.messages.filter((msg) => msg.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.messages = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;

// Selectors
export const selectToasts = (state) => state.toast.messages;

// Helper para disparar toasts desde thunks
export const showToast = (dispatch, message, type = 'info', duration = 5000) => {
  dispatch(addToast({ type, message, duration }));
};
