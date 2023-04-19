import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReusableModule } from './reusable/reusable.module';
import { MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { PolicyComponent } from './policy/policy.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatIconModule } from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { EntryPointComponent } from './entry-point/entry-point.component';
import { EntryPointModule } from './entry-point/entry-point.module';

@NgModule({
  declarations: [
    AppComponent,
    PolicyComponent,
    EntryPointComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    ReusableModule,
    EntryPointModule,
    MarkdownModule.forRoot(),
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-IN' }],
  bootstrap: [AppComponent]
})
export class AppModule {}