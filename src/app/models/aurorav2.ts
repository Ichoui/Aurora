export interface Aurora {
    modules: AuroraModules[];
    common: {
        lat: number;
        long: number;
    }
}

export enum AuroraModules {
    common = "common",
    nowcastlocal = "nowcast:local",
    nowcasthighest = "nowcast:highest",
    kpcurrent = "kp:current",
    kp3hour = "kp:kp3hour",
    kp3day = "kp:kp3day",
    kp27day = "kp:27day",
    kpforecast = "kp:forecast",
    speed = "speed",
    density = "density",
    bt = "bt",
    bz = "bz",
}

export enum AuroraEnumColours {
    green = 'green',
    yellow = 'yellow',
    orange = 'orange',
    red = 'red'
}

export interface KpCurrent {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
}

export interface Kp27day {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
    current: boolean;
}

export interface KpForecast {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
    current: boolean;
}

export interface Speed {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
    minutes_to_eart: number;
}

export interface Density {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
}

export interface Bz {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
}
export interface Bt {
    value: number;
    color: AuroraEnumColours;
    date: Date;
    request_date: Date;
}

export interface Nowcast {
    value: number
    lat: number
    long: number
    color: AuroraEnumColours
    date: Date
    request_date: Date
}
