export type Testimonial = {
    text: string;
    author: string;
    role: string;
};

export const CLIENTS_DATA: Testimonial[] = [
    {
        text: "Po letech bolestí zad se konečně cítím skvěle. Přístup byl velmi profesionální a cviky na doma mi opravdu pomohly.",
        author: "Martin K.",
        role: "IT Specialista",
    },
    {
        text: "Pravidelně chodím na masáže a je to pro mě nejlepší relax. Prostředí je nádherné a personál velmi milý.",
        author: "Alena P.",
        role: "Učitelka",
    },
    {
        text: "Jako aktivnímu běžci mi pomohli odstranit svalové dysbalance a zlepšit techniku běhu.",
        author: "Tomáš R.",
        role: "Maratonec",
    },
];
