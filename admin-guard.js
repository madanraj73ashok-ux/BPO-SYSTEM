(async()=>{try{const r=await fetch('/api/admin-session');const d=await r.json();if(!d.authenticated)location.replace('/admin-login.html')}catch{location.replace('/admin-login.html')}})();
