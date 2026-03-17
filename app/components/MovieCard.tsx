import { useRouter } from 'next/navigation'
import React from 'react'

interface Props{
    movie: any ,
    actions?: React.ReactNode,
    topRight?: React.ReactNode,
}


export default function MovieCard({movie, actions, topRight}: Props) {


    const router = useRouter(); 

    return (
        <div  key={movie.tmdbId}className='relative overflow-hidden w-56 bg-zinc-800 shrink-0  rounded-lg  '>
            {topRight && (<div className='absolute top-2 right-2 z-10'>{topRight}</div>)}

            <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
                onClick={()=>router.push(`/movies/${movie.tmdbId}`)} 
                className='w-full h-64 hover:scale-105 transition-transform duration-200 cursor-pointer object-cover'/>

            <div className='p-4'>

                <h3 className='text-lg font-semibold truncate'>{movie.title}</h3>

                <p className='text-sm text-zinc-500'>
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                </p>
            
                <div className="flex items-center mt-4">
                    

                    {actions && actions}
                    

                </div>
            </div>
        </div>
    )
                                                        
}
