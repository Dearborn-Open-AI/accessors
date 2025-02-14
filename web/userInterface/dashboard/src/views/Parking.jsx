import React from "react";
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
} from "react-google-maps";

import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";

// reactstrap components
import { Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  UncontrolledTooltip,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
} from "reactstrap";

 import {Redirect } from 'react-router'

//FIXME Refactor this function across pages (Dashboard and this) instead of duplicating it.
//Helper function to refactor websocket code
//processing blobs and strings.
//Event is the event from the websocket
//Callback is a function with one (string) argument, which will be
//invoked on the response extracted from event.
function eventToJSON(event, callback) {
  var response;
  if(event.data instanceof Blob) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt);
      console.log(evt.target);
      console.log(evt.target.result);
      response = JSON.parse(evt.target.result);
      callback(response);
    };
    reader.readAsText(event.data);
  } else {
    response = JSON.parse(event.data);
    callback(response);
  }
}

function selectParking(parkingDatum, parkingContext){
  console.log("selectedParing for :");
  console.log(parkingDatum);
  console.log(parkingDatum.accessor);
  var selectParkingSocket = new WebSocket('ws://' + window.location.hostname  + ':8095/');
  selectParkingSocket.onopen = function(){
      var startMessage = {
        "id" : "selectAccessor",
        "accessorPath" : parkingDatum.accessor
      }
      console.log("Sending selectAccessor message to controller.");
      selectParkingSocket.send(JSON.stringify(startMessage));

      //FIXME: I'm leaving it like this now because of the paper deadline, but
      //a better way of ensuring the controller has had time to get itself ready for
      //the redirect is for the controller to handshake with a new message 
      //back to this websocket to say it's ready for the redirect.
      setTimeout(  () => parkingContext.setState({redirectToDashboard: true}), 1000);
    };
}

function generateTableRows(parkingData, parkingContext){
  var table = [];
  for(var i= 0; i < parkingData.length; i++){
    var children = [];
    children.push(<td> <p className="title">{parkingData[i].displayName}</p>
       <p className="text-muted"> {parkingData[i].address}</p></td>);
    children.push(<td><p>${parkingData[i].price}</p></td>);
    children.push(<td><p>{parkingData[i].distance} mi</p></td>);
    children.push(<td className="td-actions text-right">
                            <Button
                              color="link"
                              id={"tooltip" + parkingData[i].key}
                              title=""
                              type="button"
                              onClick={selectParking.bind(this, parkingData[i], parkingContext)}
                            >
                              <i className="tim-icons icon-triangle-right-17" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target={"tooltip" + parkingData[i].key}
                              placement="right"
                            >
                              Get Accessor
                            </UncontrolledTooltip>
                          </td>
                          );
    table.push(<tr key={parkingData[i].key}>{children}</tr>);
  }
  return table;


}

                          

function generateMarkerWithLabels(parkingData, parkingContext){
  return (
    parkingData.map( (datum, index) => (
      <MarkerWithLabel
      position={{ lat: datum.lat, lng: datum.lng }}
      labelAnchor={new google.maps.Point(22, 0)}
      labelStyle={{opacity: 0.75}}
      key={datum.key}
      onClick={selectParking.bind(this, datum, parkingContext)}
      >
        <Card>
        <CardHeader>
        <CardTitle tag="h5">{datum.displayName}</CardTitle>
        </CardHeader>
        </Card>
      </MarkerWithLabel>
      ))
    );  
}

const ParkingWrapper = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={props.center}
      defaultOptions={{
        scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        styles: [
                {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#1d2c4d"
              }
            ]
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#8ec3b9"
              }
            ]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#1a3646"
              }
            ]
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#4b6878"
              }
            ]
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#64779e"
              }
            ]
          },
          {
            featureType: "administrative.province",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#4b6878"
              }
            ]
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#334e87"
              }
            ]
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [
              {
                color: "#023e58"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
              {
                color: "#283d6a"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#6f9ba5"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#1d2c4d"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#023e58"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#3C7680"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                color: "#304a7d"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#98a5be"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#1d2c4d"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#2c6675"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#9d2a80"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#9d2a80"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#b0d5ce"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#023e58"
              }
            ]
          },
          {
            featureType: "transit",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#98a5be"
              }
            ]
          },
          {
            featureType: "transit",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#1d2c4d"
              }
            ]
          },
          {
            featureType: "transit.line",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#283d6a"
              }
            ]
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [
              {
                color: "#3a4762"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#0e1626"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#4e6d70"
              }
            ]
          }
        ]
      }}
    >
      <Circle center={props.center} radius={50} options={{fillColor: "DodgerBlue", fillOpacity:1.0, strokeColor:"White", strokeWeight:1}} />
      {/* <Marker position={{ lat: 37.8816, lng: -122.2827 }} /> */}
      {generateMarkerWithLabels(props.parkingData, props.parkingContext)}
    </GoogleMap>
  ))
);


