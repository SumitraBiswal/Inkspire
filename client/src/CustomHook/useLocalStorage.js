import { useState } from "react";

export default function useLocalStorage(key,initialvalue){
    const [storeValue,setStoreValue]=useState(()=>{
        try{
            const item= localStorage.getItem(key);
            return item? JSON.parse(item):initialvalue;

        }catch(error){
            console.error("Error reading localstorage key:",key,error);
            return initialvalue;
        }
    });

    const setValue =(value) => {
        try{
            const valueToStore = value instanceof Function ? value (storeValue) : value;
            setStoreValue(valueToStore);
            localStorage.getItem(key,JSON.stringify(valueToStore));

        }catch(error){
            console.error("Error reading localstorage key:",key,error);
            
        }
    };
    return [storeValue , setValue];
}