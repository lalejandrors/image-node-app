import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data/mongo/models/user.model';
import { CustomError } from '../../domain/errors/custom.error';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthService {

    constructor(){}

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({name: registerUserDto.name});
        if(existUser) throw CustomError.badRequest('Username already exist');

        try {
            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            const {password, ...userEntity} = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'abc'
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto){

        const existUser = await UserModel.findOne({name: loginUserDto.name});
        if(!existUser) throw CustomError.badRequest('Username not found');

        const isPasswordMatch = bcryptAdapter.compare(loginUserDto.password, existUser.password);
        if(!isPasswordMatch) throw CustomError.badRequest('Invalid password');

        const {password, ...userEntity} = UserEntity.fromObject(existUser);

        const token = await JwtAdapter.generateToken({id: existUser.id});
        if(!token) throw CustomError.internalServer('Error generating token');
        
        return {
            user: userEntity,
            token: token
        }
    }
}