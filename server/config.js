const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx8fd2e1244baa99df',

    // 微信小程序 App Secret
    appSecret: '5cb581cefa9ab148a0bfb8e1bc5d366d',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    qcloudAppId: '1258248696',
    qcloudSecretId: 'AKIDwpbIpCjROF5lsoqCf1DE6b1JSRGvpmiU',
    qcloudSecretKey: 'mPsALMMhstkRyLZfNvJWYQAnLPJ3c1GK',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx8fd2e1244baa99df',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
