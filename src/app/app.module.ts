import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgIdleModule } from '@ng-idle/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './service/http-interceptor.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CanActivateAuth } from './guard/can-activate.guard';
import { AuthGuard } from './guard/auth.guard';
import { routing } from './app.routes';
import { DialogComponent } from './component/dialog/dialog.component';
import { MessageArchivedComponent  } from './utils/custom-snackbar';
import {
  MatInputModule, MatButtonModule, MatRadioModule, MatSelectModule, MatDialogModule,
  MatCheckboxModule, MatIconModule, MatFormFieldModule, MatSnackBarModule
} from '@angular/material';
import { ServicesModule } from './service/services.module';
import { UtilsModule } from './utils/utils.module';
import { ComponentModule } from './component/component.module';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { OrderbyPipe } from './pipe/orderby.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ComponentModule,
    DialogComponent,
    MessageArchivedComponent,
    SanitizeHtmlPipe,
    OrderbyPipe
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    routing,
    HttpModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    NgIdleModule.forRoot()
  ],
  providers: [
    RouterModule,
    CanActivateAuth,
    AuthGuard,
    ServicesModule,
    UtilsModule,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  entryComponents: [DialogComponent,MessageArchivedComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
