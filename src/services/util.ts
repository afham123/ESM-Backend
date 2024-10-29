import * as jwt from 'jsonwebtoken'
const user = process.env.Nodemail_email

const genToken = async (data: { _id: string }) => {
    const JWT_SECRET = process.env.JWT_SECRET ?? ""
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '24h' });
    return token;
}
export const genMFACode = () => Math.floor(100000 + Math.random() * 900000);

export const mailOption = ( authCode:string, recipient: string)=> {
    const userName = 'Admin';
    return {
        from: user,
        to: recipient,
        subject: 'Two factor Othentication', // Subject line
        text: `Hello ${userName},
      
      Here is your authentication code:
      
      ${authCode}
      
      This code is valid for 10 minutes. Please do not share it with anyone for security purposes.
      
      Best regards,
      Mahavir Agencies`,
          
        html: `<p>Hello <strong>${userName}</strong>,</p>
                 <p>Here is your authentication code:</p>
                 <h2 style="color: #2e86c1;">${authCode}</h2>
                 <p>This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone for security purposes.</p>
                 <br>
                 <p>Best regards,</p>
                 <p>Mahavir Agencies</p>`, // Plain text body
      }
}
export default genToken;