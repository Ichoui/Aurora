export interface City {
    code: string;
    label: string;
    lat: number;
    long: number;
}

export const cities: City[] = [
    {
        'code': 'mtl',
        'label': `Montréal - CA`,
        'lat': 45.573589,
        'long': -73.537113
    },
    {
        'code': 'qc',
        'label': 'Québec - CA',
        'lat': 46.826835,
        'long': -71.205849
    },
    {
        'code': 'sgn',
        'label': 'Saguenay - CA',
        'lat': 48.427878,
        'long': -71.066089
    },
    {
        'code': 'bff',
        'label': 'Banff - CA',
        'lat': 51.178911,
        'long': -115.569748

    },
    {

        'code': 'jsp',
        'label': 'Jasper - CA',
        'lat': 52.873291,
        'long': -118.080682
    },
    {
        'code': 'edm',
        'label': 'Edmonton - CA',
        'lat': 53.546250,
        'long': -113.493442
    },
    {

        'code': 'ylk',
        'label': 'Yellowknife - CA',
        'lat': 62.452538,
        'long': -114.377654
    },
    {

        'code': 'anc',
        'label': 'Anchorage - US',
        'lat': 61.228421,
        'long': -149.887640
    },
    {
        'code': 'bgn',
        'label': 'Bergen - NO',
        'lat': 60.387856,
        'long': 5.330406
    },
    {

        'code': 'trm',
        'label': 'Tromso - NO',
        'lat': 69.650288,
        'long': 18.955098
    },
    {
        'code': 'ryk',
        'label': 'Reykjavik - ISL',
        'lat': 64.146653,
        'long': 21.940686
    }
];
