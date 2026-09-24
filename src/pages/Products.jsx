import {useEffect} from "react";
import { getProducts } from "../api/productApi";

function Products(){
    useEffect(()=>{
        const fetchProducts = async()=>{
            try{
                const data = await getProducts({
                    limit: 10,
                    skip: 0,
                });
                console.log(data);
            }catch(error){
                console.log(error);
            }
        };
        fetchProducts();
    },[]);
    return(
        <div>
            <h1>Products Page</h1>
        </div>
    )
}
export default Products;