const axios = require('axios')
const qs = require('qs')
const md5 = require('md5')

module.exports = class FreeKassa {
  constructor({
    firstSecret, secondSecret, merchantId, walletToken, walletId,
  }) {
    if (!firstSecret) {
      throw new Error('firstSecret is required param')
    } else if (!secondSecret) {
      throw new Error('secondSecret is required param')
    } else if (!merchantId) {
      throw new Error('merchantId is required param')
    } else if (!walletToken) {
      throw new Error('walletToken is required param')
    } else if (!walletId) {
      throw new Error('walletId is required param')
    }

    this.firstSecret = firstSecret
    this.secondSecret = secondSecret
    this.merchantId = merchantId
    this.walletToken = walletToken
    this.walletId = walletId
  }

  getForm(orderAmount, orderId) {
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
      this.firstSecret,
      orderId,
    ].join(':'))
  }

  getPaymentSign(orderAmount, orderId) {
    return md5([
      this.merchantId,
      orderAmount,
      this.secondSecret,
      orderId,
    ].join(':'))
  }

  async getBalance() {
    const { data } = await axios.post('https://www.fkwallet.ru/api_v1.php', qs.stringify({
      wallet_id: this.walletId,
      sign: md5([this.walletId, this.walletToken].join('')),
      action: 'get_balance',
    }))

    return data
  }

  async sendPayment({
    wallet, amount, currency, description,
  }) {
    const { data } = await axios.post('https://www.fkwallet.ru/api_v1.php', qs.stringify({
      wallet_id: this.walletId,
      purse: wallet,
      desc: description,
      action: 'cashout',
      sign: md5([
        this.walletId,
        currency,
        amount,
        wallet,
        this.walletToken,
      ].join('')),
      currency,
      amount,
    }))

    return data
  }
}
