import paypal from 'paypal-rest-sdk'

// PAYPAL SANDBOX TEST ACCOUNTS

// Seller Account
// pay-facilitator@ollance.com
// 4085071552

// Buyer Account
// pay-buyer@ollance.com
// 4085787751

paypal.configure({
    'mode': process.env.PAYPAL_MODE,
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET_ID
})

// PayPal checkout
// @input: amount, currency, description
// below are demo data for testing
export const paypalMethod = async (req, res) => {
    const orderDetails = JSON.stringify({
        'intent': 'sale',
        'redirect_urls': {
            'return_url': 'http://localhost:3000/checkout/processing', // process.env.PAYPAL_RETURN_URL
            'cancel_url': 'http://localhost:3000/checkout/failed' // process.env.PAYPAL_CANCEL_URL
        },
        'payer': {
            'payment_method': 'paypal'
        },
        'transactions': [{
            'amount': {
                'total': 30, // req.total
                'currency': 'USD' // req.currency
            },
            'description': 'description for your product' // req.description
        }]
    })

    // create order
    paypal.payment.create(orderDetails, (err, payment) => {
        if (err) {
            console.log(err)
        } else {
            // capture HATEOAS links
            const links = {}
            payment.links.forEach(linkObj => {
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                }
            })

            // if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')) {
                res.redirect(links['approval_url'].href)
            } else {
                console.log('no redirect URI present')
            }
        }
    })
}

export const processing = (req, res) => {
    var paymentId = req.query.paymentId
    var payerId = { 'payer_id': req.query.PayerID }

    paypal.payment.execute(paymentId, payerId, (err, payment) => {
        if (err) {
            console.log(err)
        } else {
            if (payment.state == 'approved') {
                res.redirect(301, '/checkout/success')
            } else {
                res.redirect(301, '/checkout/failed')
            }
        }
    })
}

export const success = (req, res) => {
    console.log(res)
    res.status(200).send('paypal successful')
}

export const failed = (req, res) => {
    console.log(res)
    res.status(400).send('paypal failed')
}