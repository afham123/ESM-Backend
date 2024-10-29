import mongoose from "mongoose";

class UserCommon {
    public userAggregateSample = async (matchQuery: any) => {
        return [
            {
                $match: matchQuery
            }, {
                $lookup: {}
            }
        ]
    }
}