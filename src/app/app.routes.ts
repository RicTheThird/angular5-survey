import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentRoutes } from './component/component.routes';
import { PageNotfoundComponent } from './component/page-notfound/page-notfound.component';

export const routes: Routes = [
    ...ComponentRoutes,
     { path: '', redirectTo: 'survey', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' },
    { path: '404', component: PageNotfoundComponent }
    
    // { path: 'survey', loadChildren: 'app/survey/survey.module#SurveyModule' }
    // { path: '**', component: PageNotFoundComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);