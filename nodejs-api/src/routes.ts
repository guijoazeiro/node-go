import { Router } from 'express';
import userRouter from './modules/user/routes/UserRouter';
import productRouter from './modules/product/routes/ProductRouter';
import orderRouter from './modules/order/routes/OrderRouter';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/product', productRouter);
routes.use('/order', orderRouter);

export default routes;
