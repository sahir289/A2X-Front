import { createSlice } from '@reduxjs/toolkit';

export const merchantSlice = createSlice({
  name: 'merchant',
  initialState: {
    data: [],
  },
  reducers: {
    initMerchants: (state, action) => {
      state.data = action.payload;
    },
  }
})

export const { initMerchants } = merchantSlice.actions;
export default merchantSlice.reducer
