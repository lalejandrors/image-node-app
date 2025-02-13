export class RegisterUserDto {

    private constructor(
        public name: string,
        public password: string
    ){}

    static create(object: {[key: string]: any}): [string?, RegisterUserDto?]{
        const {name, password} = object;

        if(!name) return ['Missing name'];
        if(!password) return ['Missing password'];
        if(password.length < 6) return ['Password must be at least 6 characters long'];

        return [undefined, new RegisterUserDto(name, password)];
    }
}