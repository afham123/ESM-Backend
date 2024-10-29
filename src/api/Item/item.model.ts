import {Schema, model, Document}  from 'mongoose';
import {Item} from './item.interface';
import mongoosePaginate from 'mongoose-paginate-v2';

const ItemSchema = new Schema({
    name : {
        type: String,
        require: true
    },
    category: {
        type : String,
        require: true
    },
    company: {
        type: String,
        require: true
    },
    contact_num : {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    location: {
        type: String
    },
    GST_No: {
        type: String
    },
    GST_Turnover: {
        type: String
    },
    Remark: {
        type: String
    },
    Supplier_Type : {
        type: String
    },
    numericId: {
        type: Number,
        default: 0,
        index: true
    },
    EnqDate: {
        type: Date,
        default: new Date()
    },
    status: String

}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        getters: true
    }
})

ItemSchema.plugin(mongoosePaginate);

ItemSchema.pre('save', async function (next) {
    const maxNumber = await ItemModel.findOne().sort({ "numericId": -1 });
    let maxNumberId = 1;

    if (maxNumber && maxNumber.numericId) {
        maxNumberId = maxNumber.numericId + 1;
    }

    const doc = this;
    doc.numericId = maxNumberId;

    next();
});

const ItemModel = model<Item & Document>('Item', ItemSchema);
export default ItemModel;