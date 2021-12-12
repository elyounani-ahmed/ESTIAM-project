import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity'; 
import { user, UserRole } from '../models/user.interface';
import {paginate,Pagination,IPaginationOptions,} from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository <UserEntity>,
        private authService: AuthService
    ) {}

    create(user: user): Observable<user>{
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role= UserRole.USER;

                return from(this.userRepository.save(newUser)).pipe(
                    map ((user: user) =>{
                        const   {password, ...result} = user;
                        return result;
                    
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
        //return from(this.userRepository.save(user));
    }   

    findOne(id: number):Observable<user>{
        return from(this.userRepository.findOne({id})).pipe(
            map ((user: user) => {
                const {password, ...result} = user;
                return result;
            })
        )
    }

    findall ():Observable<user[]>{
        return from(this.userRepository.find()).pipe(
            map((user: user []) =>{
                user.forEach(function (v)  {delete v.password});
                return user;
            })
        );

    }

    paginate(options: IPaginationOptions): Observable<Pagination<user>>{
        return from(paginate<user>(this.userRepository, options)).pipe(
            map ((usersPageable: Pagination<user>) =>{
                usersPageable.items.forEach(function (v)  {delete v.password});
                return usersPageable;
            })
        )

    }

    deleteOne(id: number): Observable<any>{

        return from(this.userRepository.delete(id));
    }

    updateOne(id: number,user: user): Observable<any>{
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id,user));
    }

    updateRoleofUser(id: number , user: user):Observable<any>{
        return from(this.userRepository.update(id, user));
    }


    login(user: user): Observable<string>{
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: user) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                }
                    else {
                        return 'wrong Credentials';
                    }
                
            })
        )
    
    }

    validateUser(email: string, password: string):Observable<user>{
        return this.findByMail(email).pipe(
            switchMap((user: user) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match){
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error ;
                        
                    }
                })

            ))
        )
   
    }
    findByMail(email: string):Observable<user>{
        return from(this.userRepository.findOne({email}));
    }
}
