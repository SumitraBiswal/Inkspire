import { useEffect, useState } from "react"

 export const useDebounce=(value,delay=3000)=>{
    const [debouncedValue , setDebouncedvalue]=useState(value);

    useEffect(()=>{
        const timer = setTimeout(()=>setDebouncedvalue(value),delay);
        return ()=>clearTimeout(timer);
    },[value,delay]);
    return debouncedValue;

};
