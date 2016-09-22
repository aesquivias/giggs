import React from 'react';

const eachJob = (props) => {
  return (
   <div>{
       props.data.map((eachJob, index) => {
         return <div key={index} className='well'>
           <h4>Job</h4>
           <p>{eachJob.jobName}</p>
           <h4>Location</h4>
           <p>{eachJob.location}</p>
           <h4>Description</h4>
           <p>{eachJob.description}</p>
           <h4>Openings</h4>
           <p>{eachJob.openings}</p>
           <h4>Max Price</h4>
           <p>{eachJob.max_price}</p>
         </div>
       })
     }</div>
  )
};

export default eachJob;
