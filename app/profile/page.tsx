"use client"
import { getUserProfile, listUserMovies } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ProfilePage() {

    const [myMovies, setMyMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const router = useRouter();

    useEffect(()=>
        {
            const token = localStorage.getItem('token'); 

            if(!token)
            {
                router.push('/');
            }
            const init = async() => {
                setLoading(true);
                try {
                    
                    const[moviesList, userProfile] = await Promise.all([listUserMovies(), getUserProfile()]); 
                    setMyMovies(moviesList); 
                    setUsername(userProfile.username); 
                }
                catch(err)
                {
                    console.error("failed to fetch profile data", err); 
                }
                finally{
                    setLoading(false);
                }
            }
    
            init();
            
            
        },
    [])

    useEffect(()=>{

    },[myMovies])


    const loadingScreen = () => {
        return (
            
                <div className="  grid grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="bg-zinc-800 animate-pulse h-64 w-full rounded-lg"></div>
                    ))}

                </div>
            
        )
    }

    return (
        <div className="min-h-screen font-sans text-white bg-zinc-950  ">

            {/* NAVBAR */ }
            <div className=" sticky top-0 z-50 bg-zinc-900 mb-6 ">
                <nav className="flex items-center  p-4 bg-zinc-900 mb-6 text-white gap-8 max-w-3xl lg:max-w-7xl mx-auto justify-between"> 
                    <div className="flex flex-1 gap-8">
                    <h1 className="font-bebas tracking-wide text-3xl font-semibold"><span className="text-red-500">WATCH</span>FLIX</h1>
                    <button  onClick={()=>(
                        router.push("/movies")
                    )
                    } className="font-semibold cursor-pointer">Popular</button>

                    <button onClick={()=>(router.push("/movies"))} className="font-semibold cursor-pointer">Friends</button>
                    <button onClick={()=>(router.push("/profile"))}  className="font-semibold cursor-pointer">Profile</button>
                    </div>
                    

                </nav>
            </div>
            <div className='flex flex-col justify-center  gap-6  max-w-6xl lg:max-w-7xl mx-auto p-4'>
            {/* CONTENT */ }  
            {loading ? loadingScreen() :    
                <div>
                        <h1 className="text-4xl  tracking-tighter text-white  mb-16" >{username}'s List</h1>

                        <div>
                            <h2 className='text-white font-bold text-3xl tracking-tighter mb-6'>Need To Watch</h2>
                            {myMovies.length === 0 ? (
                                <div className='flex justify-center items-center flex-col mt-12'>
                                    <p className='text-zinc-500 mt-4'> Nothing to see here! Add movies to your list </p>
                                </div>
                            ):(
                                <div>
                                    <div className='flex overflow-x-auto no-scrollbar gap-6' > 
                                        {
                                            myMovies.map((movie: any)=> (
                                            <div  key={movie.tmdbId}className='bg-zinc-800 shrink-0 w-44 rounded-lg overflow-hidden'>
                                                <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                                    alt={movie.title}
                                                    className='w-full aspect-2/3 object-cover'/>
                                                <div className='p-3'>
                                                    <h3 className='text-sm font-semibold truncate'>{movie.title}</h3>
                                                    <p className='text-xs text-zinc-500'>
                                                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                                                    </p>
                                                    <div className="flex items-center justify-center mt-4">
                                                
                                                <div className="flex items-center gap-8 mt-4">
                                                    

                                                    {
                                                        !myMovies.has(movie.id) ? (<svg xmlns="http://www.w3.org/2000/svg" onClick={()=>(handleAddMovies(movie.id, movie.title, movie.posterPath, movie.releaseDate))} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-white hover:scale-105 text-zinc-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>)
                                                        :
                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={()=>(handleAddMovies(movie.id, movie.title, movie.posterPath, movie.releaseDate))} fill="currentColor" className="size-8 hover:text-green-400 hover:scale-105 text-green-700">
                                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                        </svg>
                                                        )
                                                    }
                                                    

                                                </div>
                                        </div>
            
                                                </div>
                                            </div>
                                            ))
                                        }
                                        </div>
                                </div>
                            )}
                        </div>
    
                </div>             
            }
            </div>
        


        </div>

    )
}

export default ProfilePage