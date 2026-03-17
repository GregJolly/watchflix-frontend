"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { searchMovie, searchUsers } from '@/lib/api';


export default function UserSearch() {

        const router = useRouter();
        const [searchQuery, setSearchQuery] = useState<string>('');
        const [searchResults, setSearchResults] = useState([]);
        const [loading, setLoading] = useState(false);
        
        
    
        useEffect(()=>
            {
            const token = localStorage.getItem('token'); 
    
            if(!token)
            {
                router.push('/');
            }
    
            
    
            },[])

        

        useEffect(() => {
            const timer = setTimeout(async () => {
                try {
                    setLoading(true);
                    if (searchQuery.trim() !== '') {
                        const data = await searchUsers(searchQuery);
                        setSearchResults(data);
                    } else {
                        setSearchResults([]);
                    }
                } catch(err) {
                    console.error("Failed to search users", err);
                } finally {
                    setLoading(false);
                }
            }, 400)
        
            return () => clearTimeout(timer);
        }, [searchQuery])





  return (
    <div>
        <div className=' text-white font-sans  min-h-screen  bg-zinc-950'>
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-6  container mx-auto p-4">
                <div className=" w-full ">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} type="text" placeholder="Search for users... " className="py-5 px-5  w-full text-2xl text-white placeholder:text-zinc-500 border border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <main className='container mx-auto'>
                    <div className='flex flex-col gap-6 '>

                        {
                        searchResults.length > 0 ? (<div>
                            {searchResults.map((user: any, index) => {
                                return (
                                    <button
                                        onClick={() => router.push(`/users/${user.username}`)}
                                        key={user.id}
                                        className='flex items-center gap-4 w-full bg-zinc-800 text-white p-4 hover:bg-zinc-700 transition-all duration-200 cursor-pointer rounded-xl mb-3'>
                                        <div className='w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg shrink-0'>
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <h2 className='font-medium'>{user.username}</h2>
                                    </button>
                                )
                            })}
                        </div>) : (
                            <div>
                                {searchQuery && <p className='text-zinc-500 text-center'>No users found for "{searchQuery}"</p>}
                            </div>
                        )
                    }

                    </div>
                </main>
                
            </div>

        </div>
    </div>
  )
}
