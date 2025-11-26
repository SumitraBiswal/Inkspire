export const booklist = async ()=>{
    try{
      const response = await fetch("/book.json");
      if(!response.ok)throw new Error("Failed to fetch books ");
      const data= await response.json();
      return data;
      
    }catch(error){
        console.error("error fetching books ." ,error);
        return[];
    }
}