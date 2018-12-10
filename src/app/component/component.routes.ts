import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuestionnaireComponent } from './auth-components/questionnaire/questionnaire.component';
import { ParticularsComponent } from './auth-components/particulars/particulars.component';
import { AuthComponentsComponent } from './auth-components/auth-components.component';
export const ComponentRoutes: Routes = [
    { path: 'survey', component: LoginComponent },
    {
        path: 'page', component: AuthComponentsComponent,
        children: [
            { path: '', redirectTo: 'particulars', pathMatch: 'full' },
            { path: 'particulars', component: ParticularsComponent },
            { path: 'questionnaire', component: QuestionnaireComponent }
        ]
    }
];