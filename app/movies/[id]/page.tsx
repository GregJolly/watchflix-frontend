"use client"
import { addMovies, deleteUserMovie, getMovieById, listUserMovies, rateMovie, toggleFavorite, toggleWatchList } from '@/lib/api';
import { MovieSummary, MovieDetails, UserMovie } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Movie() {

    const params = useParams();
    const movieId = params.id as string ;
    const router = useRouter();
    const [movieFound, setMovieFound] = useState<UserMovie | null>(null); 
    const [moviesDetails, setMoviesDetails] = useState<MovieDetails | null>(null);
    const [addedMovies, setAddedMovies]=  useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);


    useEffect
    (()=> 
        {

            const token = localStorage.getItem('token');
            if(!token) {router.push("/"); return;}

            
            const init = async() => 
            {
                setLoading(true); 

                try {
                    const [movieDetails, myList] = await Promise.all(
                        [getMovieById(movieId), listUserMovies()]
                    );
                    setMoviesDetails(movieDetails);
                    
                    const found = myList.find((movie:any)=> movie.tmdbId === Number(movieId)); 
                    setMovieFound(found || null);
                    setRating(found?.rating || 0); 

                }
                catch(err){
                    console.error("Could not fetch movie details and user list details", err); 
                }
                finally
                {
                    setLoading(false); 
                }

            }

            init(); 
        },
    [])

    useEffect(() => {
        setRating(movieFound?.rating || 0);
    }, [movieFound])

        const handleToggleFavorite = async(tmdbId: number) => {
            try{
                const res = await toggleFavorite(tmdbId);
                const updated = await listUserMovies();
                setMovieFound(updated.find((movie:any)=> movie.tmdbId === tmdbId) || null);
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
                setMovieFound(updated.find((movie:any)=> movie.tmdbId === tmdbId) || null);
            }
            catch(err)
            {
                console.error("Failed to toggle watch status", err);
            }
        }
    
        const handleRemove = async(id: number) => {
            try{
                const res = await deleteUserMovie(id);
                const updated = await listUserMovies();
                setMovieFound(updated.find((movie:any)=> movie.tmdbId === id) || null);
            }
            catch(err)
            {
                console.error("Failed to delete user movie", err);
            }
        }
     const handleRating = async(tmdbId: number, rating: number) => {
        try{
            const res = await rateMovie(tmdbId, rating);
            const updated = await listUserMovies();
            setMovieFound(updated.find((movie:any)=> movie.tmdbId === tmdbId) || null);
        }
        catch(err)
        {
            console.error("Failed to update rating", err);
        }
     }

     const handleAddMovies = async (tmdbId: number, title: string, posterPath: string, releaseDate: string) => {
        try {
            if (movieFound) {
                await deleteUserMovie(tmdbId);
                setMovieFound(null);
            } else {
                await addMovies(tmdbId, 'WATCHLIST', title, posterPath, releaseDate);
                const updated = await listUserMovies();
                setMovieFound(updated.find((m: any) => m.tmdbId === tmdbId) || null);
            }
        } catch(err) {
            console.error("Failed to add/remove movie", err);
        }
    }
     const eye = () => {
        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={()=>handleToggleWatched(moviesDetails?.id as number)} fill="currentColor" className={`size-8 ${movieFound?.status === 'WATCHED' ? `text-amber-300` : `text-zinc-500`} hover:text-white transition-all duration-200`}>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
      </svg>)
     }

     const plusCircle = () => {
        return (
            (<svg xmlns="http://www.w3.org/2000/svg" onClick={()=>(handleAddMovies(moviesDetails?.id as number, moviesDetails?.title as string , moviesDetails?.posterPath as string , moviesDetails?.releaseDate as string ))} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-white hover:scale-105 text-zinc-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>)
        )}

    const heartFill = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleToggleFavorite(Number(moviesDetails?.id))} viewBox="0 0 24 24" fill="currentColor" className={`size-8 ${movieFound?.favorite ? 'text-red-700' : 'text-zinc-500'} hover:text-red-500 transition-all duration-200`}>
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>

        )
    }
    

    const addedButton = () => {
        return  (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={()=>handleAddMovies(moviesDetails?.id as number, moviesDetails?.title as string , moviesDetails?.posterPath as string , moviesDetails?.releaseDate as string)} fill="currentColor" className="size-8 hover:text-green-400 hover:scale-105 text-green-700">
           <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
       </svg>
       
        )
     }
  return (
    <div className='min-h-screen font-sans text-white bg-zinc-950 '>
        <div className=" sticky top-0 z-50 bg-zinc-900 mb-6 ">
                <nav className="flex items-center p-4 bg-zinc-900 mb-6 text-white gap-8 container mx-auto justify-between"> 
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
        {
           
        loading ? (<div>
            Loading...
            </div> )
            :

        (
        <div className='container mx-auto py-10 px-4 flex flex-col md:flex-row md:justify-between md:items-start items-center justify-center  gap-8'>
            {/* poster */}
            <div className="shrink-0 w-80">
            <img 
                src={`https://image.tmdb.org/t/p/original${moviesDetails?.posterPath}`}
                alt={moviesDetails?.title}
                className="w-full rounded-xl object-cover aspect-[2/3]"
            />
         </div>

            {/* text details */}
            <div className='flex flex-col '>
                {/* title(release date) */}
                <div className='flex flex-col justify-center items-center md:items-start  gap-2 mb-4'>
                    <h1 className='text-4xl font-bold'>{moviesDetails?.title}</h1>
                    <p className='text-2xl text-zinc-500'>{moviesDetails?.releaseDate ? new Date(moviesDetails?.releaseDate).getFullYear(): 'N/A'}</p>
                </div>
                <div className='flex justify-center md:justify-start gap-3 mb-6'>
                {movieFound?.status === 'WATCHED' && 
                [1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => {
                                setRating(star);
                                handleRating(Number(movieId), star);
                            }}
                            className={`text-xl transition-all duration-200 hover:text-amber-300
                                ${star <= rating 
                                    ? 'text-amber-400' 
                                    : 'text-zinc-600'
                                }`}>
                            ★
                        </button>
                    ))}
                    </div>

                {/* user actions */}
                <div className='flex justify-center md:justify-start gap-6 mb-4'>
                    
                    {
                        !movieFound ? plusCircle() : (
                            <div className='flex items-center gap-6'>
                                {addedButton()}
                                {eye()}
                                {movieFound?.status === 'WATCHED' && heartFill()}
                            </div>
                        )
                    }

                </div>
                {/* overview */}
                <div>
                    
                    <p className='mt-4 text-zinc-300'>{moviesDetails?.overview}</p>

                </div>

            </div>
            
            <div></div>
            <div></div>
        </div>
    )}
    </div>
        
    )
}

