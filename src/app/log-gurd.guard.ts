

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const logGurdGuard: CanActivateFn = () => {
  
  const router = inject(Router);
    const userId = localStorage.getItem('id');
    if(userId){
      router.navigateByUrl('/dashboard')
      return false 
    }
    else{
      // router.navigateByUrl('/login')
      return true
    }   
     
    }
