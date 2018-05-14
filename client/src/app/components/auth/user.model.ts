export class User {
    /**
     * Constructor for User class
     * @param email
     * @param password
     * @param userName
     */
    constructor(public userName: string,
				public password: string,
                public email?: string,
                ) {}
}