# free-kassa

[Free Kassa](http://www.free-kassa.ru/) (Merchant & Wallet) API.

## Install

```sh
$ npm i free-kassa -S
```

## Methods

### constructor(settings)

Create instance of FreeKassa.

* `settings` - object settings
    * `firstSecret` - first secret of your merchant
    * `secondSecret` - second secret of your merchant
    * `merchantId` - merchant's id
    * `walletToken` - wallet's token
    * `walletId` - wallet's id

### .getForm(orderAmount, orderId)

Returns a URL to payment form.

### .getFormSign(orderAmount, orderId)

Returns a sign for payment form.

### .getPaymentSign(orderAmount, orderId)

Returns a sign for payment.

### .getBalance() ⇒ `[Promise]`

Returns a wallet's balance.

### .sendPayment(settings) ⇒ `[Promise]`

Send payment to the user.

* `settings` - object settings
    * `wallet` - receiver's wallet
    * `amount` - payment's amount
    * `currency` - payment's currency
    * `description` - payment's description
    
## License

MIT.
