export const getSoftwareInstalledAnNotInstalled=(softwareList,softwareInstalled,status)=>{
    
    let newSoftwareInstalled=[];
    let newSoftwareNotInstalled=[];

    if(status===false){
        newSoftwareInstalled=[];
        newSoftwareNotInstalled.push(softwareInstalled);
    }else{
        softwareList.forEach((element)=>{
            if(element.name===softwareInstalled.name){
                newSoftwareInstalled.push(element);
            }else{
                newSoftwareNotInstalled.push(element);
            }
        })
    }
   

    return {softwareInstalled:newSoftwareInstalled,softwareNotInstalled:newSoftwareNotInstalled}

}