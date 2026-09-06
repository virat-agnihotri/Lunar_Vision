import { useState } from 'react'
import {processImages} from "../api/imageApi"
function Dashboard(){
    const[image1,setImage1]=useState(null)
    const[image2,setImage2]=useState(null)
    const handleProcess =async ()=>{
        if (!image1||!image2){
            alert("please select both images")
            return
        }
        try{
            const result =await processImages(image1,image2)
            console.log(result)
        }catch(error){
            console.error(error)
        }
    }

    return(
        <div className='dashboard'> 
            <div className='input-box'>
                <h2>image 1</h2>
                <input type="file" accept='image/*' onChange={(e)=>setImage1(e.target.files[0])}/>
                {image1 && (
                    <img src={URL.createObjectURL(image1)} alt="Reference" width="400"></img>
                )}

            </div>
            <div className='input-box'>
                <h2>image 2</h2>
                <input type="file" accept='image/*' onChange={(e)=>setImage2(e.target.files[0])}/>
                {image2 && (
                    <img src={URL.createObjectURL(image2)} alt="Reference" width="400"></img>
                )}
            </div>
            <button onClick={handleProcess}>Process Images</button>
        </div>
    )
}
export default Dashboard;