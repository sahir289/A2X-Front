import { createSlice } from "@reduxjs/toolkit";

export const themeChangeSlice = createSlice({
  name: "header",
  initialState: {
    themeColorChange: true,
  },
  reducers: {
    setThemeColor: (state, action) => {
      state.themeColorChange = action.payload;
    },
  },
});

export const { setThemeColor } = themeChangeSlice.actions;

export default themeChangeSlice.reducer;
