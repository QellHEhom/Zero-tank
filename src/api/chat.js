import request from '@/utils/request'

export function sendMsg(data) {
  return request({
    url: `/Ai`,
    method: 'post',
    data,
  })
}
export function getRecords() {
  return request({
    url: `/records`,
    method: 'get',
  })
}
