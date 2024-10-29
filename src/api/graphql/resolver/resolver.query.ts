import gqlAuth from "../../../middleware/gqlAuth.js"
import { MongoService } from "../../../services/Mongoservice.js"
import { Comment } from "../../comment/comment.interface.js"
import commentsModel from "../../comment/comment.model.js"
import { searchAllFields } from "../../elasticSearch/index.js"
import ItemModel from "../../Item/item.model.js"
import MovieModel from "../../movie/movie.model.js"
import UserModel from "../../user/user.model.js"
import { id } from "./resolver.interface.js"

export const Query = {
    async movies(_: any, { skip = 0, limit = 10 }) {
        // await addUserId();
        return await MongoService.find(MovieModel, {
            query : {  },
            limit : limit,
            offset : skip
        })
    },
    async movie(_: any, {id}:id) {
        return await MongoService.findOne(MovieModel, {
            query : { _id : id}
        })
    },
    async comments(_: any, {skip = 0, limit = 10}) {
        return await MongoService.find(commentsModel, {
            query : {  },
            limit : limit,
            offset : skip
        })
    },
    async comment(_: any, {id}:id){
        return await MongoService.findOne(commentsModel, {
            query : { _id:id}
        })
    },
    async users(_: any, {skip = 0, limit = 10}){
        return await MongoService.find(UserModel, {
            query : {},
            limit : limit,
            offset : skip
        })
    },
    async user(_: any, {id}:id){
        return await MongoService.findOne(UserModel, {
            query : { _id:id}
        })
    },
    async items(_: any, { skip = 0, limit = 10, searchQuery ="", scroll_id="", AdvanceQuery={}, token=""}): Promise<Object>{
        try{
            const isAllowed = await gqlAuth(token)
            if(!isAllowed){
                return { message: "Session expired", success: false, data: null, totalDocs: null, scroll_id: null };
            } 
            if(searchQuery!="" || Object.keys(AdvanceQuery).length!=0){
                const data = await searchAllFields(searchQuery, scroll_id, AdvanceQuery)
                return {...data, message:"Sucess", success : true};
            }
            const data = await MongoService.find(ItemModel, {
                query : {},
                limit : limit,
                offset : skip
            })
            const totalDocs = await MongoService.find(ItemModel, {query : {}});
            return {data, totalDocs : totalDocs.length, message:"Sucess", success : true}
        }
        catch(error){
            console.error("Error fetching items:", error);
            return { message: "An error occurred", success: false, data: null, totalDocs: null, scroll_id: null };
        }
    },
    async item(_:any,{id}:id){
        return await MongoService.findOne(ItemModel, {
            query : {_id:id}
        })
    },
    async totalItem(){
        const docs = await MongoService.find(ItemModel, {
            query : {}
        });
        return docs?.length;
    }
}

async function addUserId(){
    const comments = await MongoService.find(commentsModel, {});
    let updatedDoc = 0;
    
    comments.forEach(async (doc:Comment) => {
        const {name, email} = doc;
        const userDoc = await MongoService.findOne(UserModel, {
            query : {
                name, email
            }
        })  
        if(userDoc) {
            MongoService.findOneAndUpdate(commentsModel, {
                query : {_id:doc._id},
                updateData : {user_id : userDoc._id}
            }).then((res)=>{
                console.log(updatedDoc++);
            })
        }
    });
}