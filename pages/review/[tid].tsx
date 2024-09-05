import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

interface ReviewProps {
    data: any;
    Tid: string
}

const Review = ({ data, Tid }: ReviewProps) => {
    const Tdata = data.data[0].ProductData;
    const router = useRouter();
    const [rating, setRating] = useState<number | null>(null);
    const [loader, setLoader] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        feedback: ''
    });
    console.log(data,'this is data')
    const handleStarClick = (star: number) => {
        setRating(star);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const submitRating = async () => {

        console.log(form, rating);
        if (!form.name || !form.email || !form.feedback || rating === null) {
            toast.error('Please fill out all fields and select a rating.');
            return;
        }
        try {
            setLoader(load => !load);
            const response = await axios.post('/api/route/testimonial/testimonial_review',
                {
                    ...form,
                    rating,
                    Tid
                },

            );
            if (response.data) {
                toast.success('Thank you For the Review');
                setTimeout(() => {
                    setLoader(load => !load);
                    router.replace('https://www.youtube.com/watch?v=PT18dZlRAkA');
                }, 2500)
                return;
            }
            setLoader(load => !load);
            toast.error('There is some problem please contact Adminstrator')

        } catch (error) {
            console.error('Error submitting rating:', error);

        }
    };

    return (
        <div className=' pb-8 pt-0 relative'>
            <div>
                <h1 className='text-3xl text-white bg-purple-700 font-semibold text-start pl-10 p-2'>
                    Feedback And Rate for {(Tdata?.name)?.toUpperCase()}
                </h1>
                <img className='mx-auto m-2 p-2' width={400} src={Tdata.photo} alt={Tdata.name} />
                <p className='text-center font-semibold text-slate-600 uppercase'>{Tdata.description}</p>
            </div>

            <div className='grid grid-cols-1 gap-8 w-[70vw] mx-auto'>
                <div className='relative flex justify-center mt-8'>
                    <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                        Name
                    </label>
                    <input
                        onChange={handleChange}
                        className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                        placeholder='Your Name...'
                        name='name'
                    />
                </div>
                <div className='relative flex justify-center'>
                    <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                        Email
                    </label>
                    <input
                        onChange={handleChange}
                        type='text'
                        className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                        placeholder='Your Email...'
                        name='email'
                    />
                </div>
                <div className='relative flex justify-center'>
                    <label className='px-2 ml-2 bg-white absolute top-[-16px] left-[10px] text-md text-slate-500'>
                        Feedback
                    </label>
                    <textarea
                        rows={4}
                        className='p-2 ml-2 w-[90%] hover:shadow-xl transition-all duration-300 border-2 border-slate-400 rounded-md'
                        placeholder='Describe your Review...'
                        name='feedback'
                        onChange={handleChange}
                    />
                </div>

                <div className='relative flex justify-evenly items-center'>
                    <p className='text-xl font-semibold text-slate-500 gap-10 '>Please Rate </p>
                    <div className='flex '>
                        {Array.from({ length: 5 }, (_, index) => index + 1).map(star => (
                            <img
                                key={star}
                                src='https://www.pinclipart.com/picdir/big/177-1777672_clip-art-gold-star-award-image-transparent-gold.png'
                                alt={`Star ${star}`}
                                className={`cursor-pointer w-14 m-2 p-2 ${star <= (rating ?? 0) ? 'opacity-100' : 'opacity-30'} hover:opacity-100`}
                                onClick={() => handleStarClick(star)}
                            />
                        ))}
                    </div>
                </div>

                <div className='relative flex justify-center'>
                    <button
                        onClick={submitRating}
                        className='text-semibold bg-blue-600 p-3 transition-all duration-300 hover:bg-blue-500 text-lg text-white rounded-md'>
                        Submit Feedback
                    </button>
                </div>
            </div>
            {loader && (
                <div className="bg-black absolute gap-16 opacity-85 flex justify-center items-center top-0 w-full h-full">
                    <span className="loader"></span>
                </div>
            )}
        </div>
    );
};

export async function getServerSideProps(context: any) {
    const Tid = context.query.tid;
    console.log(Tid, 'this is Tid');
    try {
        const url = `http://localhost:3000/api/route/testimonial/testimonial_review`;
        const response = await axios.get(url, {
            headers: {
                id: Tid,
            },
        });
        return {
            props: {
                data: response.data,
                Tid
            },
        };
    } catch (err) {
        console.error('Error fetching data:', err);

        return {
            props: {
                data: null,
                Tid: ''
            },
        };
    }
}

export default Review;
