import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ReviewComponent from '../components/review_component';

interface Review {
  liked?: boolean;
  disliked?: boolean;
  name: string;
  feedback: string;
  email: string;
  rating: number;
  [key: string]: any;
  reviewId: any
}

interface Testimonial {
  testimonial: {
    _id: string;
    User: string;
    review: Review[];
  };
}

interface TestimonialProps {
  data: Testimonial | null;
  Tid?: string;
  userId?: string;
}

const SingleTestimonial: React.FC<TestimonialProps> = ({ data, Tid, userId }) => {
  const [revData, setRevData] = useState<Review[]>(data?.testimonial?.review || []);
  const [filterState, setFilterState] = useState<number | null>(-1);

  // function handleFilter(state: number) {
  //   if (data) {

  //     let filteredReviews: Review[] = [];
  //     if (state === 1) {
  //       console.log(data.testimonial.review,'in 1')
  //       filteredReviews = data?.testimonial?.review?.filter((rev) => rev?.liked === true);
  //       console.log(filteredReviews,'filteredReviews');
  //     } else if (state === 0) {
  //       filteredReviews = data.testimonial.review.filter((rev) => rev?.liked === false);
  //     } else {
  //       filteredReviews = data.testimonial.review;
  //     }
  //     setRevData(filteredReviews);
  //   }
  // }

  function handleFilter(state: number) {
    if (data) {
      let filteredReviews: Review[] = [];
      if (state === 1) {
        console.log('Filtering liked reviews');
        filteredReviews = data.testimonial.review.filter((rev) => rev?.liked === true);
        console.log(filteredReviews)
      } else if (state === 0) {
        console.log('Filtering disliked reviews');
        filteredReviews = data?.testimonial?.review?.filter((rev) => rev?.liked === false);
        console.log(filteredReviews)
      } else {
        console.log('Showing all reviews');
        filteredReviews = data?.testimonial?.review;
        console.log(filteredReviews)
      }
      setRevData(()=>filteredReviews);
    }
  }


  const handleupdate = (reviewId: any, liked: boolean) => {
    console.log(reviewId, 'this the review id');
    console.log(liked, 'this is the liked');

    if (!data?.testimonial?.review) {
      return;
    }

    // Create a new array with updated review objects
    const filterReviews = data.testimonial.review.map((ele) => {
      if (ele?.reviewId?.toString() === reviewId?.toString()) {
        console.log('heheh', ele)
        return { ...ele, liked: liked }; // Return updated review
      }
      return ele; // Return unchanged review
    });

    console.log(filterReviews, 'this is filterReviews revdata');
    // data.testimonial.review=filterReviews;
    // setRevData(filterReviews); // Update state with the new array
    // console.log(filterReviews, 'this is the one');

  };


  // Function to handle checkbox changes
  const handleCheckboxChange = (state: number) => {
    setFilterState(state);
    handleFilter(state);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-center text-3xl lg:text-2xl font-bold text-slate-600 mb-6'>
        Testimonial Details
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
        <div className='md:col-span-3 bg-white p-6 rounded-lg shadow-md'>
          <div className='flex flex-col space-y-4'>
            <div className='grid grid-cols-12 items-center'>
              <label className='col-span-9 text-md font-semibold mr-4'>
                Liked
              </label>
              <input
                name='liked'
                type='checkbox'
                className='col-span-3 form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded'
                checked={filterState === 1}
                onChange={() => handleCheckboxChange(1)}
              />
            </div>

            <div className='grid grid-cols-12 items-center'>
              <label className='col-span-9 text-md font-semibold mr-4'>
                Disliked
              </label>
              <input
                name='disliked'
                type='checkbox'
                className='col-span-3 form-checkbox h-5 w-5 text-red-600 border-gray-300 rounded'
                checked={filterState === 0}
                onChange={() => handleCheckboxChange(0)}
              />
            </div>

            <div className='grid grid-cols-12 items-center'>
              <label className='col-span-9 text-md font-semibold mr-4'>
                All
              </label>
              <input
                name='all'
                type='checkbox'
                className='col-span-3 form-checkbox h-5 w-5 text-gray-600 border-gray-300 rounded'
                checked={filterState === -1}
                onChange={() => handleCheckboxChange(-1)}
              />
            </div>
          </div>
        </div>

        <div className='md:col-span-9 bg-white p-6 rounded-lg shadow-md'>
          <p className='text-2xl text-center text-slate-600 font-bold mb-4'>Reviews</p>
          <div>
            {revData?.map((ele: Review, index: number) => (
              <ReviewComponent key={index} data={ele} funsetRevData={handleupdate} />
            ))}
          </div>
          {
            revData.length == 0 &&
            <p className='text-center font-bold text-slate-600 text-4xl my-20 '>No Reviews Yet</p>
          }
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { Tid, userId, token } = context.query;
  try {
    const url = "http://localhost:3000/api/route/user";
    const response = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = response.data?.data?.testimonials;
    let filterData = data.filter((ele: any) => (ele?.testimonial?._id)?.toString() === Tid && (ele?.testimonial?.User)?.toString() === userId);
    if (filterData.length > 0) {
      const id = filterData[0].testimonial._id;
      filterData[0].testimonial.review = filterData[0].testimonial.review.map((e: any) => {
        e.id = id;
        return e;
      });
    }

    return {
      props: {
        data: filterData[0] || null,
        Tid,
        userId
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default SingleTestimonial;
