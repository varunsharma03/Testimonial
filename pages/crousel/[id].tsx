import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';

interface CarouselProps {
  Tid: string;
  data: any;
  visible: boolean;
}

const Carousel1 = (props: CarouselProps) => {
  const reviewData = props?.data || [];
  const makeIframeVisible = props?.visible || false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');

  const createColorGenerator = () => {
    const colors = ['#DCDCDC', '#F5F5DC', '#F0E68C'];
    let index = 0;

    return () => {
      index = (index + 1) % colors.length;
      return colors[index];
    };
  };
  const getRandomColor = createColorGenerator();

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviewData.length - 1 : prevIndex - 1));
    setBgColor(getRandomColor());
  }, [reviewData.length, getRandomColor]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === reviewData.length - 1 ? 0 : prevIndex + 1));
    setBgColor(getRandomColor());
  }, [reviewData.length, getRandomColor]);

  const handleIframe = useCallback(async () => {
    const lastpath= Router.asPath.split('&').slice(0,-1).join();
    const fullUrl = `http://localhost:3000/${Router.basePath}${lastpath}`;
    const iframeTag = `<iframe src="${fullUrl}" frameborder="0" width="100%" height="100%"></iframe>`;

    try {
      await navigator.clipboard.writeText(iframeTag);
      toast.success('Copied to Clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [handleNext]);

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden">
      {makeIframeVisible && (
        <div>
          <p
            onClick={handleIframe}
            className="cursor-pointer p-1 m-2 font-bold text-lg text-slate-500"
          >
            Copy Iframe
          </p>
        </div>
      )}
      <div className="relative w-[80vw] h-[50vh] bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          style={{ backgroundColor: bgColor }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${reviewData.length * 100}%`,
            }}
          >
            {reviewData.map((review: any, index: any) => (
              <div
                key={index}
                className="w-full h-full flex items-center justify-center px-6 py-4 flex-shrink-0"
              >
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-xl font-semibold mb-2">
                    {(review?.name).toUpperCase() || 'No Name'}
                  </h2>
                  <p className="text-gray-600 mb-2 text-center">
                    {review?.email || 'No Email'}
                  </p>
                  <p className="text-gray-800 mb-4 text-center">
                    {(review?.feedback.toUpperCase()) || 'No Feedback'}
                  </p>
                  <div className="flex items-center">
                    {[...Array(review.rating || 0)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handlePrev}
          className="absolute left-1 top-1/4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-transform duration-300 ease-in-out"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-1 top-1/4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-transform duration-300 ease-in-out"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { token, visible } = context?.query;
  const Tid = context.query.id;

  try {
    const url = "http://localhost:3000/api/route/user";
    const response = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = response.data?.data?.testimonials;

    let filterData = data.filter((ele: any) =>
      ele.testimonial._id === Tid
    );

    const reviews = filterData[0]?.testimonial?.review || [];
    return {
      props: {
        data: reviews,
        Tid,
        visible: visible === 'true', // Ensure `visible` is a boolean
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        data: [],
      },
    };
  }
}

export default Carousel1;
