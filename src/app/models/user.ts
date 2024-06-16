// user.model.ts

export class User {
    id: number;
    username: string;
    email: string;
    password: string; // Note: In a real app, password should not be stored in plain text
    // Additional fields as needed

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
