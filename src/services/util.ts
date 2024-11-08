import * as jwt from 'jsonwebtoken'

const genToken = async (data: { _id: string }) => {
    const JWT_SECRET = process.env.JWT_SECRET ?? ""
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });
    return token;
}
export const genMFACode = () => Math.floor(100000 + Math.random() * 900000);
export function formatDateString() {
  // Convert the date string to a Date object
  const date = new Date();

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  // Format as 'dd-mm-yyyy'
  return `${year}-${month}-${day}`;
}
export function formatDate(timestamp:string) {
  // Convert timestamp to a Date object
  const date = new Date(timestamp);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  // Format as 'dd-mm-yyyy'
  return `${day}-${month}-${year}`;
}
export function formatDataObj(date: Date){
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const mailOption = ( authCode:string, recipient: string)=> {
    const userName = 'Admin user';
    return {
        from: 'sales@mahavir-agencies.com',
        to: recipient,
        subject: 'Two factor Authentication', // Subject line
        text: `Hello ${userName},
      
      Here is your authentication code:
      
      ${authCode}
      
      This code is valid for 10 minutes. Please do not share it with anyone for security purposes.
      
      Best regards,
      Mahavir Agencies`,
          
        html: `<p>Hello <strong>${userName}</strong>,</p>
                 <p>Here is your authentication code:</p>
                 <h2 style="color: #2e86c1;">${authCode}</h2>
                 <p>This code is valid for <strong>1 hours</strong>. Please do not share it with anyone for security purposes.</p>
                 <br>
                 <p>Best regards,</p>
                 <p>Mahavir Agencies</p>`, // Plain text body
      }
}
export default genToken;