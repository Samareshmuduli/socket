
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn = () => {
  
  const router = inject(Router);
    const userId = localStorage.getItem('id');
    if(!userId){
      router.navigateByUrl('/login')
      return false 
    }
    else{
      return true
    }    
    }
