import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";

export class ImageController {

    private bucketName: string;

    constructor(){
        this.bucketName = 'image-node-app-bucket';
    }

    getImage = (req: Request, res: Response) => {
        const {type = '', img = ''} = req.params;
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        console.log(imagePath);

        if(!fs.existsSync(imagePath)){
            return res.status(404).send('Image not found');
        }

        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/uploads/${type}/${img}`;
        return res.json({publicUrl});
        //res.sendFile(imagePath);
    }
}