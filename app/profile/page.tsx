"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteUserMovie, getUserProfile, listUserMovies, toggleFavorite, toggleWatchList } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';

function ProfilePage() {

    const [myMovies, setMyMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filter, setFilter ] = useState<'favorites' | 'rated' | 'watched'>('watched');
    const watchlist = myMovies.filter((m: any) => m.status === 'WATCHLIST');
    const watched = myMovies.filter((m: any)=>
        m.status === 'WATCHED');
    const favorites = myMovies.filter((m: any) => m.favorite);
    const router = useRouter();
    const filteredWatched = watched.filter((movie: any) => {
        if(filter === 'favorites') return movie.favorite; 
        if(filter === 'rated') return movie.rating > 0;
        return true;
    })

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

    const handleToggleFavorite = async(tmdbId: number) => {
        try{
            const res = await toggleFavorite(tmdbId);
            const updated = await listUserMovies();
            setMyMovies(updated);
        }catch(err)
        {
            console.error("Failed to toggle favorite status", err);
        }
    }
    const handleToggleWatched = async(tmdbId: number) => {
        try
        {
            const res = await toggleWatchList(tmdbId);
            const updated = await listUserMovies();
            setMyMovies(updated);
        }
        catch(err)
        {
            console.error("Failed to toggle watch status", err);
        }
    }

    const handleRemove = async(tmdbId: number) => {
        try{
            const res = await deleteUserMovie(tmdbId);
            const updated = await listUserMovies();
            setMyMovies(updated);
        }
        catch(err)
        {
            console.error("Failed to delete user movie", err);
        }
    }
    const heartFill = (movie: any) => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleToggleFavorite(movie.tmdbId)} viewBox="0 0 24 24" fill="currentColor" className={`size-8 ${movie.favorite ? 'text-red-700' : 'text-zinc-500'} hover:text-red-500 transition-all duration-200`}>
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>

        )
    }

    const starFill = ()=> {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>

        )
    }

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
            <Navbar />
            <div className='flex flex-col justify-center  gap-6  container mx-auto p-6'>
            {/* CONTENT */ }  
            {loading ? loadingScreen() :    
                <div>
                    <div className='flex flex-col justify-center '>
                        
                        <h1 className="text-6xl font-bebas text-center tracking-wider text-white  mb-16" ><span className='text-red-600'>{username}'s</span>  List</h1>

                        <div className='mb-16'>
                            <div className='flex items-start justify-between gap-8'>
                                <h2 className='text-white font-semibold text-3xl tracking-tighter mb-6'>Previously Watched</h2> 
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="bg-zinc-800 border border-zinc-700 text-white font-sans rounded-lg p-2 w-48">
                                        <DropdownMenuItem onClick={()=>{setFilter('watched')}}>
                                            All
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem onClick={()=>{setFilter('favorites')}}>
                                            Favorites
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>{setFilter('rated')}}>
                                            Rated
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {filteredWatched.length === 0 ? (
                                <div className='flex justify-center items-center flex-col h-64 '>
                                    <p className='text-zinc-500 mt-4'> Nothing to see here! Watch more shows and movies. </p>
                                </div>
                            ):(
                                <div>
                                    <div className='flex overflow-x-auto no-scrollbar p-6 gap-6' > 
                                        {
                                            filteredWatched.map((movie: any)=> (
                                            <div  key={movie.tmdbId}className='relative overflow-hidden w-56 bg-zinc-800 shrink-0  rounded-lg  '>
                                                <button
                                                    onClick={() => handleToggleWatched(movie.tmdbId)}
                                                    className='absolute top-2 right-2 bg-black/60 hover:bg-red-600 rounded-full p-1 transition-all duration-200 z-10 cursor-pointer'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                                    alt={movie.title}
                                                    onClick={()=>router.push(`/movies/${movie.tmdbId}`)} 
                                                    className='w-full h-64 hover:scale-105 transition-transform duration-200 cursor-pointer object-cover'/>
                                                <div className='p-4'>
                                                    <h3 className='text-lg font-semibold truncate'>{movie.title}</h3>
                                                    <p className='text-sm text-zinc-500'>
                                                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                                                    </p>
                                                    <div className="flex items-center justify-center mt-4">
                                                
                                                    <div className="flex items-center mt-4">
                                                        

                                                        {
                                                          heartFill(movie)
                                                          
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
                        <div>
                            <h2 className='text-white font-semibold text-3xl tracking-tighter mb-6'>Need to Watch</h2>
                            {watchlist.length === 0 ? (
                                <div className='flex justify-center items-center  p-6 h-64'>
                                    <p className='text-zinc-500 mt-4'> Nothing to see here! Watch more! </p>
                                </div>
                            ):(
                                <div>
                                    <div className='flex overflow-x-auto no-scrollbar p-6 gap-6' > 
                                        {
                                            watchlist.map((movie: any)=> (
                                            <div  key={movie.tmdbId}className='relative overflow-hidden w-56 bg-zinc-800 shrink-0  rounded-lg  hover:scale-105 transition-transform duration-200 cursor-pointer'>
                                                <button
                                                    onClick={() => handleRemove(movie.tmdbId)}
                                                    className='absolute top-2 right-2 bg-black/60 hover:bg-red-600 rounded-full p-1 transition-all duration-200 z-10 cursor-pointer'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                                    alt={movie.title}
                                                    onClick={()=>router.push(`/movies/${movie.tmdbId}`)} 
                                                    className='w-full h-64 object-cover'/>
                                                <div className='p-3'>
                                                    <h3 className='text-sm font-semibold truncate'>{movie.title}</h3>
                                                    <p className='text-xs text-zinc-500'>
                                                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                                                    </p>
                                                     <div className="flex items-center justify-center mt-4">
                                                
                                                    <div className="flex items-center gap-8 mt-4">
                                                        

                                                        {
                                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={()=>handleToggleWatched(movie.tmdbId)} fill="currentColor" className="size-8 text-zinc-500 hover:text-white transition-all duration-200">
                                                             <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                             <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                                           </svg>
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
                    
                </div>             
            }
            </div>
        


        </div>

    )
}

export default ProfilePage