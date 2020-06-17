import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DeviceInfo from 'react-native-device-info';
import publicIP from 'react-native-public-ip';
import Geolocation from '@react-native-community/geolocation';
import * as ImageManipulator from "expo-image-manipulator";
import axios from 'axios';

export default class CameraPage extends React.Component {
	constructor() {
		super()
		this.camRef = React.createRef();
		this.state = {
			type: Camera.Constants.Type.front,
			hasPermission: null,
			capturedPhoto: null,
			open: false,
			deviceId: null,
			networkIpAddress: null,
			publicIpAddress: null,
			macAddress: null,
			currentLongitude: null,
			currentLatitude: null,
			personDetected:'detecting...'
		}
	}

	async componentDidMount() {
		const { status } = await Camera.requestPermissionsAsync();
		(status === 'granted') ? this.setState({ hasPermission: true }) : this.setState({ hasPermission: false })
		var that = this;
		//Checking for the permission just after component loaded
		if (Platform.OS === 'ios') {
			this.callLocation(that);
		} else {
			async function requestLocationPermission() {
				try {
					const granted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
						'title': 'Location Access Required',
						'message': 'This App needs to Access your location'
					}
					)
					if (granted === PermissionsAndroid.RESULTS.GRANTED) {
						//To Check, If Permission is granted
						that.callLocation(that);
					} else {
						alert("Permission Denied");
					}
				} catch (err) {
					alert("err", err);
					console.warn(err)
				}
			}
		}
	}

	componentWillUnmount = () => {
		Geolocation.clearWatch(this.watchID);
	}

	setType = () => {
		(this.state.type === Camera.Constants.Type.back) ? this.setState({ type: Camera.Constants.Type.front }) : this.setState({ type: Camera.Constants.Type.back })
	}

	takePicture = async () => {
		var that = this;
		if (this.camRef) {
			const data = await this.camRef.current.takePictureAsync();
			await this.setState({ capturedPhoto: data.uri })
			await this.setState({ open: true }, ()=>{this.getdeviceId();this.getLocation()})
			// console.log(data);
			const resizedPhoto = await ImageManipulator.manipulateAsync(
				data.uri,
				[{ resize: { width: 100 } }], // resize to width of 300 and preserve aspect ratio 
				{ compress: 0.7, format: 'jpeg' },
			);
			console.log(resizedPhoto);
			let localUri = resizedPhoto.uri;
			let filename = localUri.split('/').pop();
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;
			let formData = await new FormData();
			await formData.append('image', { uri: localUri, name: filename, type });
			await axios({
				method: 'post',
				url: 'https://delta24-mini-django-api-v1.herokuapp.com/face_detection/detect/firebase/',
				data: formData,
				headers: {
					'Accept': 'application/json',
					'content-type': 'multipart/form-data',
				},
			})
			.then(function (response) {
				try{
					that.setState({ personDetected: response.data.name[0] })
				}catch(e){
					that.setState({ personDetected: 'error' })
				}
				console.log(response.data);
			})
			// await fetch('https://366cc836.ngrok.io/face_detection/detect/firebase/class/', {
			// 	method: 'POST',
			// 	body: formData,
			// 	headers: {
			// 		'Accept': 'application/json',
			// 		'content-type': 'multipart/form-data',
			// 	},
			// }).then(response => {
			// 	console.log("response ",response)
			// }).then(json => {
			// 	console.log("json ",json)
			// }).catch(err => {
			// 	console.error(err)
			// });
		}
	}

	getdeviceId = async () => {
		var _this = this
		await publicIP().then(async (ip) => {
			await _this.setState({ publicIpAddress: ip });
		}).catch(async (error) => {
			await _this.setState({ publicIpAddress: 'error' });
		});
		var id = await DeviceInfo.getUniqueId();
		await this.setState({ deviceId: id });
		await DeviceInfo.getIpAddress().then(async (ip) => {
			await _this.setState({ networkIpAddress: ip });
		});
		await DeviceInfo.getMacAddress().then(async (mac) => {
			await _this.setState({ macAddress: mac });
		});
	};

	getLocation=()=>{
        this.callLocation(this);
    }

	callLocation(that) {
		console.log("callLocation Called");
		Geolocation.getCurrentPosition(
			//Will give you the current location
			(position) => {
				const currentLongitude = JSON.stringify(position.coords.longitude);
				//getting the Longitude from the location json
				const currentLatitude = JSON.stringify(position.coords.latitude);
				//getting the Latitude from the location json
				that.setState({ currentLongitude: currentLongitude });
				//Setting state Longitude to re re-render the Longitude Text
				that.setState({ currentLatitude: currentLatitude });
				//Setting state Latitude to re re-render the Longitude Text
			},
			(error) => console.log(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
		that.watchID = Geolocation.watchPosition((position) => {
			//Will give you the location on location change
			console.log(position);
			const currentLongitude = JSON.stringify(position.coords.longitude);
			//getting the Longitude from the location json
			const currentLatitude = JSON.stringify(position.coords.latitude);
			//getting the Latitude from the location json
			that.setState({ currentLongitude: currentLongitude });
			//Setting state Longitude to re re-render the Longitude Text
			that.setState({ currentLatitude: currentLatitude });
			//Setting state Latitude to re re-render the Longitude Text
		});
	}

	render() {
		if (this.state.hasPermission === null) {
			return <View />;
		}
		if (this.state.hasPermission === false) {
			return <Text>Access Denied</Text>;
		}
		return (
			<SafeAreaView style={styles.container}>
				<Camera style={{ flex: 1 }}
					type={this.state.type}
					ref={this.camRef}
				>
					<View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
					</View>
					<View style={styles.bottomView}>
						<TouchableOpacity
							style={styles.switchIcon}
							onPress={this.setType}
						>
							<MaterialIcons name="switch-camera" size={30} color="white"></MaterialIcons>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.takePicture}>
							<MaterialIcons name="camera" size={50} color="white" />
						</TouchableOpacity>
					</View>
				</Camera>

				{this.state.capturedPhoto && this.state.deviceId && this.state.publicIpAddress 
				&& this.state.macAddress && this.state.currentLongitude && this.state.currentLatitude &&
					<Modal animationType="slide" transparent={false} visible={this.state.open}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
							<TouchableOpacity style={{ margin: 10 }} onPress={() => this.setState({ open: false })}>
								<FontAwesome name="window-close" size={50} color="#ff0000" />
							</TouchableOpacity>
							<Image
								style={{ width: '100%', height: 300, borderRadius: 20 }}
								source={{ uri: this.state.capturedPhoto }}></Image>
							<Text>deviceId: {this.state.deviceId}</Text>
							<Text>networkIpAddress: {this.state.networkIpAddress}</Text>
							<Text>publicIpAddress: {this.state.publicIpAddress}</Text>
							<Text>macAddress: {this.state.macAddress}</Text>
							<Text>currentLongitude: {this.state.currentLongitude}</Text>
							<Text>currentLatitude: {this.state.currentLatitude}</Text>
							<Text>name: {this.state.personDetected}</Text>
						</View>
					</Modal>
				}
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},

	bottomView: {
		justifyContent: 'center',//
		alignItems: 'center',//
		height: 50, //
		bottom: 10
	},
	switchIcon: {
		position: 'absolute',
		margin: 'auto',
		bottom: 10,
		left: 20,
	}
});