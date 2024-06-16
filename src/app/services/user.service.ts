import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor() { }

  getAllUsers(): Observable<User[]> {
    // Replace with actual API call to fetch users
    return of(this.users);
  }

  getUserById(userId: number): Observable<User | undefined> {
    // Replace with actual API call to fetch user by ID
    const user = this.users.find(u => u.id === userId);
    return of(user);
  }

  updateUser(user: User): void {
    // Implement update user logic
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  // Add additional methods as needed for user management
}
