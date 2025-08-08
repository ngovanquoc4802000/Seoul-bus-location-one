## Location Seoul destination Viet Nam
 - This project is a real-time location tracking application that visualizes the movement of vehicles on a map.

 ## 🌟 Features
 * **Real-time Vehicle Position:** Track the live location of a vehicle on the map.
 * **Destination:** Display the vehicle's final destination
 * **Stop Detection:** Identify when a vehicle has stopped.

 ## 🛠️ Technology Stack
 ### Backend
 * **Technology:** Node.js
* **Database:** Firebase (Firestore)
### Frontend
* **Technology:** React with TypeScript
* **Styling:** Tailwind CSS
* **Mapping:** React-Leaflet, Leaflet.gridlayer.googlemutant, react-leaflet-google-layer

## ⚙️ How It Works

## Backend
The backend is responsible for handling data simulation and communication with the database.

* **`mqtt`**: Listens for data from the MQTT simulator and sends it to Firebase.
* **`parse`**: A separate file to transform raw MQTT data into the correct format.
* **`firebaseSerice`**: Handles saving and retrieving data from Firebase.
* **`firebaseAdmin`**: Connects the Node.js backend to Firebase using the Admin SDK.
* **`mqttSimulatorDemo.js`**: Simulates the vehicle's `latitude` and `longitude` from a starting point to an endpoint.

### Frontend
The frontend is responsible for fetching and displaying the real-time data on the map.
* **Real-time Updates:** Uses a real-time listener to passively display data from Firebase.
* **Mapping Libraries:** Uses various libraries to render the map, markers, and other map-related features.

## ▶️ Getting Started

To run the application locally, follow these steps.

### Backend

1.  Open your terminal and navigate to the backend directory.

2.  Start the backend server:
    ```bash
    npm run serve
    ```
3.  In a new terminal window, run the MQTT simulator to start sending location data:
    ```bash
    node mqttSimulatorDemo.js
    ```

### Frontend

1.  Open your terminal and navigate to the frontend directory.
2.  Start the development server:
    ```bash
    npm run dev
    ```

The application should now be running and accessible in your web browser.