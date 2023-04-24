import { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import api from '../../services/api';
import {toast} from 'react-toastify';
import './filme.css'

function Filme(){
const { id } =useParams();
const navigate = useNavigate();

const [filme, setFilmes] = useState({});
const [loading,setLoading] = useState(true);

useEffect(()=> {
    async function loadFilme(){
        await api.get(`/movie/${id}`, {
            params:{
                api_key: "0da5892a4754534a6b416e79a8bd452f",
                language: "pt-BR",
            }
        })
        .then((response)=>{
            setFilmes(response.data);
            setLoading(false);
        })
        .catch(()=>{
            navigate("/",{ replace: true });
            return;
        })

    }
    loadFilme();

    return () =>{
        console.log('component desmontado')
    }

}, [navigate, id])
    

    function salvarFilme(){
        const minhaLIsta = localStorage.getItem("@primeflix");

        let filmesSalvos = JSON.parse(minhaLIsta) || [];

        const hasFilme = filmesSalvos.some((filmeSalvo)=> filmeSalvo.id === filme.id)

        if(hasFilme){
            toast.warn("Esse filme ja esta na sua lista")
            return
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success("filme salvo com sucesso!")
    }


    if(loading){
        return(
            <div className='filme-info'>
                <h1> Carregando Detalhes... </h1>
            </div>
        )
    }

    return(
        <div className='filme-info'>
            <h1> {filme.title} </h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
            <h3> Sinopse </h3>
            <span> {filme.overview} </span>
            <strong> Avaliação: {filme.vote_average.toFixed(1)} / 10 </strong>

            <div className="area-btn">
                <button onClick={salvarFilme} > Salvar </button>
                <button>
                    <a target='blank' rel='external' href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>
        </div>
    )
}
export default Filme;