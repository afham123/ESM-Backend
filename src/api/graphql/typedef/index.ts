import { Commenttypedef } from "./comments.typedef"
import { Itemtypedef } from "./Item.typedef"
import { moviesTypedef } from "./movies.typedef"
import { query } from "./query.typedef"
import { userTypedef } from "./user.typedef"


export const typedef = '#graphql'  + moviesTypedef + userTypedef + Commenttypedef + Itemtypedef + query