import express from "express";
import axios from "axios";

const app= express();
const port=3000;

//tell the express to use the ejs for templates
app.set('view engine', 'ejs');
 app.get('/',(req,res)=>{
    res.render('index');

})

 //rout search country
app.get('/country', async (req, res) => {
    try {
        const countryName = req.query.name;
        
        // If no country name provided, show an error
        if (!countryName) {
            return res.render('country', { 
                country: null, 
                error: 'Please enter a country name' 
            });
        }
        const response=await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData=response.data[0];
        const country = {
            name: countryData.name.common,
            officialName: countryData.name.official,
            capital: countryData.capital ? countryData.capital[0] : 'Not available',
            population: countryData.population.toLocaleString(),
            region: countryData.region,
            subregion: countryData.subregion,
            flag: countryData.flags.png,
            currency: countryData.currencies ? 
                Object.values(countryData.currencies)[0].name : 'Not available',
            currencySymbol: countryData.currencies ? 
                Object.values(countryData.currencies)[0].symbol : '',
            languages: countryData.languages ? 
                Object.values(countryData.languages).join(', ') : 'Not available',
            timezones: countryData.timezones.join(', ')
        };
         res.render('country', { country, error: null });
    }catch(error){
        console.error('Error:', error.message);
        res.render('country', { 
            country: null, 
            error: `Country "${req.query.name}" not found. Try a different name.` 
        });
    }
});
app.get('/random', async (req, res) => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const allCountries = response.data;
        const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
        res.redirect(`/country?name=${randomCountry.name.common}`);
    } catch (error) {
        // If random fails, just go to South Africa
        res.redirect('/country?name=South Africa');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Try it: http://localhost:${port}/country?name=France`);
});
    