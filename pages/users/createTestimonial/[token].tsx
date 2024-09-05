import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import axios from 'axios';



const Token = () => {
    const router = useRouter();
    const token = router.query.token as string | undefined;
    const [data, setdata] = useState({
        photo: '',
        product_name: '',
        description: ''
    });
    const [loader, setLoader] = useState(false);

    function handleChange(e: any) {
        const { name, value } = e.target;
        setdata(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    async function postTestimonoal() {
        setLoader(loader=>!loader);
        const { photo, product_name, description } = data
        if (!photo || !product_name || !description) {
            toast.error('Please add all fields ')
            setLoader(loader=>!loader)
            return;
        }
        try {
            const url = '/api/route/user/create_testimonial';
            const response = await axios.post(url, {
                photo,
                product_name,
                description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response?.data) {
                toast.success('Added Successfully');
                setTimeout(()=>{
                    router.push(`/users/home/${token}`)
                    setLoader(loader=>!loader)
                },2000)
            }

        } catch (err) {
            setLoader(loader=>!loader);
            toast.error('Unable to post try again...')
        }

    }
    return (
        <div>
            <h1 className='text-center text-slate-600 text-5xl font-serif pt-3 m-3'>
                Create Your Testimonial
            </h1>
            <div>
                <div className='grid grid-cols-1 gap-8 w-[70vw] mx-auto'>
                    <div className='relative flex justify-center mt-8'>
                        <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                            Product Name
                        </label>
                        <input
                            onChange={(e) => handleChange(e)}
                            className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                            placeholder='XYZ product...'
                            name='product_name'
                        />
                    </div>
                    <div className='relative flex justify-center'>
                        <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                            Product Photo URL
                        </label>
                        <input
                            onChange={(e) => handleChange(e)}
                            type='text'
                            className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                            placeholder='https://example.com/photo.jpg'
                            name='photo'
                        />
                    </div>
                    <div className='relative flex justify-center'>
                        <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                            Product Description
                        </label>
                        <textarea
                            rows={4}
                            className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                            placeholder='Describe the product...'
                            name='description'
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className='relative flex justify-center'>
                        <button
                            onClick={() => postTestimonoal()}
                            className='text-semibold bg-blue-600 p-3 transition-all duration-300 hover:bg-blue-500 text-lg  text-white rounded-md'>
                            Publish Testimonial
                        </button>
                    </div>
                </div>
            </div>
            {loader && (
                <div className="bg-black absolute gap-16 opacity-85 flex justify-center items-center top-0 w-[100vw] h-[100vh]">
                    <span className="loader"></span>
                </div>
            )}
        </div>
    );
};

export default Token;
