export interface Galaxy {
    id: string;
    createdAt:string;
    updatedAt:string;
    allStellarList:simpleStellar[];
}
export interface simpleStellar {
    id: string;
    title: string;
    position: [number, number, number];
    color:number; //star color
}
}