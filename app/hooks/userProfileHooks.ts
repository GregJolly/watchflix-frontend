'use client'
import { deleteUserMovie, getUserProfile, listUserMovies, toggleFavorite, toggleWatchList } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProfile() {
    const [myMovies, setMyMovies] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refresh = async () => {
        const updated = await listUserMovies();
        setMyMovies(updated);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }

        const init = async () => {
            setLoading(true);
            try {
                const [moviesList, userProfile] = await Promise.all([
                    listUserMovies(),
                    getUserProfile()
                ]);
                setMyMovies(moviesList);
                setUsername(userProfile.username);
            } catch(err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [])

    const handleToggleFavorite = async (tmdbId: number) => {
        try {
            await toggleFavorite(tmdbId);
            await refresh();
        } catch(err) {
            console.error("Failed to toggle favorite", err);
        }
    }

    const handleToggleWatched = async (tmdbId: number) => {
        try {
            await toggleWatchList(tmdbId);
            await refresh();
        } catch(err) {
            console.error("Failed to toggle watched", err);
        }
    }

    const handleRemove = async (tmdbId: number) => {
        try {
            await deleteUserMovie(tmdbId);
            await refresh();
        } catch(err) {
            console.error("Failed to remove movie", err);
        }
    }

    const watchlist  = myMovies.filter((m: any) => m.status === 'WATCHLIST');
    const watched    = myMovies.filter((m: any) => m.status === 'WATCHED');
    const favourites = myMovies.filter((m: any) => m.favourite === true);

    return {
        username,
        loading,
        watchlist,
        watched,
        favourites,
        handleToggleFavorite,
        handleToggleWatched,
        handleRemove
    }
}