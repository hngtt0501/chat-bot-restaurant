import express from 'express'
import HomeController from '../controllers/HomeController'
let router = express.Router();

let initWebRoutes = (app)=>{
     router.get('/', HomeController.getHomePage);
   
    router.post('/setup-profile', HomeController.setupProfile);
    router.post('/setup-persistent-menu',HomeController.setupPersistentMenu)
    router.post('/webhook',HomeController.postWebhook);
    router.get('/webhook',HomeController.getWebhook);
    router.get('/reserve-table',HomeController.handleReserveTable);
    router.post('/reserve-table-ajax',HomeController.handlePostReserveTable);



    return app.use('/',router);
}
module.exports =initWebRoutes;   