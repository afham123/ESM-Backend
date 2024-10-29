import { body } from 'express-validator';
import ERROR_MESSAGES from '../../constant/errorMessage';
import validate from '../../middleware/validate.middleware';

class CommentValidation {

    updateCommmentValidation = () =>
        validate([
            body('id')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'id')
                ),
            body('text')
                .notEmpty()
                .withMessage(
                    ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'text')
                )
        ]);

    createCommentValidation = () =>
        validate([
            body('user_id')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'user_id')),
            body('movie_id')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'movie_id')),
            body('text')
                .notEmpty()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'text'))
        ]);
    deleteCommentValidation = () =>
        validate([
            body('id')
                .notEmpty()
                .isMongoId()
                .withMessage(ERROR_MESSAGES.COMMON.REQUIRED.replace(':attribute', 'id'))
        ])

}

export default CommentValidation;