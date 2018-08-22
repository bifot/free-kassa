const axios = require('axios')
const qs = require('qs')
const md5 = require('md5')

class Wallet {
  constructor(walletId, walletToken) {
    this.walletId = walletId
    this.walletToken = walletToken
    this.axios = axios.create({
      baseURL: 'https://www.fkwallet.ru/api_v1.php'
    })
  }

  async getBalance() {
    const { data } = await this.axios.post('/', qs.stringify({
      wallet_id: this.walletId,
      sign: md5([this.walletId, this.walletToken].join('')),
      action: 'get_balance',
    }))

    return data
  }

  async sendMoney({ wallet, amount, currency, description }) {
    const { data } = await this.axios.post('/', qs.stringify({
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

module.exports = Wallet
