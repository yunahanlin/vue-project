const _baseUrl1 = 'https://www.vue-js.com/api/v1/topic/'
const _baseUrl2 = 'https://www.vue-js.com/api/v1/reply/'
const _baseUrl3 = 'https://www.vue-js.com/api/v1/accesstoken'
const _baseUrl4 = 'https://www.vue-js.com/api/v1/user/'

export default {
    getCommentReply (id, token, content, reply_id) {
        return _baseUrl1 + id + '/replies' + '?accesstoken=' + token + '&content' + content + '&reply_id' + reply_id
    },
    getAccessToken (token) {
        return _baseUrl3 + '?accesstoken=' + token
    },
    getUser (loginname) {
        return _baseUrl4 + loginname
    }
}
