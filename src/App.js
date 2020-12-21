import './App.css';
import React, {Component} from "react";
import GoogleMapReact from "google-map-react";

class App extends Component{

    constructor(props) {
        super(props);
        this.state = {

            latitude: 0,
            longitude: 0,

            temp: 0,
            load: false,
            zoom: 11,
            address: ''
        }
        this.getMyLocation = this.getMyLocation.bind(this);
        //this.getMyLocation();

    }



    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation
        //AIzaSyClAp-BnVW1ncYydyk09UXQKDJR2vfEzMU
        //https://maps.googleapis.com/maps/api/geocode/json?address=22.828865099999998,86.1703752&key=AIzaSyClAp-BnVW1ncYydyk09UXQKDJR2vfEzMU
        if (location) {
            location.getCurrentPosition((position) => {

                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                this.getCurrentWeatherData(position.coords.latitude, position.coords.longitude);
            }, (error) => {
                console.log(error);
            });
        }
    }

    getCurrentWeatherData(lat, lng) {
        //https://api.openweathermap.org/data/2.5/weather?q=Jamshedpur&appid=886705b4c1182eb1c69f28eb8c520e20
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=886705b4c1182eb1c69f28eb8c520e20')
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                let t = data.main.temp-273;
                this.setState({
                    temp: t
                })
            });
        //https://maps.googleapis.com/maps/api/geocode/json?address=22.828865099999998,86.1703752&key=AIzaSyClAp-BnVW1ncYydyk09UXQKDJR2vfEzMU
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+lat+','+lng+'&key=AIzaSyClAp-BnVW1ncYydyk09UXQKDJR2vfEzMU')
            .then(response => response.json())
            .then(data => {
                //console.log(data.results[1].formatted_address);
                const locArr = data.results[1].formatted_address.split(',');
                const addr = locArr[locArr.length - 3] +","+locArr[locArr.length - 2];
                this.setState({address: addr});
            });
    }

    componentDidMount() {
        //this.getMyLocation();
        //this.render();
        this.getMyLocation();
        this.getForexData();
    }

    getForexData() {
        //{ mode: 'no-cors'}
        //{method: 'get', headers: new Headers({'Access-Control-Allow-Origin': "*", 'Access-Control-Allow-Headers': "*"})}
        fetch('https://v2.api.forex/rates/latest.json?beautify=true&key=4391e5c6-a569-4893-a92e-7dd32e694e49',
            {method: 'get', headers: new Headers({'Access-Control-Allow-Origin': "*", 'Access-Control-Allow-Headers': "*"})})
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }

    updateLoad() {
        this.setState({
            load: true
        });
        this.forceUpdate();
    }

    render() {
        if(this.state.load===false) {
            this.updateLoad();
            return (<div></div>);
        }
        let cnt = {}
        cnt.lat = this.state.latitude;
        cnt.lng = this.state.longitude;
      return (
          <div className='rowC'>
              <div style={{padding: '10px', height: '50vh', width: '50%' }}>
                  <center>
                      <h3>{this.state.address}</h3>
                      <br/>
                      {parseInt(this.state.temp)} degree celcius
                      <br/>
                      Latitude: {cnt.lat}
                      <br/>
                      Longitude: {cnt.lng}
                  </center>
              </div>
              <div style={{padding: '10px', height: '50vh', width: '50%' }}>
                  <GoogleMapReact
                      bootstrapURLKeys={{ key: "AIzaSyClAp-BnVW1ncYydyk09UXQKDJR2vfEzMU" }}
                      center={cnt}
                      defaultZoom={this.state.zoom}>
                  </GoogleMapReact>
              </div>
          </div>
      );
  }

}

export default App;
