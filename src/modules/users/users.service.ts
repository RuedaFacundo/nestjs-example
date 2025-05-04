import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {

    private _users: UserDto[];

    constructor() {
        this._users = [];
    }

    createUser(user: UserDto) {
        const userFound = this._users.find(u => u.id == user.id);

				if (!userFound) {
            this._users.push(user);
            console.log(this._users);
            return true;
        }
        return false;
    }

    getUsers(start: string) {

			if(!start) {
				return this._users;
			}
	
			return this._users.filter(u => u.name.toLocaleLowerCase().trim().startsWith(start.toLocaleLowerCase().trim()))
    }

    updateUser(user: UserDto) {

        const userAdded = this.createUser(user);

        if (!userAdded) {
            const index = this._users.findIndex(u => u.id == user.id);
            this._users[index] = user;
        }
        return true;

    }

    deleteUser(idUser: number) {
        const index = this._users.findIndex(u => u.id == idUser);

        if (index != -1) {
            this._users.splice(index, 1);
            return true;
        }
        return false;

    }

}
