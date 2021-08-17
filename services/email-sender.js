const sgMail = require('@sendgrid/mail')
require ('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL = process.env.EMAIL;


class CreateSenderSendGrid{
    async send(msg){
        sgMail.setApiKey(SENDGRID_API_KEY)
return await sgMail.send({...msg, from: EMAIL})
    }


}
module.exports = CreateSenderSendGrid;