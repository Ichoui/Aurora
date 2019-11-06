export interface City {
    code: string;
    label: string;
    latitude: number;
    longitude: number;
}
export interface Coords {
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    latitude?: number;
    longitude?: number;
    speed?: number | null;
}

export const cities: City[] = [
    {
        'code': 'mtl',
        'label': `Montréal - CA`,
        'latitude': 45.573589,
        'longitude': -73.537113
    },
    {
        'code': 'qc',
        'label': 'Québec - CA',
        'latitude': 46.826835,
        'longitude': -71.205849
    },
    {
        'code': 'sgn',
        'label': 'Saguenay - CA',
        'latitude': 48.427878,
        'longitude': -71.066089
    },
    {
        'code': 'bff',
        'label': 'Banff - CA',
        'latitude': 51.178911,
        'longitude': -115.569748

    },
    {

        'code': 'jsp',
        'label': 'Jasper - CA',
        'latitude': 52.873291,
        'longitude': -118.080682
    },
    {
        'code': 'edm',
        'label': 'Edmonton - CA',
        'latitude': 53.546250,
        'longitude': -113.493442
    },
    {

        'code': 'ylk',
        'label': 'Yellowknife - CA',
        'latitude': 62.452538,
        'longitude': -114.377654
    },
    {

        'code': 'anc',
        'label': 'Anchorage - US',
        'latitude': 61.228421,
        'longitude': -149.887640
    },
    {
        'code': 'bgn',
        'label': 'Bergen - NO',
        'latitude': 60.387856,
        'longitude': 5.330406
    },
    {

        'code': 'trm',
        'label': 'Tromso - NO',
        'latitude': 69.650288,
        'longitude': 18.955098
    },
    {
        'code': 'ryk',
        'label': 'Reykjavik - ISL',
        'latitude': 64.146653,
        'longitude': 21.940686
    }
];
