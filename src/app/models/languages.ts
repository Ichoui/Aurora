export interface Language {
    slug: string;
    labelFr: string;
    labelEn: string;
}

export const Languages: Language[] = [
    {
        slug: 'fr',
        labelFr: 'Français',
        labelEn: 'French',
    },
    {
        slug: 'en',
        labelFr: 'Anglais',
        labelEn: 'English',
    }
];
