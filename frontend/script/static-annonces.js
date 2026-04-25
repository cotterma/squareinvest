const staticAnnonces = [
  {
    id: 37,
    titre: "Studio de 21m² au deuxième étage avec terrasse",
    description: `Studio de 21m² au deuxième étage avec terrasse meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 515,
    paths: [
      "./images/appartments/201-3.jpg",
      "./images/appartments/201-2.jpg",
      "./images/appartments/201-1.jpg"
    ]
  },
  {
    id: 29,
    titre: "Studio de 18m² au rez-de-chaussée",
    description: `Studio de 18m² au rez-de-chaussée meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 485,
    paths: [
      "./images/appartments/3-6.jpg",
      "./images/appartments/3-5.jpg",
      "./images/appartments/3-4.jpg",
      "./images/appartments/3-3.jpg",
      "./images/appartments/3-2.jpg",
      "./images/appartments/3-1.jpg"
    ]
  },
  {
    id: 32,
    titre: "Studio de 18m² au rez-de-chaussée",
    description: `Studio de 18m² au rez-de-chaussée meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 485,
    paths: [
      "./images/appartments/6-4.jpg",
      "./images/appartments/6-2.jpg",
      "./images/appartments/6-3.jpg",
      "./images/appartments/6-1.jpg"
    ]
  },
  {
    id: 58,
    titre: "Studio de 18m² au rez-de-chaussée",
    description: `Studio de 18m² au rez-de-chaussée meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 485,
    paths: [
      "./images/appartments/5-3.jpg",
      "./images/appartments/5-2.jpg",
      "./images/appartments/5-1.jpg"
    ]
  },
  {
    id: 64,
    titre: "Studio de 21m² au premier étage",
    description: `Studio de 21m² au premier étage meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 505,
    paths: [
      "./images/appartments/106-4.jpg",
      "./images/appartments/106-3.jpg",
      "./images/appartments/106-2.jpg",
      "./images/appartments/106-1.jpg"
    ]
  },
  {
    id: 35,
    titre: "Studio de 21m² au premier étage",
    description: `Studio de 21m² au premier étage meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 505,
    paths: [
      "./images/appartments/109-3.jpg",
      "./images/appartments/109-2.jpg",
      "./images/appartments/109-1.jpg"
    ]
  },
  {
    id: 42,
    titre: "Studio de 18m² au rez-de-chaussée",
    description: `Studio de 18m² au rez-de-chaussée meublé tout équipé:

Kitchenette toute équipée: Réfrigérateur - 2 plaques électriques - Four micro-ondes - Set vaisselle complet.
Canapé BZ 140 avec matelas Dunlopillo - Bureau avec fauteuil de bureau - Bibliothèque - Chaises - Table de repas - Placard de rangements avec étagères et penderie.
Salle de bain avec baignoire et WC.`,
    prix: 485,
    paths: [
      "./images/appartments/4-4.jpg",
      "./images/appartments/4-3.jpg",
      "./images/appartments/4-2.jpg",
      "./images/appartments/4-1.jpg"
    ]
  }
];

function getStaticAnnonces() {
  return staticAnnonces.map((annonce) => ({
    ...annonce,
    path: annonce.paths[0]
  }));
}

function getStaticAnnonceById(id) {
  return staticAnnonces.find((annonce) => String(annonce.id) === String(id));
}

export { getStaticAnnonces, getStaticAnnonceById };