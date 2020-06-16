import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class  UserRepository extends Repository<User>{
    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO;

        const salt = await bcrypt.genSalt();

        const user = new User();
        
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if(error.code == 23505){
                throw new ConflictException('Username already exists');
            }else{
                throw new InternalServerErrorException();
            }
        }
    }
    
    async validateUserPassword(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
        const { username, password } = authCredentialsDTO;
        const user = await this.findOne({ username });

        if(user && await user.validateUserPassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}