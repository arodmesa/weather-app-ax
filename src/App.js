import './App.css';
import WeatherObj from './componentes/WeatherObj';
import React from 'react';

function App() {
  const [peticion, setPeticion]=React.useState(0);
  const [ciudades, setCiudades]=React.useState([]);// clima de cada ciudad
  const [city_name,setCityName]=React.useState([]);// nombres de cada ciudad
  const [search_city, setSearch]=React.useState('');
  const [show_search, setShow]=React.useState(false);
  //const [datos, setDatos]=React.useState('');
  
  React.useEffect(()=>{
    if (search_city!==''){
      let datos;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search_city}&appid=f099552c8a6cd428628cff11a5e4aca2`)
      //.then(res=>res.json())
      .then(res=>res.json())
      .then(data=>{
        //setDatos(data);
        datos=data;
      })
      .then(()=>{
        //Aqui va el if de si la ciudad no existe o si esta repetida
        //icono http://openweathermap.org/img/w/10d.png
        //icono:`http://openweathermap.org/img/w/${datos.weather[0].icon}.png`
        //let f_hora= new Date((datos.sys.sunrise + datos.timezone) * 1000); 
        if (datos.cod!==200){
          alert(`Error ${datos.cod} ${datos.message} :( Check your spell and try again`)
        }
        else{
          let bit;
          setCityName((prev_names)=>{
            let temp=prev_names.slice();
            if (temp.length){
              let reducer=(previousValue, currentValue)=>previousValue + (currentValue===datos.name);
              bit=!(temp.reduce(reducer,0));
              if (bit){
                temp.push(datos.name)
                let cards;
                if(temp.length===1){
                  cards=document.getElementById('cards');
                  cards.classList.add('centrar');
                }
                if(temp.length>1){
                  cards=document.getElementById('cards');
                  cards.classList.remove('centrar');
                }
                if(temp.length>=3){
                  cards=document.getElementById('cards');
                  cards.classList.add('card_mod');
                }                
              }   
                
              return(temp);
            }
            else{
              bit=true;
              temp.push(datos.name)
              return temp;
            }
            
          }); 
          if (bit){
            let d=new Date();
            let localTime=d.getTime();
            let localOffset=d.getTimezoneOffset() *60000;
            let utc = localTime + localOffset;
            let city_time= utc + (1000* datos.timezone);
            let f_hora=new Date (city_time);
            let week_day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];     
            let obj={
              main_weather:datos.weather[0].main,
              icono:`${datos.weather[0].icon}.png`,
              temperatura:`${(datos.main.temp-273.15).toFixed(1)}°C`,
              viento:`${datos.wind.speed} m/s`,
              hora:`${week_day[f_hora.getDay()]}, ${f_hora.getHours()}:${(f_hora.getMinutes()<10)?'0':''}${f_hora.getMinutes()}`,
              humedad: `${datos.main.humidity}%`,
              nombre: datos.name
            };
            setCiudades((prev_cities)=>{
              let temp= prev_cities.slice();
              temp.push({[datos.name]: obj});
              return temp.reverse();
            });   
            setShow(false);
            setSearch('');
          }          
          else{
            alert('You have selected that city already. Try another :)');         
          }     
        }
            
      })
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[peticion])
  
  //metodos
    function handleButtons(identificador, nombre=''){
      switch (identificador){
        case 'plus':
          setShow((prevShow)=>!prevShow);
          break;
        case 'search':
          if (search_city!==''){
            setPeticion((valor_prev)=>valor_prev+1)
          }
          break;
        case 'trash':
          setCiudades((prevCiudades)=>{
            let temp;
            temp=prevCiudades.slice().filter((elem)=>Object.keys(elem)[0]!==nombre)
            return(temp);
          })
            setCityName((prev_city)=>{
              let temp;
              let cards;
              temp=prev_city.slice().filter((elem)=>elem!==nombre)
              if(temp.length<3){
                cards=document.getElementById('cards');
                cards.classList.remove('card_mod');
              }
              if(temp.length!==1){
                cards=document.getElementById('cards');
                cards.classList.remove('centrar');
              }
              else{
                cards=document.getElementById('cards');
                cards.classList.add('centrar');
              }
              return temp;
            })
          break;
          default:
            break;
      }   
    }
    function handleInput(event){
      setSearch(event.target.value);
    }
  //
  let city_cards;  
  city_cards= ciudades.map((ciudad,index)=>{
     return(
       <WeatherObj ciudad={ciudad[Object.keys(ciudad)[0]]} key={index} handleButtons={handleButtons} /> //se pasan los datos de la ciudad actual
     );
  })
      

  return (
    <div className="App">
      <h2>Weather Forecast</h2>
      <h3>Select your city</h3>
      <div id='cards' className='cards centrar'>
        {city_cards}
      </div>  
      <div className='div_cont_search'>
        <div className='div_plus' onClick={()=>handleButtons('plus')}>
          <i className="fa fa-plus" aria-hidden="true"></i>
        </div>
        {show_search && <div className='search_div'>
            <input type="text" id="city_input" onChange={handleInput}></input>
            <button type='button' onClick={()=>handleButtons('search')}>SEARCH</button>
        </div>}     
      </div>
    </div>
  );
}

export default App;
