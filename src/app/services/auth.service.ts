import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;

  constructor() { }

  login(username: string, password: string): boolean {
    // Implement your authentication logic here
    // For demo purposes, assume authentication is successful
    if (username === 'demo' && password === 'demo') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    // Implement logout logic here
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
