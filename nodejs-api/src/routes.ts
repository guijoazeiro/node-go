import { Router } from 'express';
import userRouter from './modules/user/routes/UserRouter';
import productRouter from './modules/product/routes/ProductRouter';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/product', productRouter);

export default routes;
