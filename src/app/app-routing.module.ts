import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loginComponent } from './login/login.component';
import { AccountResolverService } from './account-resolver.service';
import { LoginService } from './login/login.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.loginModule),
  },
  {
    path: '',
    loadChildren: () => import('./risk/risk.module').then((m) => m.riskModule),
    runGuardsAndResolvers: 'always',
    // resolve: { account: AccountResolverService },
    // resolve: { account: LoginService },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
