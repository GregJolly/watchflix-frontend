"use client"
import React, { useState } from 'react'

import MovieRow from './MovieRow'
import { useProfile } from '../hooks/userProfileHooks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ProfileView() {
    

    const { username, loading, watchlist, watched, handleToggleFavorite, handleToggleWatched, handleRemove } = useProfile();

    const [filter, setFilter] = useState<'FAVORITE' | 'RATED' | 'ALL'>('ALL');
    const filteredWatched = watched.filter((m:any)=>{
      if(filter == 'FAVORITE')  return m.isFavorite;
      if(filter == 'RATED') return m.rating > 0;
      return true; 

    })

  return (
    <div>
        <div className='flex flex-col justify-center '>
            
            <h1 className="text-6xl font-bebas text-center tracking-wider text-white  mb-16" ><span className='text-red-600'>{username}'s</span>  List</h1>

            <MovieRow
             RowName="Previously Watched" movies={[]} 
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
             renderTopRight={(movie: any) => (
                <button
                onClick={() => handleRemove(movie.tmdbId)}
                className='absolute top-2 right-2 bg-black/60 hover:bg-red-600 rounded-full p-1 transition-all duration-200 z-10 cursor-pointer'>
                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-amber-600 hover:text-amber-500 transition-all duration-200">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>

                </button>
             )}
            />

        </div>
    </div>
  )
}
