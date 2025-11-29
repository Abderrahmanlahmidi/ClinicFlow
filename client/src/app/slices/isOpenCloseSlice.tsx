import { createSlice } from "@reduxjs/toolkit";

interface OverlayState {
  isOpen: boolean;
}

const initialState: OverlayState = {
  isOpen: false,
};

const isOpenCloseSlice = createSlice({
  name: "isOpenClose",
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.value = action.payload;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggle, setOpen } = isOpenCloseSlice.actions;
export default isOpenCloseSlice.reducer;
