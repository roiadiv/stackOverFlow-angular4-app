import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from "../app.component";
import { UserQuestionsComponent } from "../user-questions/user-questions.component";
import { HomeComponent } from "../home/home.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";

const appRoutes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'not-found', component: PageNotFoundComponent },
    { path: 'home', component: HomeComponent },
    { path: 'uq/:uid', component: UserQuestionsComponent },
    { path: '**',redirectTo:'/not-found',  pathMatch: 'full' }

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }