// Données sur le vent solaire
export interface SolarWind {
    date: string;
    bz: number;
    density: number;
    speed: number;
    kp1hour: number;
    kp4hour: number;
    kp: number;
    colour: AuroraColours;
    message: string[];
}

export interface AuroraColours {
    bz: string;
    density: string;
    speed: string;
    kp1hour: string;
    kp4hour: string;
    kp: string;
}

export enum AuroraEnumColours {
    green = 'green',
    yellow = 'yellow',
    orange = 'orange',
    red = 'red'
}

// Probabilité de voir une aurora au Zénith
export interface AuroraZenith {
    date: string;
    calculated: Calculated;
    colour: AuroraEnumColours;
    lat: string;
    long: string;
    value: string; // to number
    message: string[];

}

export interface Calculated {
    lat: string;
    long: string;
    value: string; // to number
    colour: string;
}

// Paramètres obligatoire & facultatif
export interface ParamsACE {

}

