// groundStations.ts

import axios from "axios";

export interface GroundStation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
}

export async function getGroundStations() {
    const response = await axios.get(
        "http://localhost:8001/api/groundstations/"
    );

    return response.data;
}