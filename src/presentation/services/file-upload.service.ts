import path from 'path';
import fs from 'fs';
import {UploadedFile} from 'express-fileupload';
import { Storage } from '@google-cloud/storage';
import { Uuid } from '../../config/uuid.adapter';
import { CustomError } from '../../domain/errors/custom.error';

export class FileUploadService {

    private storage: Storage;
    private bucketName: string;

    constructor(
        private readonly uuid = Uuid.v4
    ){
        this.storage = new Storage({
            keyFilename: path.join(__dirname, '../../../gcp_key/image-node-app-b2854568b1be.json'), // Path to your GCP service account JSON key
        });
        this.bucketName = 'image-node-app-bucket';
    }

    private checkFolder(folderPath: string){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            if(!validExtensions.includes(fileExtension)){
                throw CustomError.badRequest(`Invalid file extension: ${fileExtension}, valid ones are: ${validExtensions}`);
            }
            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);

            // Upload to GCP
            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(`${folder}/${fileName}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (err) => reject(err));
                blobStream.on('finish', async () => {
                    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${folder}/${fileName}`;
                    resolve({ fileName, publicUrl });
                });

                blobStream.end(file.data); // Upload file buffer to GCP
            });
            //

            //return {fileName};
        } catch (error) {
            //console.log({error});
            throw error;
        }
    }
}