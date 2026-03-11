"use client"

import { addMovies, deleteUserMovie, getPopularMovies, listUserMovies, searchMovie } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MoviesPage() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [addedMovies, setAddedMovies]=  useState<Set<number>>(new Set());
    const router = useRouter(); 


    const handleAddMovies = async(tmdbId: number, title: string, posterPath: string, releaseDate: string ) => {

        try{
            if(addedMovies.has(tmdbId))
            {
                await deleteUserMovie(tmdbId);
                setAddedMovies(prev => {
                    const updated = new Set(prev); 
                    updated.delete(tmdbId);
                    return updated; 
                })
            }
            else
            {
                await addMovies(tmdbId,  'WATCHLIST', title, posterPath, releaseDate);
                setAddedMovies(prev => new Set(prev).add(tmdbId));
            }
        }
        catch(err)
        {
            console.error("Failed to add/remove movie", err);
        }}

    

    useEffect(()=>
        {
        const token = localStorage.getItem('token'); 

        if(!token)
        {
            router.push('/');
        }

        

        },[])
    
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try{
                const [popularMovies, myList] = await Promise.all([getPopularMovies(), listUserMovies()]); 
                setMovies(popularMovies);
                setAddedMovies(new Set(myList.map((movie: any) => movie.tmdbId)));
            }
            catch(err){
                console.error("Failed to initialize movies page", err);

            }
            finally{
                setLoading(false);
            }
        }

        init();
    },[])
    useEffect(() => {
        const timer = setTimeout(async () => {
            
            try {
                setLoading(true);

                if(searchQuery.trim() !== '')
                {
                    
                    const fetchSearch = async () => {
                        const data = await searchMovie(searchQuery);
                        setMovies(data);
                    }
                    fetchSearch();
                }
                else
                {
                    const fetchPopular = async () => {
                        const data = await getPopularMovies();
                        setMovies(data);
                    }
                    fetchPopular();
                }
                
            }
            catch(err)
            {
                console.error("Failed to search movies", err);
            }
            finally
            {
                setLoading(false);
            }
            
        },400)

        return () => clearTimeout(timer);
    },[searchQuery])


    const loadingScreen = () => {
        return (
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="bg-zinc-800 animate-pulse h-64 rounded-lg"></div>
                ))}

            </div>
        )
    }

    return (
    <div className="min-h-screen font-sans text-white bg-zinc-950  ">
        <div className=" sticky top-0 z-50 bg-zinc-900 mb-6 ">
            <nav className="flex items-center  p-4 bg-zinc-900 mb-6   text-white gap-8 max-w-3xl lg:max-w-7xl mx-auto justify-between"> 
                <div className="flex flex-1 gap-8">
                <h1 className="font-bebas tracking-wide text-3xl font-semibold"><span className="text-red-500">WATCH</span>FLIX</h1>
                <button  onClick={()=>(
                    setSearchQuery(''))
                    
                    
                } className="font-semibold cursor-pointer">Popular</button>

                <button onClick={()=>(router.push("/movies"))} className="font-semibold cursor-pointer">Friends</button>
                <button onClick={()=>(router.push("/profile"))}  className="font-semibold cursor-pointer">Profile</button>
                </div>
                

            </nav>
        </div>
        <div className="flex flex-col justify-center items-center gap-6  max-w-6xl lg:max-w-7xl mx-auto p-4">
            <div className=" w-full ">
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} type="text" placeholder="Search movies..." className="py-5 px-5  w-full text-2xl text-white placeholder:text-zinc-500 border border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <main>
                
                    {
                        loading ? loadingScreen() : 
                        <div>
                            <h1 className="text-white font-bold text-3xl mb-6 ">{searchQuery ? `Search for "${searchQuery}"` : "Popular"}</h1>
                            <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                                {movies.map((movie: any, key) => (
                                    <div key={movie.id} className="bg-zinc-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer">
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} className=" w-full h-64 object-cover"/>
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold">{movie.title ?? "Title Unavailable"}</h2>
                                            <p className="text-sm text-zinc-500">{movie.releaseDate ? new Date(movie.releaseDate ).getFullYear() : "N/A"}</p>
                                            <div className="flex items-center justify-center mt-4">
                                                
                                                    <div className="flex items-center gap-8 mt-4">
                                                        

                                                        {
                                                            !addedMovies.has(movie.id) ? (<svg xmlns="http://www.w3.org/2000/svg" onClick={()=>(handleAddMovies(movie.id, movie.title, movie.posterPath, movie.releaseDate))} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-white hover:scale-105 text-zinc-400">
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
                                ))}
                            </div>
                        </div>
                    }

                
            </main>
        </div>
    </div>
    )
}

