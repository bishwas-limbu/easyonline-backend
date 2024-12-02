import nodemailer from "nodemailer";
import config from "../config/config.js";

export const sendEmail = async (content) => {
    console.log(content);
    const transport = nodemailer.createTransport({
        host: config.EMAIL_SERVER_HOST,
        port: config.EMAIL_SERVER_PORT,
        auth: {
          user: config.EMAIL_SERVER_USER,
          pass: config.EMAIL_SERVER_PASSWORD,
        }
      });

      const messageContent ={
        from : `${config.FROM_NAME}  <${config.FROM_EMAIL}>`,
        to : content.email,
        subject : content.subject,
        text : content.message,
      }
      console.log(messageContent)
      const info =  await transport.sendMail(messageContent);
      console.log(info.messageId);

} 