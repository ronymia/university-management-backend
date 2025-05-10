import express from 'express';
import { AuthControllers } from './auth.controller';
const router = express.Router();

router.post(
  '/login',
  // validateRequest(AuthValidation.loginZodSchema),
  AuthControllers.loginUser
);
router.post(
  '/refresh-token',
  //   validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthControllers.refreshToken
);

router.post(
  '/change-password',
  //   validateRequest(AuthValidation.changePasswordZodSchema),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
