import React from 'react';

export const LegalNoticePage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate max-w-none">
                    <h1>Mentions légales</h1>

                    <h2>1. Éditeur du site</h2>
                    <p>
                        Le présent site est édité dans le cadre du projet <strong>DataWood Consortium</strong>, une démarche collective de préfiguration dédiée à la structuration et à la gouvernance des données de la filière forêt-bois.
                    </p>
                    <p><strong>Porteur du projet et responsable de la publication</strong></p>
                    <p>
                        Kosmio SAS<br />
                        Adresse : Villa 8, 301 rue du Romarin, 34160 Castries, France<br />
                        Email : contact@kosm.io<br />
                        Téléphone : +33 (0)6 61 20 12 88
                    </p>
                    <p>Directeur de la publication :<br />Mathieu Pesin, en qualité de représentant du projet.</p>

                    <hr />

                    <h2>2. Hébergement du site</h2>
                    <p>Le site est hébergé par :</p>
                    <p>
                        OVHcloud<br />
                        SAS au capital de 10 174 560 €<br />
                        RCS Lille Métropole 424 761 419 00045<br />
                        Code APE 2620Z<br />
                        Siège social :<br />
                        2 rue Kellermann<br />
                        59100 Roubaix<br />
                        France
                    </p>
                    <p>Site web : https://www.ovhcloud.com</p>

                    <hr />

                    <h2>3. Objet du site</h2>
                    <p>Le site DataWood Consortium a pour objet de :</p>
                    <ul>
                        <li>présenter la démarche DataWood Consortium ;</li>
                        <li>documenter les objectifs, principes et travaux du consortium ;</li>
                        <li>rendre accessibles les livrables publics produits dans le cadre du projet ;</li>
                        <li>faciliter la compréhension et la participation des acteurs de la filière forêt-bois.</li>
                    </ul>
                    <p>Le site n’a <strong>aucune vocation commerciale</strong> et ne propose <strong>aucune offre de service ou de produit</strong>.</p>

                    <hr />

                    <h2>4. Nature du projet et responsabilité</h2>
                    <p>
                        DataWood Consortium est une <strong>démarche de coopération volontaire</strong>, fondée sur le partage de connaissances et la production de livrables collectifs.
                    </p>
                    <p>Les informations diffusées sur le site :</p>
                    <ul>
                        <li>sont fournies à titre informatif ;</li>
                        <li>reflètent un état des travaux à un instant donné ;</li>
                        <li>peuvent évoluer au fil des contributions et validations collectives.</li>
                    </ul>
                    <p>Le porteur du projet ne saurait être tenu responsable :</p>
                    <ul>
                        <li>de l’usage qui pourrait être fait des informations publiées ;</li>
                        <li>des décisions prises par des tiers sur la base des contenus du site.</li>
                    </ul>

                    <hr />

                    <h2>5. Propriété intellectuelle</h2>
                    <h3>Contenus du site</h3>
                    <p>
                        Sauf mention contraire, les contenus publiés sur le site (textes, schémas, documents, méthodologies) sont issus de travaux collectifs réalisés dans le cadre du DataWood Consortium.
                    </p>
                    <p>
                        Ces contenus ont vocation à être diffusés dans une logique de <strong>commun numérique</strong>, selon des licences ouvertes adaptées (par exemple Creative Commons), précisées le cas échéant sur les documents concernés.
                    </p>
                    <h3>Droits réservés</h3>
                    <p>
                        Les travaux antérieurs, marques, logos, contenus ou données appartenant aux partenaires et contributeurs demeurent leur propriété exclusive.
                    </p>
                    <p>
                        Toute reproduction, représentation ou réutilisation non autorisée des contenus du site, en dehors des conditions prévues par les licences applicables, est interdite.
                    </p>

                    <hr />

                    <h2>6. Liens hypertextes</h2>
                    <p>Le site peut contenir des liens vers des sites tiers ou des ressources externes.</p>
                    <p>DataWood Consortium :</p>
                    <ul>
                        <li>n’exerce aucun contrôle sur le contenu de ces sites ;</li>
                        <li>décline toute responsabilité quant à leur contenu ou à leur disponibilité.</li>
                    </ul>

                    <hr />

                    <h2>7. Données personnelles</h2>
                    <p>Le site DataWood Consortium ne collecte des données personnelles que dans la mesure strictement nécessaire, notamment via :</p>
                    <ul>
                        <li>les formulaires de contact ;</li>
                        <li>les demandes d’information ou de contribution.</li>
                    </ul>
                    <p>Les données collectées sont :</p>
                    <ul>
                        <li>utilisées exclusivement pour les finalités indiquées ;</li>
                        <li>conservées pour une durée limitée ;</li>
                        <li>jamais cédées à des tiers à des fins commerciales.</li>
                    </ul>
                    <p>
                        Conformément au Règlement général sur la protection des données (RGPD), vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant.
                    </p>
                    <p>
                        Toute demande peut être adressée à :<br />
                        contact@kosm.io
                    </p>

                    <hr />

                    <h2>8. Cookies</h2>
                    <p>
                        Le site peut utiliser des cookies strictement nécessaires à son fonctionnement ou à des mesures d’audience anonymisées.
                    </p>
                    <p>Aucun cookie publicitaire ou de traçage commercial n’est utilisé.</p>

                    <hr />

                    <h2>9. Droit applicable</h2>
                    <p>Le présent site est régi par le droit français.</p>
                    <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
                </div>
            </div>
        </div>
    );
};
