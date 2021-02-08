import {Component, OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoadingService } from './loading/loading.service';
import { MessagesService } from './messages/messages.service';
import { AuthStore } from './services/auth.store';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {

  constructor(public authService: AuthStore, private router: Router) {

  }

  ngOnInit() {


  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
