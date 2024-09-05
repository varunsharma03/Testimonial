import { useState } from "react";
import Image from "next/image";
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/router";
import { toast } from 'react-hot-toast';

const UserPage = () => {
    const router = useRouter();

    const [userdata, setUserData] = useState({
        name: '',
        password: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [flag, setFlag] = useState(false);
    const [loader, setLoader] = useState(false);
    const handleSumbit = async (ele: any) => {
        const { name, password, email } = ele;
        console.log('Submitting data:', { name, password, email, flag });

        setLoader(true);

        try {
            if (flag) {
                const dataSubmit = await axios.post('/api/route/user/signup', { name, password, email });
                toast.success('Account Created Successfully Please Login to continue'
                );
                setTimeout(router.reload);
                
            } else {
                const data = await axios.post('/api/route/user', { password, email });
                if (!data.data) {
                    toast.error('Wrong password');
                    return;
                }
                const token = data.data?.data?.token;
                if(token){
                    toast.success(data.data.message);
                setTimeout(() => {
                    setLoader(false);
                    router.push(`/users/home/${token}`);
                }, 2000);
                }else {
                    setLoader(false);
                    toast.error('Error while Login')
                }
                
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                toast.error(`${error.response?.data?.message}` );
            } else {
                // Handle unexpected errors
                toast.error('An unexpected error occurred');
            }
             setLoader(false);
        } 
    };

    return (
        <div className="relative">
            {/* Header with Image and Title */}
            <div className="flex justify-start items-center gap-5 p-4">
                <Image
                    src='/OIP.jpg'
                    alt="testi"
                    width={75}
                    height={75}
                    className="object-cover"
                />
                <p className="text-lg font-semibold text-gray-800">Testimonial</p>
            </div>

            {/* Main Content */}
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">Welcome To Testimonial</p>

                <div className="mt-10 bg-blue-100 w-[500px] h-auto mx-auto p-6 rounded-lg shadow-lg">
                    {flag && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name..."
                            onChange={handleChange}
                            className="p-3 border-2 border-gray-300 rounded-md w-full mb-4"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email..."
                        onChange={handleChange}
                        className="p-3 border-2 border-gray-300 rounded-md w-full mb-4"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        onChange={handleChange}
                        className="p-3 border-2 border-gray-300 rounded-md w-full mb-4"
                    />
                    <button
                        onClick={() => handleSumbit(userdata)}
                        className="bg-blue-500 w-48 h-10 rounded-md text-white mb-4"
                    >
                        {flag ? "Sign Up" : "Sign In"}
                    </button>
                    <p
                        className="cursor-pointer text-blue-600"
                        onClick={() => setFlag(prevFlag => !prevFlag)}
                    >
                        {flag ? "Click to login" : "Not Registered??"}
                    </p>
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

export default UserPage;
