import gqlAuth from "../../../middleware/gqlAuth.js";
import { MongoService } from "../../../services/Mongoservice.js";
import commentsModel from "../../comment/comment.model.js";
import { addData, deleteItem } from "../../elasticSearch/index.js";
import ItemModel from "../../Item/item.model.js";


export const Mutation = {
    async addComment(_: any, args:any){
        args.comment.movie_id = MongoService.ObjectId(args.comment.movie_id)
        try{
            await MongoService.create(commentsModel, {
                insert : args.comment
            })
            return { success: true };;
        }
        catch(err:any){
            return { success: false, msg: err.message };
        }       
    },
    async addItem(_:any, args:any){
        try{
            const {item, token} = args;
            const isAllowed = await gqlAuth(token)
            if(!isAllowed){
                return { msg: "Session expired", success: false};
            } 
            let Item;
            if(Object.keys(item).includes('_id')){
                console.log('perform edit');
                const {_id} = item;
                delete item['_id'];
                Item = await MongoService.findOneAndUpdate(ItemModel, {
                    query : {_id},
                    updateData : item
                })
                console.log(Item);
            }
            else{
                Item = await MongoService.create(ItemModel, {
                    insert : item
                })
            }
            const id = Item._id.toString();
            addData( id, item)
            return { success: true };
        }
        catch(err:any){
            return { success: false, msg: err.message };
        }
    },
    async deleteItem(_:any, args:any){
        try{
            const {ids, token} = args;
            const isAllowed = await gqlAuth(token)
            if(!isAllowed){
                return { msg: "Session expired", success: false};
            } 
            for(let i=0;i<ids.length;i++){
                const res = await MongoService.deleteOne(ItemModel, {
                    query: {_id:ids[i]}
                })
                await deleteItem(ids[i])
                console.log('delete', res);
            }
            return { success: true };;
            
        }catch(err:any){
            return { success: false, msg: err.message };
        }
    },
    async uploadItems(_: any,args: any){
        try{
            const {Items, token} = args;
            const isAllowed = await gqlAuth(token)
            if(!isAllowed){
                return { msg: "Session expired", success: false};
            } 
            console.log(Items);
            for(let i=0;i<Items.length;i++){
                const ItemDoc = await MongoService.create(ItemModel, {
                    insert : Items[i]
                })
                const id = ItemDoc._id.toString();
                await addData( id, Items[i])
                console.log(ItemDoc);
            }
            
            return { success: true };
        } catch(err:any){
            return { success: false, msg: err.message };
        }
    }
}
