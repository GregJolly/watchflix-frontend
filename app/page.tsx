"use client"
import router, { useRouter } from "next/navigation";
import { login, register } from "../lib/api";
import { useState } from "react";


export default function Home() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleRegister = async() => {

      try
      {

        const response = isLogin ? await login(username, password) : await register(username, password); 
        if(!response.token)
        {
          setError(true);
          return; 
        }
        localStorage.setItem('token', response.token);
        router.push('/movies');

      }
      catch(err)
      {
        setError(true); 
      }
  }

  return (
    
    <div className="flex min-h-screen  bg-zinc-950 ">
      {/* LEFT */}
      <div className="hidden flex-1 md:flex flex-col justify-center p-20">
        <h1 className=" font-bebas text-white  text-5xl lg:text-8xl font-bold tracking-widest">
          <span className="text-red-600">WATCH</span>FLIX
        </h1>
        <p className="font-sans text-zinc-500 text-xl font-medium leading-relaxed mt-4">
          Discover, track, and share your favorite films all in one place.
        </p>
      </div>
      <div className="w-px bg-zinc-800 " />
      {/* RIGHT */}
      <div className="w-full font-sans md:w-96 flex flex-col justify-center p-16 bg-zinc-900 gap-6">
        <h1 className="text-white text-3xl font-semibold tracking-tighter  ">{isLogin ? "Welcome back!" : "Join Now"}</h1>
        <div className="flex flex-col justify-center gap-2">
          <input type="text" value={username}  onChange={(e) => setUsername(e.target.value)} placeholder="Username" 
          className="
          text-white
          bg-zinc-950
          py-3 px-4
          rounded-lg
          border border-zinc-700
          focus:outline-none
          focus:ring-2 focus:ring-red-600

          "
          />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="text-white
                  text-white
          bg-zinc-950
          py-3 px-4
          rounded-lg
          border border-zinc-700
          focus:outline-none
          focus:ring-2 focus:ring-red-600"/>

        </div>
        <div className="text-red-600 text-xs">{error ? "Something went wrong. Try again." : ""}</div>
        <button className="bg-red-600 p-3 rounded-full hover:bg-red-800 text-white transition-all duration-200" onClick={handleRegister}>{isLogin ? "Login" : "Register"}</button>
        <div>
          <span className="text-zinc-500"> {isLogin ? "Don't have an account?" : "Already a user? "}</span>
          <button className="text-red-600 hover:underline ml-2" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
