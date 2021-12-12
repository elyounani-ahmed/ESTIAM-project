import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../service/user.service';
import { user, UserRole } from '../models/user.interface';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';




@Controller('users')
export class UserController {

    constructor(private userService:UserService){}
    @Post()
    cerate (@Body() user: user): Observable<user | object> {
        return this.userService.create(user).pipe(
            map ((user:user)=> user),
            catchError (err => of({error: err.message}))
        ); 

    }

    @Post('login')
    login(@Body() user: user): Observable <Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) =>{
            return {access_token: jwt };
            })
        )
    }

    @Get(':id')
    findOne(@Param() Params): Observable<user> {
       return this.userService.findOne(Params.id);

    }

    

    @Get()
    index ( @Query('page') page: number = 1, @Query ('limit') limit: number = 10,):Observable<Pagination<user>> {
        limit = limit > 100 ? 100 : limit;
        
        return this.userService.paginate({page: Number(page), limit: Number(limit), route: 'http://localhost:300/user',});

    }
    @Delete(':id')
    deleteOne(@Param('id')id: string):Observable<user>{
        return this.userService.deleteOne(Number(id));

    }
    @Put(':id')
    updateOne(@Param('id')id: string, @Body() user:user):Observable<any>{
        return this.userService.updateOne(Number(id),user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    
    @Put(':id/role')
    updateRoleofUser(@Param('id') id:string, @Body() user: user): Observable<user>{
        return this.userService.updateRoleofUser(Number(id), user);


    }

}
