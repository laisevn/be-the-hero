import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api'

import './styles.css';

import logImg from '../../assets/logo.svg';

const Profile = () => {
    const [incidents, setIncidents] = useState([]);

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    const history = useHistory();

    useEffect(() => {
        api.get('/profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);
    //Dispara uma funçāo em um determinado momento da aplicaçāo
    //2 parâmetros: func a ser executada e quando.
    //O 2 elemento é um array de dependencia, toda vez que este
    // este parametro muda a func é executada. Se o array é vazio
    // executa uma unica vez no fluxo do componente

    const handleDeleteIncident = async id => {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => 
                    incident.id !== id
                )
            );
        } catch(error) {
            alert("Erro ao deletar caso, tente novamente.");
        }
    }

    const handleLogout = () => {
        localStorage.clear();

        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logImg} alt="Be The Hero"/>
                <spam>Bem vinda, {ongName} </spam>

                <Link className="button" to="/casos/novo">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                { incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇĀO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL'
                                }).format(incident.value)
                            }</p>

                        <button 
                            onClick={() => handleDeleteIncident(incident.id)} 
                            type="button"
                            >
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default Profile;