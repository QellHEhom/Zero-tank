import { configureStore } from "@reduxjs/toolkit";
import ImgManage from "./ImgManage/index";

export default configureStore({
  reducer: {
    ImgManage: ImgManage.reducer,
  },
});
