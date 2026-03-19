"use client"
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import React from 'react'

import MovieCard from './MovieCard'
 interface Props{
    RowName: string, 
    DropDownMenu? : React.ReactNode,
    renderTopRight?: ( movie: any ) => React.ReactNode,
    renderActions?: ( movie: any ) => React.ReactNode
    userMovies: any[]
 }
export default function MovieRow({RowName, DropDownMenu,renderTopRight, renderActions, userMovies}: Props) {
  return (
    <div className='mb-16'>
            <div className='flex items-start justify-between gap-8'>
                <h2 className='text-white font-semibold text-3xl tracking-tighter mb-6'>{RowName}</h2> 
                {DropDownMenu && DropDownMenu    }
            </div>


            {
                userMovies.length === 0 ? (

                    <div className='flex justify-center items-center flex-col h-64 '>
                        <p className='text-zinc-500 mt-4'> Nothing to see here!  </p>
                    </div>

                ):(
                    <div>
                        <div className='flex overflow-x-auto no-scrollbar p-6 gap-6' > 
                            {
                                userMovies.map((movie: any)=> (
                                    <MovieCard
                                        key={movie.tmdbId}
                                        movie={movie}
                                        actions={renderActions?.(movie)}
                                        topRight={renderTopRight?.(movie)}
                                    
                                    
                                    />
                                ))
                            }
                        </div>
                            
                    </div>
                )   
            }
    </div>

                        
  )
}
