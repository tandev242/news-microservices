const nodemailer = require('nodemailer')

const createOutput = (payload) => {
  return `<h2>please send patch request with newPassword to this link in 3 minute to reset password ${payload}<h2>`
}

async function sendMail(email, output) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'testnewsweb221096@gmail.com', // generated ethereal user
        pass: 'newsweb123', // generated ethereal password
      },
    })
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"huy tran 👻" <testnewsweb221096@gmail.com>',
      to: email, // list of receivers
      subject: 'CHANGE PASSWORD FOR NEWS WEB',
      html: output, // html body
    })

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error)
  }
}

module.exports = { sendMail, createOutput }
