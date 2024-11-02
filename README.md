# Enterprise Supplier Management App-Backend

The **Enterprise Supplier Management** web application enables enterprises to securely store, manage, and organize supplier data in the cloud. Users can apply filters, perform both simple and advanced searches, and easily add, update, or delete records as needed. The application includes a secure login system with session-based access that expires after 24 hours, ensuring data safety and access control. With the help of GQL APIs, administrators can retrieve only the data they require from the server, thereby optimizing network bandwidth and enhancing overall performance.

![image](https://github.com/user-attachments/assets/b6aca9e2-cd00-4560-a1fd-a409dbb52939)

The backend server for the application is built using **Node.js** and **TypeScript**, providing a scalable foundation for network applications. **Express.js** handles server setup, while **MongoDB** is used for data storage. We integrated **Elasticsearch** as a search engine to support both basic and advanced search functionalities. **JWT** is employed for token-based authentication, enabling two-factor authentication, with **Nodemailer** facilitating email delivery. We use **express-validator** to enforce a robust validation chain.

Our API design follows a structured **Model-Controller-Validator** pattern, supported by interfaces for consistency and maintainability. Logging is managed with the **Winston** library, and **Apollo Server** powers our GraphQL APIs. **Mongoose** is used for seamless MongoDB interactions, ensuring efficient data handling across the application.

For **Security**, we validate the user's email and password during login, then send an MFA code to their email. Once the correct MFA code is returned, we generate a 24-hour **JWT token** using the user’s ID and secret key. This token is stored on the client and sent with each API request for authentication. Expiring daily, it requires the user to log in every 24 hours.
