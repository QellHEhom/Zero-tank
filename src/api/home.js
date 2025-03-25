import request from '@/utils/request'
// 获取文章列表
export function getArticleList(page) {
  return request({
    url: '/article/list',
    method: 'get',
    params: { page: page },
  })
}

// 获取文章详情
export function getArticle(id) {
  return request({
    url: '/article/post',
    method: 'get',
    params: { id },
  })
}
// 获取轮播图
export function getBanner() {
  return request({
    url: '/banner',
    method: 'get',
  })
}

// 获取网站配置
export function getWebConfig() {
  return request({
    url: '/webConfig',
    method: 'get',
  })
}
