import request from "../../utils/request";

export const selectTag = () => {
  return request.get("/select/tag");
};
