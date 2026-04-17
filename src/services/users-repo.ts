import debug from 'debug';

import { env } from '../config/env.ts';
import type { DatabaseSync } from 'node:sqlite';
import type { User } from '../schemas/user.ts';
import { SqlError } from '../errors/sql-error.ts';

const log = debug(`${env.PROJECT_NAME}:users-repo`);
log('Starting application');

export class UsersRepo {
    #sqliteDB: DatabaseSync;

    constructor(sqliteDB: DatabaseSync) {
        this.#sqliteDB = sqliteDB;
    }

    readAllUsers() {
        const q = `SELECT * FROM users`;
        const stmt = this.#sqliteDB.prepare(q);
        const users = stmt.all();
        log('users:', users);
        return users as unknown as User[];
    }

    readUserById(id: number) {
        const q = `SELECT * FROM users WHERE id = ?`;
        const stmt = this.#sqliteDB.prepare(q);
        const user = stmt.get(id);

        if (!user) {
            throw new SqlError(`User with id ${id} not found`, {
                code: 'NOT_FOUND',
                sqlState: 'SELECT_FAILED',
                sqlMessage: `No user found with id ${id}`,
            });
        }

        log('user:', user);
        return user as unknown as User;
    }
}
