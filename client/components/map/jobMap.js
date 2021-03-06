import React, { Component } from 'react';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
import { getJobList, onJobClick } from '../../actions/jobs';
import { GoogleMap, Marker } from 'react-google-maps';
import MarkerCluster from "react-google-maps/lib/addons/MarkerClusterer";
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader';
import { MapStyle } from './mainMapStyle';
import InfoBox from './infoBox';

class JobMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userIcon: './user.png',
			jobIcon: './work.png',
			showInfo: true,
			windowWidth: null,
			lat: null,
			lng: null
		};

		this.geoSuccess = this.geoSuccess.bind(this);
		this.geoError = this.geoError.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.populateMarkers = this.populateMarkers.bind(this);
	}

	componentWillMount() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
		}
		//get inital job list
		this.props.getJobList();
		//setInterval(this.props.getJobList, 10000);
		window.addEventListener('resize', this.handleResize);
	}

	componentDidMount() {
		this.setState({ windowWidth: window.innerWidth })
	}

	handleResize(e) {
		this.setState({windowWidth: window.innerWidth});
	}

	toggle() {
		this.state.showInfo ? this.setState({ showInfo: false }) : this.setState({ showInfo: true });
	}

	geoSuccess(position) {
		this.setState({ lng: position.coords.longitude, lat: position.coords.latitude });
	}

	geoError(error) {
		console.error(`ERROR ${error.code} : ${error.message}`);
	}

	populateMarkers() {
		if (this.props.location) {
			return this.props.jobs.jobList.map((job, i) => {
				return (<Marker
					key={ job.id }
					position={{ lat: job.location_lat, lng: job.location_lng }}
					icon={ this.state.jobIcon }
					onClick={ (e) => { this.props.onJobClick(job, this.state.showInfo); /*this.toggle()*/ }} />
			)})
		}

		//make action call to set original info
		return ([<Marker
			key={10}
			position={{ lat: this.props.jobs.job.location_lat, lng: this.props.jobs.job.location_lng }}
			icon={ this.state.jobIcon }
			onClick={ (e) => { this.props.onJobClick(this.props.jobs.job, this.state.showInfo); /*this.toggle()*/ }} />]
		);

	}

	render() {
		if (this.state.lat == null && this.state.lng == null) {
			return <div>Geolocation Not Found</div>
		}

		const loading = 'https://thomas.vanhoutte.be/miniblog/wp-content/uploads/ligt_blue_material_design_loading.gif';

		return (
				<ScriptjsLoader
					hostname={ 'maps.googleapis.com' }
					pathname={ '/maps/api/js' }
					query={{ key: 'AIzaSyAJu6SvKcz7H7fNJb-akc4PJ7BYhlbhqAw', libraries: 'geometry,drawing,places' }}
					loadingElement={
						<div>
							<img src={ loading } />
						</div>
					}
					containerElement={ <div className="map-container" /> }
					googleMapElement={
						<GoogleMap defaultOptions={{ styles: MapStyle }} defaultZoom={ 12 } defaultCenter={{ lat: this.state.lat, lng: this.state.lng }} >
							<InfoBox />
							<Marker key={ 'UserGeo' } position={{ lat: this.state.lat, lng: this.state.lng }} icon={ this.state.userIcon } />
							<MarkerCluster>
								{ this.populateMarkers() }
							</MarkerCluster>
						</GoogleMap>
					}
				/>
		);
	}
}

function mapStateToProps({ jobs }) {
  return { jobs };
}

export default connect(mapStateToProps, { getJobList, onJobClick })(JobMap);
//<pre><code>{JSON.stringify(job, null, 4)}</code></pre>
