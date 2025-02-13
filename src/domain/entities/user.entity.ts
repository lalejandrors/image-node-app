import {CustomError} from '../errors/custom.error';

export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public password: string,
    ){}

    static fromObject(object: {[key: string]: any}){
        const {id, _id, name, password} = object;

        if(!_id && !id){
            throw CustomError.badRequest('Missing id');
        }

        if(!name) throw CustomError.badRequest('Missing name');
        if(!password) throw CustomError.badRequest('Missing password');

        return new UserEntity(_id || id, name, password);
    }
}