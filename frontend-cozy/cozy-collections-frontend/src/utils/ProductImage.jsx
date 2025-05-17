import React, { useEffect, useState } from 'react'

const ProductImage = ({productId}) => {

    const [ProductImage, setProductImage] = useState(null);

    useEffect(() =>{
        const fetchProductImage = async (id) =>{
            try{
                const response = await fetch(
                    `https://localhost:9090/api/v1/images/image/download/${id}`
                )
                const blob =  await response.blob();
                const reader = new FileReader();
                reader.onloadend = () =>{
                    setProductImage(reader.result)
                };
                reader.readAsDataURL(blob);
                
            }catch(error){
                console.error("error fetching image:",error);
            }
        };
        if(productId){
            fetchProductImage(productId);
        }
    },[productId]);

    if(!ProductImage) return null;

    


  return (
    <div>
        <img src={ProductImage} alt='product image'/>
    </div>
  )
}

export default ProductImage