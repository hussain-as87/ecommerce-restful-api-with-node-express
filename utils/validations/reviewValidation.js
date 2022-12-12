import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";
import { Review } from "../../models/Review.js";

export const ValidationbodyRulesForCreate = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid Review id format'),
  check('product')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error('You already created a review before')
            );
          }
        }
      )
    ),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
  check('id')
  .isMongoId()
  .withMessage('Invalid Review id format')
  .custom((val, { req }) =>
    // Check review ownership before update
    Review.findById(val).then((review) => {
      if (!review) {
        return Promise.reject(new Error(`There is no review with id ${val}`));
      }
//._id because user obj (populate) and /^find/ pre
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`Your are not allowed to perform this action`)
        );
      }
    })
  ),
  validatorMiddleware,
];

export const ValidationbodyRulesForDelete = [
  check('id')
.isMongoId()
.withMessage('Invalid Review id format')
.custom((val, { req }) => {
  // Check review ownership before update
  if (req.user.role === 'user') {
    return Review.findById(val).then((review) => {
      if (!review) {
        return Promise.reject(
          new Error(`There is no review with id ${val}`)
        );
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`Your are not allowed to perform this action`)
        );
      }
    });
  }
  return true;
}),
  validatorMiddleware,
];


