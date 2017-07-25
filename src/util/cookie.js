/**
 * Created by fWind on 2017/7/25.
 */
/**
 * 保存cookie信息
 * @param name
 * @param value
 * @param exdays 过期时间
 */
exports.setCookie = function (name, value, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  console.info(name + '=' + value + '; ' + expires)
  document.cookie = name + '=' + value + '; ' + expires
  console.info(document.cookie)
}

/**
 * 获取cookie内容
 * @param cName
 * @returns {*}
 */
exports.getCookie = function (name) {
  let n = name + '='
  let list = document.cookie.split(';')
  for (var i = 0; i < list.length; i++) {
    let l = list[i]
    while (l.charAt(0) === ' ') l = l.substring(1)
    if (l.indexOf(n) !== -1) return l.substring(n.length, l.length)
  }
  return ''
}

/**
 * 清除用户cookie信息
 */
exports.clearCookie = function () {
  this.setCookie('userid', '', -1)
  this.setCookie('username', '', -1)
}

/**
 * 检查cookie
 * 没啥用，先放着吧
 */
exports.checkCookie = function () {
  var user = this.getCookie('userid')
  if (user !== '') {
    alert('Welcome again ' + user)
  } else {
    user = prompt('Please enter your name:', '')
    if (user !== '' && user !== null) {
      this.setCookie('userid', user, 365)
    }
  }
}
