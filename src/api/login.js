import request from '@/utils/request'

export function Login(data) {
  return request({
    url: `/login`,
    method: 'post',
    data,
  })
}
export function register(data) {
  return request({
    url: `/register`,
    method: 'post',
    data,
  })
}
