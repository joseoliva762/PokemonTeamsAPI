const axios = require('axios').default;
const { to } = require('./to');
exports.fillUserTeam = async team => {
    const urlPokeAPI = process.env.URL_POKE_API;
    newTeam = []
    for (pokemon of team) {
        let [pokeApiError, pokeApiResponse] = await to(axios.get(`${urlPokeAPI}/pokemon/${pokemon.name.toLowerCase()}`));
        if (pokeApiError) {
            newTeam.push({ ...pokemon });
            continue;
        }
        const pokedexId = pokeApiResponse.data.id;
        newTeam.push({
            ...pokemon,
            pokedexNumber: pokedexId
        });
    }
    return newTeam;
}