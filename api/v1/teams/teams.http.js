// Capa de gestion de peticiones HTTP, gestion de estados.
const axios = require('axios').default;
const teamsController = require('./teams.controller');
const { getUser } = require('../auth/users.controller');
const { to } = require('../../../tools/to');
const { fillUserTeam } = require('../../../tools/fillUserTeam');


const getTeamFromGivenUser = async (req, res) => {
    // TODO obtener los equipos de los usuarios
    let [err, user] = await to(getUser(req.user.userId));
    if (err) return res.status(400).json({ message: err });
    let [teamErr, team] = await to(teamsController.getTeamOfUser(req.user.userId));
    if (teamErr) return res.status(401).json({ message: err });
    // console.log(user, team);

    res.status(200).json(
        {
            trainer: user.username,
            teamLength: team.teamLength,
            team: team.team
        }
    );
}



const setTeamToUser = async (req, res) => {
    const team = await fillUserTeam(req.body.team);
    const [err, response] = await to(teamsController.setTeam(req.user.userId, team));
    if (err) return res.status(400).json({message: err});
    res.status(200).send();
}

// const addPokemonToTeam = async (req, res) => {
//     let pokemonName = req.body.name;
//     const urlPokeAPI = 'https://pokeapi.co/api/v2';

//     try {
//         let response = await axios.get(`${urlPokeAPI}/pokemon/${pokemonName.toLowerCase()}`)
//         // handle success
//         const pokedexId = response.data.id;
//         let pokemon = {
//             name: pokemonName,
//             pokedexNumber: pokedexId
//         }
//         try {
//             await teamsController.addPokemon(req.user.userId, pokemon);
//             return res.status(201).json(pokemon);
//         } catch (error) {
//             return res.status(400).json({ message: 'You have already 6 pokemons on your teams' })
//         }
//     } catch (err) {
//         //handle error
//         res.status(400).json({message: err});
//     }
// }

const addPokemonToTeam = async (req, res) => {
    let pokemonName = req.body.name;
    const urlPokeAPI = process.env.URL_POKE_API;

    let [pokeApiError, pokeApiResponse] = await to(axios.get(`${urlPokeAPI}/pokemon/${pokemonName.toLowerCase()}`));
    if (pokeApiError || !pokeApiResponse) {
        return res.status(400).json({message: pokeApiError});
    }
    const pokedexId = pokeApiResponse.data.id;
    let pokemon = {
        name: pokemonName,
        pokedexNumber: pokedexId
    }
    let [addError, addRespose] =  await to(teamsController.addPokemon(req.user.userId, pokemon));
    if (addError) {
        return res.status(400).json({ message: addError })
    }
    res.status(201).json(pokemon);
}

const deletePokemonFromTeam = async (req, res) => {
    const [deleteErr, deleteResponse] = await to(teamsController.deletePokemonAt(req.user.userId, req.params.pokeid));
    if (deleteErr) return res.status(400).json({ message: err });
    res.status(200).send();
}

exports.getTeamFromGivenUser = getTeamFromGivenUser;
exports.setTeamToUser= setTeamToUser;
exports.addPokemonToTeam = addPokemonToTeam;
exports.deletePokemonFromTeam = deletePokemonFromTeam;
