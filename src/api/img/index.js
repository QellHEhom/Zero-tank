import request from "../../utils/request";

export function upLodeImg(data) {
  return request.post("/uplode", data, {
    "Content-Type": "multipart/form-data",
  });
}
export function  upLodeBanner(data) {
  return request.post("/Banner", data, {
    "Content-Type": "multipart/form-data",
  });
}

export function upLodeAuthor(data) {
  return request.post("/User", data, {
    "Content-Type": "multipart/form-data",
  });
}
