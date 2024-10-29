import { transporter } from "../config/nodemailer";

interface iEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static async sendConfirmationEmail({ email, name, token }: iEmail) {
    // Send email
    const info = await transporter.sendMail({
      from: "Rekko <rekko@gmail.com>",
      to: email,
      subject: "Rekko - Confirma tu cuenta",
      text: "Confirma tu cuenta",
      html: `
      <h1>Confirma tu cuenta</h1>
      <p>Hola ${name}</p>
      <p>Por favor, haz click en el siguiente enlace para confirmar tu cuenta</p>
      <a href="http://localhost:3000/confirm-account">Confirm your account</a>
      <p>E ingrese el codigo: <b>${token}</b></p>
      <p>Este token es válido por 10 minutos</p>
      `,
    });

    console.log("mensaje enviado", info.messageId);
  }
}
