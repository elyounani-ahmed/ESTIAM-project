import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { user } from 'src/user/models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

constructor(private readonly jwtService: JwtService){}

generateJWT(user: user): Observable <string> {
    return from(this.jwtService.signAsync({user}));

}

hashPassword(password: string): Observable <string>{

    return from<string>(bcrypt.hash(password, 12));
}

comparePasswords(newPassword: string, passwortHash: string): Observable <any | boolean>{
    return of<any | boolean>(bcrypt.compare(newPassword, passwortHash));


}

}
