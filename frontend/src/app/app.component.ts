import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from "./register/register.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
