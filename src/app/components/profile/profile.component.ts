import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers:[UserService]
})
export class ProfileComponent implements OnInit {

  user: User = new User(0, '', '', ''); // Initialize with empty user
  // Add more properties and methods as needed

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Example: Fetch user profile information
    this.userService.getAllUsers().subscribe(users => {
      this.user = users[0]; // Assuming fetching the first user for demo
    });
  }

  onUpdateProfile(): void {
    // Implement update profile logic
    this.userService.updateUser(this.user);
    // Optionally, show success message or handle further logic
  }

}
