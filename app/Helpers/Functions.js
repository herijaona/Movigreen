import { 
    PRIX_KM,
    TAUX_C02
} from './Helper';


export const getCurrentLocation = () =>{
    return new Promise(
        (resolve, reject) =>{
            navigator.geolocation.getCurrentPosition(
                (data) => resolve(data.coords),
                (err) => reject(err)
            );
        }
    );
};

export const convertDistance = (value) =>{
    return (
        round(value/1000,1)
    )
}

export const calculPrix = (value) =>{
    return (
        round(value  * PRIX_KM ,2)
    )
}

export const calculCO2 = (value) =>{
    return (
        round(value  * TAUX_C02 / 100 ,2)
    )
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export const searchArr = (key,array) =>{
    for (var i=0; i<array.length; i++){
        if(array[i].number === key)
            return true;
    }
    return false;
} 

export const removeArr = (key, array) =>{
    return array = array.filter(x=>x.number !== key);
}