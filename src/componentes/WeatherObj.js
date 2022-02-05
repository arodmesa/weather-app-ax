//import icono1 from './50n.png';
function WeatherObj({ciudad, handleButtons}){
    let {main_weather, icono, temperatura, viento, hora,humedad, nombre}=ciudad;
    return(
        <div className='weather_card'>
            <div className="div_city_name">
                <h1 className='city_name'>{nombre}</h1>
            </div>            
            <div className='div_h1_1'>
                        <img src={`${icono}`} alt='clima principal' />
                        <div className="div_h1">
                            <h1 className='temperatura'>{temperatura}</h1>
                        </div>
            </div>
            <div className='div_texto'>
                <p className='p_1'>{main_weather}</p>
                <p className='p_1'>{hora}</p>
                <p className='p_1'>Humidity: {humedad}.</p>
                <p className='p_1'>Wind: {viento}.</p>
            </div>                  
            <div className='div_trash'>
                <i className="fa fa-trash-o" onClick={()=>handleButtons('trash',nombre)}></i>
            </div>
        </div>
    );
    
}

export default WeatherObj;