import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class FileUploadRoutes {

  static get routes(): Router {
    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles);
    
    // Definir las rutas
    router.post('/:type', [AuthMiddleware.validateJWT], controller.uploadFile);

    return router;
  }
}