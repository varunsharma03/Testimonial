import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router';


interface Review {
  name: string;
  feedback: string;
  email: string;
  liked?: boolean;
  rating: number;
  id?: string;
  date?: string;
  reviewId: any;
}

interface ReviewComponentProps {
  data: Review;
  funsetRevData:any;
}
const ReviewComponent: React.FC<ReviewComponentProps> = ({ data ,funsetRevData}) => {
  const router = useRouter();
  const token = router.query.token;
  const [revdata,setRevData]=useState(data);
  async function HandleLiked(liked: boolean, Tid: any, reviewId: any, token: string) {
    try {
      let url = 'http://localhost:3000/api/route/updateReview';
      const response = await axios.post(url,
        { Tid, reviewId,liked },
        { headers: { "authorization": `Bearer ${token}` } }
      );
      if (response) {
        // funsetRevData(reviewId,liked);
        console.log(response?.data?.response,'this is the response')
        setRevData(()=>response?.data?.response[0]);
        funsetRevData(reviewId,liked);

        toast.success(`Added to ${liked ? 'Liked' : 'Disliked'} `)
        return;
      } else {
        toast.error('Error In updating Review');
      }
    }
    catch (err) {
      console.log('error', err);
      toast.error('Error while updating please contact adminstrator');
      setTimeout(() => { router.push('/users') }, 2000);
    }

  }
  async function copyLink(e: any) {
    await navigator.clipboard.writeText(e.target.name).then(() => toast.success('Link Copied'));
  }

  return (
    <div className='p-4 my-5 border border-gray-300 rounded-lg shadow-md bg-white'>
      <div className='mb-2 flex justify-between'>
        <div>
          <p className='font-semibold'>Reviewer Name:</p>
          <p className='text-gray-700'>{revdata?.name}</p>
        </div>
        <div>
          <span className='font-semibold text-slate-600'> {revdata?.date}</span>
        </div>
      </div>
      <div className='mb-2'>
        <p className='font-semibold'>Reviewer Email:</p>
        <p className='text-gray-700'>{revdata?.email}</p>
      </div>
      <div className='mb-2'>
        <p className='font-semibold'>Feedback:</p>
        <p className='text-gray-700'>{revdata?.feedback}</p>
      </div>
      <div className='mb-2'>
        <p className='font-semibold'>Rating:</p>
        <p className='text-gray-700'>{revdata?.rating}</p>
      </div>
      <div>
        <p className='font-semibold'>Status:</p>
        <p
          onClick={() => HandleLiked(!revdata?.liked, revdata?.id, revdata?.reviewId, token as string)}
          className={`text-gray-700 cursor-pointer ${revdata?.liked ? 'text-green-600' : 'text-red-600'}`}>
          {revdata?.liked ? 'Liked' : 'Add to Liked'}
        </p>
      </div>
      <div>
        <div className='py-1 flex justify-between'>
          <a className='font-semibold' target='blank' href={`http://localhost:3000/review/${revdata?.id}`}>Open FeedBack Form:</a>
          <button className='text-blue-700' onClick={(e) => copyLink(e)} name={`http://localhost:3000/review/${revdata?.id}`}>Copy Link</button>
        </div>
        <p className='text-gray-700 text-wrap md:text-balance overflow-hidden text-ellipsis whitespace-nowrap'>
          http://localhost/:3000/review/{revdata?.id}
        </p>

      </div>
    </div>
  );
}

export default ReviewComponent;
