export  function isObjectNumeric(object){
    
    var numeric = false;

    if(typeof(object)==="number"){
        
        numeric=true;
    }
    
    return numeric;
}

export  function isObjectEmpty(obj) {
    
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // Check if object is numeric
    if(isObjectNumeric(obj)) return false;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


 export  function isUserTokenInClient(){
    return !isObjectEmpty(localStorage.getItem("token"));
}

export  function saveUser(token,name,family_names,email){
    localStorage.setItem('token',token);
    localStorage.setItem("name",name);
    localStorage.setItem("family_names",family_names)
    localStorage.setItem("email",email)
}

export  function removeUser(){
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("family_names");
    localStorage.removeItem("email")
}

export  function getUser(){
    return {
        user_token:localStorage.getItem("token"),
        user_name:localStorage.getItem("name"),
        user_family_names:localStorage.getItem("family_names"),
        user_email:localStorage.getItem("email")
    }
}

export  function userAuthenticate(){
    if(window.location.href.indexOf("token")===-1 && this.isUserTokenInClient()===false){
        window.location="https://services.simbiosys.upf.edu/api-auth2/auth/google"
    }else{
        if(window.location.href.indexOf("token")!==-1){
        let token=window.location.search.split("=")[1];
        this.saveUserToken(token);
        }
    }
}