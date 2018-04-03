import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HideNavMenuService } from '../../services/parent_comp_controls/hide-nav-menu.service';
import { HideFooterService } from '../../services/parent_comp_controls/hide-footer-service.service';
import { LoginService } from '../../services/api-services/login.service';
import {Location, PlatformLocation} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    public showWaiting = false;
    public showForm = true;
    public waitingMessage = 'waiting';
    public userName: string;
    public password: string;
    public errorMessage: string;

    constructor(private titleService: Title,
                public menuService: HideNavMenuService,
                public footerService: HideFooterService,
                public loginService: LoginService,
                private router: Router,
                private location: Location,
                private platformLocation: PlatformLocation) {

        this.titleService.setTitle("Login");
        this.setWaitingState();
        this.loginService.checkIfTokenIsValid()
            .then ((isValid) => {
                if (isValid) {
                    console.log('isValid token in local');

                    location.back();
                } else {
                    this.setDefaultState();
                }
            })
            .catch((error) => {
                this.setDefaultState();
                this.footerService.hide();
                console.log(error);
            });
    }

    ngOnInit() {
        this.platformLocation.onPopState(() => {
            this.menuService.show();
            this.footerService.show();
        });
    }

    setDefaultState () {
        this.waitingMessage = '';
        this.showWaiting = false;
        this.showForm = true;
        this.errorMessage = '';
        this.menuService.hide();
        this.footerService.hide();
    }

    setWaitingState () {
        this.waitingMessage = 'loading...';
        this.showForm = false;
        this.showWaiting = true;
    }

    setLoggedInState () {
        this.showWaiting = false;
        this.showForm = false;
        this.waitingMessage = 'Your Logged In!!!';
    }

    setLogInFailedState() {
        this.showWaiting = false;
        this.waitingMessage = '';
        this.showForm = true;
        this.errorMessage = 'User Name or Password Not Valid';
    }

    setUser(event) {
        this.userName = event.target.value;
    }

    setPassword(event) {
        this.password = event.target.value;
    }

    submit() {
        if (this.userName == null || this.password == null) {
            this.setLogInFailedState();
            this.errorMessage = "User Name and Password fields must not be blank";
            return;
        }
        this.setWaitingState();
        this.loginService.getToken(this.userName, this.password)
            .then(() => {
                this.loginService.signInEventTrigger();
                this.location.back();
            })
            .catch((err) => {
                this.setLogInFailedState();
            });
    }

    signOut() {
        this.setDefaultState();
        this.loginService.signOut();
    }
}
