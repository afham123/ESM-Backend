import { body } from 'express-validator';
import ERROR_MESSAGES from '../../constant/errorMessage';
import validate from '../../middleware/validate.middleware';

class ItemValidation {

    updateItemValidation = () =>
        validate([
            body('id')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item_Id')
                )
        ]);

    createItemValidation = () =>
        validate([
            body('name')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item Name')),
                body('category')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item category')),
                body('company')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item company')),
                body('contact_num')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item contact_num')),
                body('email')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item email'))

        ]);
    deleteItemValidation = () =>
        validate([
            body('id')
                .notEmpty()
                .isMongoId()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'Item_Id'))
        ])
}

export default ItemValidation;