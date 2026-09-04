import { useState } from 'react'
function Dashboard(){
    return(
        <div className='dashboard'> 
            <div className='input-box'>
                <h2>image 1</h2>
                <input type="file" accept='image/*'/>
            </div>
            <div className='input-box'>
                <h2>image 2</h2>
                <input type="file" accept='image/*' />
            </div>
        </div>
    )
}
export default Dashboard;