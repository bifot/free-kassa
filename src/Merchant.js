const axios = require('axios')
const md5 = require('md5')

class Merchant {
  constructor(merchantId, secrets) {
    this.merchantId = merchantId
    this.secrets = secrets
    this.axios = axios.create({
      baseURL: 'http://www.free-kassa.ru/api.php',
    })
  }

  getFormURL(orderAmount, orderId) {
    return 'http://www.free-kassa.ru/merchant/cash.php'
      + `?m=${this.merchantId}`
      + `&oa=${orderAmount}`
      + `&o=${orderId}`
      + `&s=${this.getFormSign(orderAmount, orderId)}`
  }

  getFormSign(orderAmount, orderId) {
    return md5([
      this.merchantId,
      orderAmount,
      this.secrets[0],
      orderId,
    ].join(':'))
  }

  async sendMoney({ currency, amount }) {
    const { data } = await axios.get('/', {
      params: {
        currency,
        amount,
        s: md5([
          this.merchantId,
          this.secrets[1],
        ]).join(''),
        action: 'payment',
      },
    })

    return data
  }
}

module.exports = Merchant
