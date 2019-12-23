'use strict'
const crypto = require('crypto')
const moment = require('moment')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message.to(user.email).from('manoelgomes53@gmail.com', 'Manoel Gomes').subject('Recuperação de senha')
        }
      )

      await user.save()
    } catch (e) {
      return response.status(e.status).send({ error: 'Email is not exists!' })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)
      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: 'Token is expired!' })
      }

      user.token = null
      user.password = password
      await user.save()
      return response.send({ ok: 'Your password has been reset!' })
    } catch (e) {
      return response.status(e.status).send({ error: 'Token is not provider!' })
    }
  }
}

module.exports = ForgotPasswordController
