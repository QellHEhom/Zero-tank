/** @/store/index.js */
import { createSlice } from "@reduxjs/toolkit";
const ImgManage = createSlice({
  name: "ImgManage",
  initialState: {
    newImgUrl: "",
  },
  reducers: {
    changeImg(state, action) {
      state.newImgUrl = action.payload;
    },
  },
});

export const { changeImg } = ImgManage.actions;
export default ImgManage;
