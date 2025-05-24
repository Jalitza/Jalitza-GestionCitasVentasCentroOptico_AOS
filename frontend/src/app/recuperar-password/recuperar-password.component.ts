import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
  standalone: true,
  imports: [FormsModule],

})
export class RecuperarPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  recuperarPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
        alert('📧 Se envió un correo para restablecer tu contraseña');
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('❌ Error al enviar el correo:', error);
        alert('Error: ' + error.message);
      });
  }
}
