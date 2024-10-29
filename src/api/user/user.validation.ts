import { body } from 'express-validator';
import ERROR_MESSAGES from '../../constant/errorMessage';
import validate from '../../middleware/validate.middleware';

class UserValidation {
    getUserProfileValidation = () =>
        validate([
            body('email')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'email')
                ),
            body('password')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'password')
                )
        ]);
    
    getverify_MFAValidation = () =>
            validate([
                body('email')
                    .notEmpty()
                    .withMessage(
                        ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'email')
                    ),
                body('password')
                    .notEmpty()
                    .withMessage(
                        ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'password')
                    ),
                body('MFA_Code')
                    .notEmpty()
                    .withMessage(
                        ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'MFA_Code')
                    )
            ]);

    updateUserProfileValidation = () =>
        validate([
            body('userId')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'userId')
                )
        ]);

    createUserProfile = () =>
        validate([
            body('name')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'name')),
            body('email')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'email')),
            body('password')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'password'))
        ]);
    deleteUserProfileValidation = () =>
        validate([
            body('userId')
                .notEmpty()
                .isMongoId()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'userId'))
        ])

}

export default UserValidation;