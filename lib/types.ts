export interface MovieSummary {
    id: number, 
    title: string, 
    releaseDate: string,
    posterPath: string 
}

export interface MovieDetails extends MovieSummary {

    overview: string, 
    director: string, 
    cast: string[]
}

export interface UserMovie extends MovieSummary {

    status: 'WATCHLIST' | 'WATCHED', 
    favorite: boolean, 
    rating: number

}

export interface UserProfile{
    id: string, 
    username: string 
}

export interface AuthResponse {
    token: string
}