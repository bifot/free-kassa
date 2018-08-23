const axios = require('axios')
const md5 = require('md5')
const xml2js = require('xml2js')
const util = require('util')

xml2js.parseString = util.promisify(xml2js.parseString)

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

  getPaymentSign(orderAmount, orderId) {
    return md5([
      this.merchantId,
      orderAmount,
      this.secrets[1],
      orderId,
    ].join(':'))
  }

  async getBalance() {
    const { data } = await this.axios.get('/', {
      params: {
        merchant_id: this.merchantId,
        s: md5([
          this.merchantId,
          this.secrets[1]
        ].join('')),
        action: 'get_balance',
      },
    })
    const { root } = await xml2js.parseString(data)

    return Object.entries(root)
      .map(([key, value]) => ({ [key]: value[0] }))
      .reduce((a, b) => ({ ...a, ...b }))
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
