"use client"
import React, { useEffect, useState } from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import MovieRow from '@/app/components/MovieRow';

import { useParams, useRouter } from 'next/navigation';
import { getUserDetails } from '@/lib/api';
import Navbar from '@/app/components/Navbar';

export default function ProfileView() {
    

    const params = useParams();
    const username = params.username as string; // ← from URL
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }

        const init = async () => {
            setLoading(true);
            try {
                const data = await getUserDetails(username); // ← fetches THEIR data
                setProfile(data);
            } catch(err) {
                console.error("Failed to fetch user profile", err);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [])

    const watchlist = profile?.userMovies?.filter((m: any) => m.status === 'WATCHLIST') || [];
    const watched   = profile?.userMovies?.filter((m: any) => m.status === 'WATCHED') || [];

    const [filter, setFilter] = useState('ALL');
    const filteredWatched = watched.filter((movie: any) => {
        if (filter === 'ALL') return true;
        if (filter === 'FAVORITE') return movie.favorite;
        if (filter === 'RATED') return movie.rating !== null;
        return true;
    });


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
    (<div>
        <div className='flex flex-col justify-center '>
            
            <h1 className="text-6xl font-bebas text-center tracking-wider text-white  mb-16" ><span className='text-red-600'>{username}'s</span>  List</h1>

            <MovieRow
             RowName="Previously Watched" 
             DropDownMenu={(
                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="bg-zinc-800 border border-zinc-700 text-white font-sans rounded-lg p-2 w-48">
                                        <DropdownMenuItem onClick={()=>{setFilter('ALL')}}>
                                            All
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem onClick={()=>{setFilter('FAVORITE')}}>
                                            Favorites
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>{setFilter('RATED')}}>
                                            Rated
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
             )}
             
             userMovies={filteredWatched}
            />

            <MovieRow RowName="Need To Watch" userMovies={watchlist} 
            />

            

        </div>
    </div>)}
    </div>
    </div>
    
  )
}