var ws;

class Parking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: "YOUR_KEY_MUST_BE_LOADED_HERE",
      center: { lat: 37.8716, lng: -122.2727 }, //Defaults to the location of Berkeley, CA
      parkingData: [], //The order of data in this array is the order it will be displayed in the table
      dataTime: "",
      redirectToDashboard: false
    };
    ws = new WebSocket('ws://' + window.location.hostname  + ':8095/');
  }

  componentDidMount(){
    var thiz = this;
    //Tell controller to ready a list of parking locations with information
    //and to provide a google maps API key
    ws.onopen = function(){
      var startMessage = {
        "id" : "parkingDialogue",
        "msg" : "start"
      }
      console.log("Sending parking message to controller.");
      ws.send(JSON.stringify(startMessage));
    };
    ws.onmessage = function(event) {
      console.log("GOT EVENT FROM CONTROLLER!");
       eventToJSON(event, function(response){
        if(response.id && response.id === "parkingDialogue" && response.apiKey){
          console.log("started parking if!");
          
          thiz.setState({apiKey: response.apiKey});
          thiz.setState({center: {"lat": response.mapPosition.lat, "lng": response.mapPosition.lng}});
          
          //Assign a unique key to every parking datum.
          //This prevents weird rendering issues in react if we reorder the array
          var keyedParkingData = response.parkingData;
          for(var i = 0; i < keyedParkingData.length; i++){
            keyedParkingData[i].key = i;
          }

          var d = new Date();
          thiz.setState({dataTime: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()});

          thiz.setState({parkingData: keyedParkingData});
          //console.log({center: {"lat": response.lat, "lng": response.lng}});
        }
      });
    }.bind(thiz);
  }

  componentWillUnmount() {
    ws.close();
  }

  sortByPrice(){
    console.log("sortingP");
    var sortedData = this.state.parkingData;
    sortedData.sort( function(a,b) {
      var priceA = parseFloat(a.price);
      var priceB = parseFloat(b.price);
      return priceA - priceB;
      // if(a.price < b.price){
      //   return -1;
      // }
      // if(a.price > b.price){
      //   return 1;
      // }
      // return 0;
    });
    this.setState({parkingData: sortedData});
  }

  sortByDistance(){
    console.log("sortingD");
    var sortedData = this.state.parkingData;
    sortedData.sort( function(a,b) {
      if(a.distance < b.distance){
        return -1;
      }
      if(a.distance > b.distance){
        return 1;
      }
      return 0;
    });
    this.setState({parkingData: sortedData});
  }

  render() {
    if(this.state.redirectToDashboard){
      console.log("Rendering redirect to /admin/dashboard");
      return (
        <Redirect to="/admin/dashboard"/>
        )
    } else {
      console.log("Rendering nothing because waiting for apiKey");
      if(this.state.apiKey == "YOUR_KEY_MUST_BE_LOADED_HERE"){
        return (
          <div className="content">
          {/* <h2> API key not loaded yet </h2> */}
          </div> );
      } else {
        console.log("Rendering main parking page");
        return (
          <>
            <div className="content">
              <Row>
                <Col md="7">
                  <Card className="card-plain">
                    {/* <CardHeader>Google Maps + {this.state.apiKey}</CardHeader> */}
                    <CardBody style={{"padding": "0px"}}>
                      <div
                        id="map"
                        className="map"
                        style={{ position: "relative", overflow: "hidden"}}
                      >

                        <ParkingWrapper
                          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + this.state.apiKey}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `100%` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          center={this.state.center}
                          parkingData={this.state.parkingData}
                          parkingContext={this}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="5">
                <Card className="card-tasks">
                  <CardHeader>
                    <h6 className="title d-inline">Results ({this.state.parkingData.length})</h6>
                    <p className="card-category d-inline"> {this.state.dataTime}</p>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className="btn-icon"
                        color="link"
                        data-toggle="dropdown"
                        type="button"
                      >
                        <i className="tim-icons icon-settings-gear-63" />
                      </DropdownToggle>
                      <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                        <DropdownItem
                          href="#"
                          onClick={this.sortByPrice.bind(this)}
                        >
                          Sort by Price
                        </DropdownItem>
                        <DropdownItem
                           href="#"
                          onClick={this.sortByDistance.bind(this)}
                        >
                          Sort by Distance
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    <div className="table-full-width table-responsive" style={{ "overflow-y": "auto", "overflow-x": "auto" }}>
                      <Table>
                        <thead className="text-primary">
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Distance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateTableRows(this.state.parkingData, this)}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
                </Col>
              </Row>
            </div>
          </>
        );
      }
    }
  }
}

export default Parking;
