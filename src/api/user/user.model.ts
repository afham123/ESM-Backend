import {Schema, Document, model} from 'mongoose';
import { User } from './user.interface';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    numericId: Number,
    token: String,
    MFA_Code: String
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        getters: true
    }
})

userSchema.plugin(mongoosePaginate);

userSchema.pre('save', async function (next) {
    const maxNumber = await UserModel.findOne().sort({ "numericId": -1 });
    let maxNumberId = 1;

    if (maxNumber && maxNumber.numericId) {
        maxNumberId = maxNumber.numericId + 1;
    }

    const doc = this;
    doc.numericId = maxNumberId;

    next();
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;