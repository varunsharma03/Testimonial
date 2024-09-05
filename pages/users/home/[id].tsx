import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';


const Id = (props: any) => {
  const userData = props?.data?.data;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  async function copyLink(e: any) {
    await navigator.clipboard.writeText(e.target.name).then(() => toast.success('Link Copied'));
  }

  return (
    <div>
      <div className='flex p-2 px-5 justify-between'>
        <h1 className='text-lg text-slate-600 fotn-semibold p-2'>Hello <span className='text-xl font-semibold text-blue-600'>{(userData?.name)?.toUpperCase() || 'Contact Adminstrator'}</span></h1>
        <div className='flex gap-4'>
          <button
            onClick={() => { router.push(`/users/createTestimonial/${router.query.id}`) }}
            className='text-lg bg-blue-500 rounded-md text-white p-2'>
            Add Testimonial
          </button>
          <button
            className='font-semibold text-slate-600'
            onClick={() => { router.push('/users') }}>LogOut</button>
        </div>
      </div>

    

      <h1 className='text-4xl font-bold text-center mt-10 font-serif text-gray-600'>Your Testimonials</h1>
      <div className='grid grid-cols-1 gap-3 p-4 m-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 '>
        {
          userData?.testimonials?.map((ele: any, index: number) => {
            return <div key={index} className='p-4 m-2 shadow-md sm:min-h-[50vh] ' >
              <div className='flex justify-between'>
                <h1 className='text-lg font-semibold'><span className='text-sm'>{index + 1}{` ->`}</span> {(ele?.product?.name)?.toUpperCase() || 'User'} Testimonial</h1>
                <p className='text-lg text-blue-600 cursor-pointer animate-bounce '
                onClick={()=>{router.push({pathname:`http://localhost:3000/crousel/${ele?.testimonial?._id}`,
                  query:{token: router.query.id, visible:true}
                })}}
                >Iframe</p>
              </div>
              <div className=' pl-8'>
                <h2 className='text-md text-slate-800 m-1 ml-0 font-semibold h-22'>{ele?.product?.description?.slice(0, 60)}...</h2>
                <div>
                  <img className='sm:min-w-[56vw] sm:min-h-[36vh] sm:max-h-[36vh] md:max-w-[20vw] md:min-w-[25vw] md:min-h-[25vh] md:max-h-[35vh]  mx-auto ' src={`${ele?.product?.photo}`} alt='photo' />
                </div>
                <div className='flex justify-between m-2 p-1'>
                  <p className='text-lg text-end text-blue-400 font-semibold'>{ele?.testimonial?.live ? "Live" : "Not live"}</p>
                  <button className='text-md text-end text-slate-500 ml-6 font-semibold'
                    onClick={(e) => copyLink(e)}
                    name={`http://localhost:3000/review/${ele?.testimonial?._id}`}>Form Link</button>
                  <p className='text-md pt-1 text-green-500 cursor-pointer' onClick={() => router.push({
                    pathname: 'http://localhost:3000/users/singleTestimonial',
                    query: { Tid: ele?.testimonial?._id, userId: ele?.testimonial?.User, token: router.query?.id }
                  })}>See details...</p>
                </div>
              </div>
            </div>
          })
        }
      </div>

      {loader && (
        <div className="bg-black absolute gap-16 opacity-85 flex justify-center items-center top-0 w-[100vw] h-[100vh]">
          <span className="loader"></span>
        </div>
      )}

    </div>
  )
}
export default Id

export async function getServerSideProps(context: any) {
  const id = context.query.id;
  console.log('ID:', id);

  try {
    const response = await fetch(`http://localhost:3000/api/route/user`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${id}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        props: { data },
      };
    } else {
      return {
        props: { data: null },
      };
    }
  } catch (error) {
    return {
      props: { data: null },
    };
  }
}