import CarMap from "./carMap";

function Dashboard() {
    const carIdToTrack = "01222589211"; 
    return (
        <div>
            <h1 className="bg-amber-400">Dashboard</h1>
            <CarMap carId={carIdToTrack} />
        </div>
    );
}

export default Dashboard;