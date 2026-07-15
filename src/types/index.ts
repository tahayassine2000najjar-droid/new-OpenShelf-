export interface IBook {
    _id : string , 
    title :string ,
    author :string ,
    isbn :string ,
    category :string , 
    publicationYear :number , 
    description :string ,
    available :boolean , 
    createdAt? :string ,
    updatedAt? :string 

}

export interface BookFormData {
    title :string ,
    author :string ,
    isbn :string ,
    category :string , 
    publicationYear :number , 
    description :string ,
    available :boolean    
}


export interface ToastState {
    show : boolean ,
    message : string ,
    type : "" | "confirm" | "success" | "error" ;
}


export interface ValidationError {
    [key:string] : string[] ; 
}
