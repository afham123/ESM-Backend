export interface User {
    _id: string,
    name: String,
    email: String,
    password: String,
    numericId: number,
    token: String,
    MFA_Code:String
}