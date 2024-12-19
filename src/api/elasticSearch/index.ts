import axios, { AxiosInstance } from "axios";
import { authInterface } from "./interface";
import https from "https";
import logger from "../../logger";
import { formatDateString } from "../../services/util";
const username = process.env.ElasticSearch_username || "";
const password = process.env.ElasticSearch_password || "";
const ElasticSearch_url = process.env.ElasticSearch_url || "";

class elasticSearchClass {
    private auth: authInterface;
    private axiosInstance: AxiosInstance;
    constructor() {
        this.auth = { username, password }

        this.axiosInstance = axios.create({
            baseURL: ElasticSearch_url,
            auth: this.auth,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disable SSL verification
        });
    }
    async addData(id: string, data: any) {
        try {
            logger.info('elasticsearch add data', data);
            if (data.EnqDate == '')
                data.EnqDate = formatDateString()

            logger.info('after format add data', data);

            const response = await this.axiosInstance.put(`ma_dict/_doc/${id}`, data)
            logger.info('Response addData data:', response.data);
        }
        catch (error: any) {
            if (error.response) {
                logger.error('Error response data:', JSON.stringify(error.response.data));
                logger.error('Error status:', error.response.status);
                logger.error('Error headers:', error.response.headers);
            } else logger.error('Error message:', error.message);
            logger.error('Error making addData request:', error.message);
        };
    }
    async deleteItem(id: string) {
        try {
            const response = await this.axiosInstance.delete(`ma_dict/_doc/${id}`);
            console.log('response deleteItem Data', response);
        }
        catch (error: any) {
            if (error.response) {
                logger.error('Error response data:', JSON.stringify(error.response.data));
                logger.error('Error status:', error.response.status);
                logger.error('Error headers:', error.response.headers);
            } else logger.error('Error message:', error.message);
            logger.error('Error making deleteItem request:', error.message);
        };
    }
    async searchQuery(searchString: string, AdvanceQuery: any, limit: number){
        const { MatchPhrase, Location, name, SupplierType, Remark } = AdvanceQuery;
            console.log(AdvanceQuery);
            let query;
            if (MatchPhrase) {
                query = {
                    size: limit,
                    query: {
                        multi_match: {
                            query: MatchPhrase,
                            type: "phrase",     // Use phrase match
                            fields: ["*"]       // Search across all fields
                        }
                    }
                }
            }
            else {
                let fields = ["*"];
                if (Location || name || SupplierType || Remark) {
                    searchString = "";
                    fields = ['location', 'name', 'Supplier_Type', 'Remark'];
                    if (Location) searchString += `location:${Location} `;
                    if (name) searchString += (searchString ? 'AND' : "") + ` name:${name} `
                    if (SupplierType) searchString += (searchString ? 'AND' : "") + ` Supplier_Type:${SupplierType} `
                    if (Remark) searchString += (searchString ? 'AND' : "") + ` Remark:${Remark}`
                }
                query = {
                    size: limit,
                    query: {
                        query_string: {
                            query: searchString,
                            fields: fields // Search across all fields_search?scroll=60m
                        }
                    }
                };
            }
            console.log(query);
            const response = await this.axiosInstance.post(`ma_dict/_search?scroll=60m`, {
                ...query,
                track_total_hits: true
            });
            const data:object[] = response.data.hits.hits.map((e: any) => {
                const data = e._source;
                return { ...data, _id: e._id }
            })
            return { data, totalDocs: response.data.hits.total.value, scroll_id: '' }

    }

    async searchAllFields(searchString: string, AdvanceQuery: any, skip: number, limit: number) {
        try {
            // if (scroll_id !== "") return await this.Extendedscroll(scroll_id);
            const skipRes = await this.searchQuery(searchString, AdvanceQuery, skip+limit);
            const data = skipRes.data.slice(skip);
            const totalDocs = skipRes.totalDocs;
            return {data, totalDocs, scroll_id: ''};     
        }
        catch (error: any) {
            if (error.response) {
                logger.error('Error response data:', JSON.stringify(error.response.data));
                logger.error('Error status:', error.response.status);
                logger.error('Error headers:', error.response.headers);
            } else logger.error('Error message:', error.message);
            logger.error(`Some error in the SearchSimpleQuery ${error.message}`);
        }
    }

    async Extendedscroll(scroll_id: string) {
        try {
            console.log(scroll_id);
            const scrollQuery = {
                scroll_id,
                scroll: "60m"
            }
            const response = await this.axiosInstance.post(`_search/scroll`, scrollQuery)
            console.log('response', response);
            const data = response.data.hits.hits.map((e: any) => {
                const data = e._source;
                return { ...data, _id: e._id }
            })
            return { data, totalDocs: response.data.hits.total.value, scroll_id: response.data._scroll_id }
        }
        catch (error: any) {
            if (error.response) {
                logger.error('Error response data:', JSON.stringify(error.response.data));
                logger.error('Error status:', error.response.status);
                logger.error('Error headers:', error.response.headers);
            } else logger.error('Error in extended scroll Error message:', error.message);
        }
    }
}
// enquire date range
// search item
// search company
// strong search
// scroll

const elasticSearchInstance = new elasticSearchClass();
export const searchAllFields = elasticSearchInstance.searchAllFields.bind(elasticSearchInstance);
export const Extendedscroll = elasticSearchInstance.Extendedscroll.bind(elasticSearchInstance);
export const addData = elasticSearchInstance.addData.bind(elasticSearchInstance);
export const deleteItem = elasticSearchInstance.deleteItem.bind(elasticSearchInstance);