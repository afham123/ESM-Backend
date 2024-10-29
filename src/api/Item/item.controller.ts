import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '../../constant'
import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../../middleware/auth.midlleware';
import { Controller } from '../interface';
import { MongoService } from '../../services/Mongoservice';
import { errorMiddleware, successMiddleware } from '../../middleware/responseAPI.middleware';
import logger from '../../logger';
import ItemValidation from './item.validation';
import ItemModel from './item.model';

class itemController implements Controller {
    public router = Router();
    public path = `/ITEM`;
    private validation = new ItemValidation();  // need to change this.

    private Item = ItemModel

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(
            `${this.path}/createItem`,
            authMiddleware,
            this.validation.createItemValidation(),
            this.createItem
        );

        this.router.post(
            `${this.path}/updateItem`,
            authMiddleware,
            this.validation.updateItemValidation(),
            this.updateItem
        );
        this.router.post(
            `${this.path}/deleteItem`,
            authMiddleware,
            this.validation.deleteItemValidation(),
            this.deleteItem
        );
    }

    private updateItem = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.body;
            const data = request.body;
            delete data.id;

            const Item = await MongoService.findOne(this.Item, {
                query: { _id: id }
            });

            let updatedItem;
            if (!Item) {
                response.statusCode = STATUS_CODE.BAD_REQUEST;
                throw new Error(
                    ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', 'Item')
                );
            }

            else {
                updatedItem = await MongoService.findOneAndUpdate(this.Item, {
                    query: { _id: id },
                    updateData: {data}
                })
            };

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.UPDATE_SUCCESS.replace(':attribute', 'Item'),
                    data: updatedItem
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue into updating an user Item: ${error}`);
            return next(error);
        }
    }

    private createItem = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            let data = request.body;

            const ItemDoc = await MongoService.create(this.Item, { 
                insert: data
            });

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.CREATE_SUCCESS.replace(':attribute', 'Item'),
                    data: ItemDoc
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in creating Item: ${error}`);
            return next(error);
        }
    }

    private deleteItem = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.body;

            const Item = await MongoService.findOne(this.Item, {
                query: { _id: id }
            });
            if (!Item) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', 'Item'),
                    },
                    request,
                    response,
                    next
                );
            }

            const deletedItem = await MongoService.findByIdAndDelete(this.Item, {
                query: { _id: id }
            })

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.DELETE_SUCCESS.replace(':attribute', 'Item'),
                    data: { deletedItem }
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in deleting Item.: ${error}`);
            return next(error);
        }
    }
}

export default itemController;