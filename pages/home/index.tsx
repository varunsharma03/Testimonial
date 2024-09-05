import Image from "next/image";
import { useRouter } from "next/router";

const Homepage = () => {
    const router = useRouter();
    
    return (
        <div>
            {/* Navbar */}
            <div className="flex justify-evenly gap-8 px-6 py-4">
                <div className="p-5 flex justify-between gap-4 items-center">
                    <Image
                        src="/OIP.jpg"
                        alt="Logo"
                        className="dark:invert"
                        width={50}
                        height={50}
                        priority
                    />
                    <p className="font-bold text-xl text-slate-500">Testimonials</p>
                </div>
                <div className="flex justify-between gap-4 p-5 mt-2">
                    <button
                        onClick={() => router.push('/users')}
                        className="px-3 h-10 py-1 text-lg"
                    >
                        Sign In
                    </button>
                    <button className="bg-blue-600 px-3 h-10 py-1 text-white text-lg"
                     onClick={() => router.push('/users')}>
                        Sign Up
                    </button>
                </div>
            </div>
            {/* Content */}
            <div>
                <p className="mt-10 text-center text-4xl font-bold text-slate-800">
                    Get testimonials from your customers with ease
                </p>
                <p className="mt-10 text-center text-xl text-slate-600">
                    Collecting testimonials is hard, we get it! So we built Testimonial. In minutes, you can collect text and video testimonials from your customers with no need for a developer or website hosting.
                </p>
                <div className="flex justify-center items-center">
                    <button className="mt-10 bg-blue-600 text-white w-44 h-12 p-4 rounded-md hover:bg-blue-500 transition-all duration-175 text-center">
                        Try for FREE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
