import { Component, OnInit, ViewChild } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Message } from '../../core/constants/messages';
import { MessagesModule } from 'primeng/messages';
import { UserService } from '../../core/services/user/user.service';
import { SharedService } from '../../core/services/shared/shared.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    MessagesModule,
    TagModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  users!: any[];
  messages: any;
  filteredusers!: any[];
  loading: boolean = true;
  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {
    this.getuserDetails();
    this.messages = [
      {
        severity: 'info',
        detail: `Please search by First Name if required .`,
      },
    ];
  }

  ngOnInit(): void {}

  getuserDetails() {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredusers = users;
        this.loading = false;
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        throw error;
      }
    );
  }

  searchValue(targetValue: any): void {
    let searchTerm = targetValue.value.toLowerCase();
    if (!searchTerm) {
      this.users = [...this.filteredusers];
    } else {
      this.users = this.filteredusers.filter((result) =>
        result.fullName.toLowerCase().includes(searchTerm)
      );
    }
  }

  selectDataById(rowDataId: any) {
    this.router.navigate([`ins/edit-user/${rowDataId}`]);
  }

  deleteDataById(rowDataId: any) {
    this.loading = true;
    this.userService.deleteuserById(rowDataId).subscribe(
      (responseData: any) => {
        this.users = responseData.users;
        this.loading = false;
        this.sharedService.openSnackBar(responseData.message, 'OK');
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        throw error;
      }
    );
  }

  AddRecord() {
    this.router.navigate([`ins/add-user`]);
  }

  activeById(rowDataId: any) {
    this.loading = true;
    this.userService.activeUserById(rowDataId).subscribe(
      (responseData: any) => {
        this.users = responseData.users;
        this.loading = false;
        this.sharedService.openSnackBar(responseData.message, 'OK');
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        throw error;
      }
    );
  }
}
