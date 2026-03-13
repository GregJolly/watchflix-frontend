import { useRouter } from 'next/navigation'
import React from 'react'


export default function Navbar() {

    const router = useRouter();
  return (
    
        <div className=" sticky top-0 z-50 bg-zinc-900 mb-6 ">
                <nav className="flex items-center p-4 bg-zinc-900 mb-6 text-white gap-8 container mx-auto justify-between"> 
                    <div className="flex flex-1 gap-8">
                    <h1 className="font-bebas tracking-wide text-3xl font-semibold"><span className="text-red-500">WATCH</span>FLIX</h1>
                    <button  onClick={()=>(
                        router.push("/movies")
                    )
                    } className="font-semibold cursor-pointer">Popular</button>

                    <button onClick={()=>(router.push("/users"))} className="font-semibold cursor-pointer">Friends</button>
                    <button onClick={()=>(router.push("/profile"))}  className="font-semibold cursor-pointer">Profile</button>
                    </div>
                    

                </nav>
        </div>
  )
}
