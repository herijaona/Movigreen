import AsyncStorage from '@react-native-community/async-storage';

export function getItemLocal(key) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key)
            .then(res => {
            if (res !== null) {
                resolve(res);
            } else {
                resolve(false);
            }
            })
            .catch(err => reject(err));
    });
}

