import React, {Component, useState, useEffect, useReducer } from 'react';
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {stat} from "fs";

type State =
    | {status: 'empty'}
    | {status: 'loading'}
    | {status: 'error', error: string }
    | {status: 'success', data: HSWReponse}

type HSWReponse = {
    results: {
        mal_id : number;
        url : string;
        title : string;
        synopsis : string;
        episodes : number;
        score : number;
    }[]
};

type Action =
    | { type: 'request' }
    | { type: 'success', found: HSWReponse }
    | { type: 'failure', error: string };

function reducer(state: State, action : Action): State {
    switch (action.type) {
        case 'request':
            return { status: 'loading' };
        case 'success':
            return { status: 'success', data: action.found };
        case 'failure':
            return { status: 'error', error: action.error };
    }
}

const RetrieveAnime = () =>{
    const [query, setQuery] = useState<string>();
    const [state, dispatch] = useReducer(reducer, {status: 'empty'});

    function getInfo(){

        const getAnime : string = (document.getElementById("anime-search") as HTMLInputElement).value;
        if(getAnime === null){
            alert("Get Anime is null");
        }else {
            setQuery(getAnime);
        }

    }

    useEffect(() =>{
        let ignore = false;

        dispatch({ type: 'request'});
        const finalResult = `https://api.jikan.moe/v3/search/anime?q=${query}`;
        {console.log(JSON.stringify(finalResult))}
        axios(finalResult).then(
            (results) => {if(!ignore) dispatch({ type : 'success', found:
            results.data}); },
            (error) => dispatch({ type: 'failure', error}),

        )
        return () => { ignore = true; }
    }, [query]);

    return(
        <div>
            <TextField id="anime-search" label="Filled" variant="filled" />
            <Button onClick={getInfo} variant="contained">Search</Button>

            {/*<input value={query} onClick={e => setQuery(e.target.value)}/>*/}
            {state.status === 'loading' && <span>Loading...</span>}
            {state.status === 'success' && <ul>
                {state.data && state.data.results && state.data.results.map(item =>(
                    <li key={item.mal_id}>
                        <a href = {item.url}>{item.title}</a>
                    </li>
                ))}
            </ul>}
            {state.status === 'error' && <span>Error: {state.error}</span>}

        </div>
    );
}

export default RetrieveAnime;