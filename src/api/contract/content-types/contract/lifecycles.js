const MemoryStream = require("memorystream");
const fs = require("fs");
const pdf = require("pdfjs");
const tmp = require("tmp");

const Helvetica = require("pdfjs/font/Helvetica.js");
const HelveticaBold = require("pdfjs/font/Helvetica-Bold.js");
const HelveticaOblique = require("pdfjs/font/Helvetica-Oblique.js");

const loadPDFContract = (result) => {
  const doc = new pdf.Document();

  doc
    .footer()
    .pageNumber(
      (currentPage, totalPage) => `Page ${currentPage} sur ${totalPage}`
    );

  doc.text(`Contrat de location`, {
    textAlign: "center",
    font: HelveticaBold,
    fontSize: 20,
  });
  doc.text(
    `(Soumis au titre ler bis de la loi du 6 juillet 1989 et portant modification de la loi n°86-1290 du 23 décembre 1986 - bail type conforme aux dispositions de la loi Alur de 2014, mis en application par le décret du 29 mai 2015)`,
    {
      textAlign: "center",
      font: Helvetica,
    }
  );
  doc
    .text(`LOCAUX MEUBLES A USAGE D'HABITATION`, {
      textAlign: "center",
      font: HelveticaBold,
    })
    .br();
  doc
    .text(
      `Modalités d'application du contrat type du décret du 29 mal 2015 : `,
      {
        font: HelveticaBold,
        fontSize: 9,
      }
    )
    .append(
      ` Le régime de droit commun en matière de baux d'habitation est défini principalement par la loi n°89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs et portant modification de la loi n°86-1290 du 23 décembre 1986. L'ensemble de ces dispositions étant d'ordre public, elles s'imposent aux parties qui, en principe, ne peuvent pas y renoncer.`,
      { font: Helvetica }
    )
    .br()
    .br();
  doc.text(`I. Désignation des parties`, { font: HelveticaBold }).br();
  doc
    .text(
      `Le présent contrat est conclu entre les soussignés :
Qualité du bailleur :`
    )
    .append(` ${result.bailleur?.denominator ?? ""}`, {
      font: HelveticaBold,
    });
  doc
    .text(`Nom et prénom du bailleur :`)
    .append(
      ` ${result.bailleur?.last_name ?? ""} ${result.bailleur?.first_name ?? ""
      }`,
      {
        font: HelveticaBold,
      }
    );
  doc
    .text(`Adresse : `)
    .append(` ${result.bailleur?.address ?? ""}`, { font: HelveticaBold });
  doc
    .text(`Adresse email :`)
    .append(` ${result.bailleur?.email ?? ""}`, { font: HelveticaBold })
    .br();
  doc
    .text(`désigné (s) ci-après`)
    .append(` « le bailleur » ;`, { font: HelveticaBold });
  doc.text(`Nom et prénom du ou des locataires, adresse email`, { font: HelveticaBold });
  result.locataires?.forEach((locataire) => {
    doc.text(
      `${locataire?.last_name ?? ""} ${locataire?.first_name ?? ""
      }, ${locataire?.email ?? ""}`,
      {
        font: HelveticaBold,
      }
    );
  });
  doc.text(`désigné(s) ci-après`).append(` « le locataire » ;`, { font: HelveticaBold }).br();
  doc.text(`Il a été convenu ce qui suit :`).br();
  doc.text(`II. Objet du contrat`, { font: HelveticaBold }).br();
  doc.text(
    `Le présent contrat a pour objet la location d'un logement ainsi déterminé :`
  ).br();
  doc.text(`    A. Consistance du logement`, {}).br();
  doc.text(`Adresse du logement`);
  doc.text(`${result.object?.address ?? ""}`, {
    font: HelveticaBold,
  });
  doc
    .text(`Période de construction :`)
    .append(` ${result.object?.periode_construction}`);
  doc
    .text(`- surface habitable :`)
    .append(` ${result.object?.surface ?? ""}`, { font: HelveticaBold });
  doc
    .text(`- nombre de pièces principales : `)
    .append(` ${result.object?.pieces ?? ""}`, { font: HelveticaBold });
  doc
    .text(`- autres parties du logement : `)
    .append(` ${result.object?.other ?? ""}`, { font: HelveticaBold })
    .br();
  doc.text(`Éléments d'équipements du logement :`).br();
  doc.text(`${result.object?.equipments ?? ""}`, { font: HelveticaBold }).br();
  doc
    .text(`Modalité de production de chauffage : `)
    .append(` ${result.object?.chauffage ?? ""}`, { font: HelveticaBold });
  doc
    .text(`Modalité de production d'eau chaude sanitaire : `)
    .append(` ${result.object?.eau ?? ""}`, { font: HelveticaBold })
    .br();

  doc
    .text(
      `
  Le cas échéant, La consommation énergétique du logement, déterminée selon la méthode du diagnostic de performance énergétique mentionné à l'article L. 126-26 du code de la construction et de l'habitation, ne doit pas excéder, à compter du 1er janvier 2028, le seuil fixé au I de l'article L. 173-2 du même code¹ :`
    )
    .br();
  doc
    .text(
      `
  B. Destination des locaux :`
    )
    .append(` ${result.object?.destination ?? ""}`, { font: HelveticaBold })
    .br();
  doc
    .text(
      `
  C. Désignation des locaux et équipements accessoires de l'immeuble à usage privatif du locataire : ${result.object.designation}`
    )
    .br();
  doc
    .text(
      `
  D. Le cas échéant, Énumération des locaux, parties, équipements et accessoires de l'immeuble à usage commun : `
    )
    .append(` ${result.object?.enumeration ?? ""}`, {
      font: HelveticaBold,
    })
    .br();
  doc
    .text(
      `
  E. Équipement d'accès aux technologies de l'information et de la communication [modalités de réception de la télévision dans l'immeuble, modalités de raccordement internet etc.] : `
    )
    .append(` ${result.object?.technology ?? ""}`, { font: HelveticaBold })
    .br();
  doc
    .text(
      `
  Ill. Date de prise d'effet et durée du contrat`,
      { font: HelveticaBold }
    )
    .br();
  doc.text(`
  La durée du contrat et sa date de prise d'effet sont ainsi définies :`);
  doc.text(`
  A. Date de prise d'effet du contrat : ${result.date ?? ""}`);
  doc
    .text(
      `
  B. Durée du contrat : `
    )
    .append(` ${result.duree ?? ""}`, { font: HelveticaBold })
    .br();
  doc
    .text(
      `
  A l'exception des locations consenties à un étudiant pour une durée de neuf mois, les contrats de location de logements meublés sont reconduits tacitement à leur terme pour une durée d'un an et dans les mêmes conditions. Le locataire peut mettre fin au bail à tout moment, après avoir donné congé. Le bailleur peut, quant à lui, mettre fin au bail à son échéance et après avoir donné congé, soit pour reprendre le logement en vue de l'occuper lui-même ou une personne de sa famille, soit pour le vendre, soit pour un motif sérieux et légitime. Les contrats de locations meublées consenties à un étudiant pour une durée de neuf mois ne sont pas reconduits tacitement à leur terme et le locataire peut mettre fin au bail à tout moment, après avoir donné congé. Le bailleur peut, quant à lui, mettre fin au bail à son échéance et après avoir donné congé.`,
      { fontSize: 9 }
    )
    .br();
  doc
    .text(
      `
  IV. Conditions financières`,
      { font: HelveticaBold }
    )
    .br();
  doc
    .text(
      `
  Les parties conviennent des conditions financières suivantes :`
    )
    .br();
  doc
    .text(
      `
  A. Loyer`
    )
    .br();
  doc.text(`
  1° Fixation du loyer initial :`);
  doc
    .text(
      `
  Montant du loyer mensuel² : `
    )
    .append(` ${result.montant ?? ""}`, {
      font: HelveticaBold,
    })
    .br();
  doc
    .text(
      `
  V. Travaux`,
      { font: HelveticaBold }
    )
    .br();
  doc
    .text(
      `
  A. Le cas échéant, Montant et nature des travaux d'amélioration ou de mise en conformité avec les caractéristiques de décence effectués depuis la fin du dernier contrat de location ou depuis le dernier renouvellement³ : `
    )
    .append(` ${result.travaux?.A ?? ""}`, {
      font: HelveticaBold,
    })
    .br();
  doc.text(`
  B. Majoration du loyer en cours de bail consécutive à des travaux d'amélioration entrepris par le bailleur⁴ [nature des travaux, modalités d'exécution, délai de réalisation ainsi que montant de la majoration du loyer] :`);
  doc
    .text(
      `
        ${result.travaux?.B ?? ""}`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc
    .text(
      `
  C. Le cas échéant, Diminution de loyer en cours de bail consécutive à des travaux entrepris par le locataire [durée de cette diminution et, en cas de départ anticipé du locataire, modalités de son dédommagement sur justification des dépenses effectuées]:`
    )
    .append(` ${result.travaux?.C ?? ""}`, {
      font: HelveticaBold,
    })
    .br();
  doc.text(`
  Mention obligatoire s'appliquant aux logements dont la consommation énergétique, déterminée selon la méthode du diagnostic de performance énergétique mentionné à l'article L. 126-26 du code de la construction et de l'habitation, excède le seuil fixé au I de l'article L. 173-2 du même code.`);
  doc
    .text(
      `
  Lorsqu'un complément de loyer est appliqué, le loyer mensuel s'entend comme la somme du loyer de base et de ce
  complément.`
    )
    .br();
  doc
    .text(
      `
  Le cas échéant, préciser par ailleurs le montant des travaux d'amélioration effectués au cours des six derniers mois.`
    )
    .br();
  doc
    .text(
      `
  Clause invalide pour les travaux de mise en conformité aux caractéristiques de décence;`
    )
    .br();

  doc
    .text(
      `
  VI. Garanties`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc
    .text(
      `
  Montant du dépôt de garantie :  `
    )
    .append(` ${result.depot ?? ""}`, {
      font: HelveticaBold,
    })
    .br();
  doc
    .text(
      `
  VII. Clause de solidarité`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc
    .text(
      `
  Modalités particulières des obligations en cas de pluralité de locataires : en cas de colocation, c'est à dire de la location d'un même logement par plusieurs locataires, constituant leur résidence principale et formalisée par la conclusion d'un contrat unique ou de plusieurs contrats entre les locataires et le bailleur, les locataires sont tenus conjointement, solidairement et indivisiblement à l'égard du bailleur au paiement des loyers, charges et accessoires dus en application du présent bail. La solidarité d'un des colocataires et celle de la personne qui s'est portée caution pour lui prennent fin à la date d'effet du congé régulièrement délivré et lorsqu'un nouveau colocataire figure au bail. A défaut, la solidarité du colocataire sortant s'éteint au plus tard à l'expiration d'un délai de six mois après la date d'effet du congé.`
    )
    .br();
  doc
    .text(
      `
  VIII. Clause résolutoire`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc
    .text(
      `
  Modalités de résiliation de plein droit du contrat : Le bail sera résilié de plein droit en cas d'inexécution des obligations du locataire, soit en cas de défaut de paiement des loyers et des charges locatives au terme convenu, de non-versement du dépôt de garantie, de défaut d'assurance du locataire contre les risques locatifs, de troubles de voisinage constatés par une décision de justice passée en force de chose jugée rendue au profit d'un tiers. Le bailleur devra assigner le locataire devant le tribunal pour faire constater l'acquisition de la clause résolutoire et la résiliation de plein droit du bail. Lorsque le bailleur souhaite mettre en œuvre la clause résolutoire pour défaut de paiement des loyers et des charges ou pour non- versement du dépôt de garantie, il doit préalablement faire signifier au locataire, par acte d'huissier, un commandement de payer, qui doit mentionner certaines informations et notamment la faculté pour le locataire de saisir le fonds de solidarité pour le logement. De plus, pour les bailleurs personnes physiques ou les sociétés immobilières familiales, le commandement de payer doit être signalé par l'huissier à la commission de coordination des actions de prévention des expulsions locatives dès lors que l'un des seuils relatifs au montant et à l'ancienneté de la dette, fixé par arrêté préfectoral, est atteint. Le locataire peut, à compter de la réception du commandement, régler sa dette, saisir le juge d'instance pour demander des délais de paiement, voire demander ponctuellement une aide financière à un fonds de solidarité pour le logement. Si le locataire ne s'est pas acquitté des sommes dues dans les deux mois suivant la signification, le bailleur peut alors assigner le locataire en justice pour faire constater la résiliation de plein droit du bail. En cas de défaut d'assurance, le bailleur ne peut assigner en justice le locataire pour faire constater l'acquisition de la clause résolutoire qu'après un délai d'un mois après un commandement demeuré infructueux.`
    )
    .append(
      `Clause applicable selon les modalités décrites au paragraphe 4.3.2.1. de la notice d'information jointe au présent bail.`,
      { font: HelveticaOblique }
    )
    .br();
  doc
    .text(
      `
  X. Autres conditions particulières`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc.text(
    `
      ${result.conditions ?? ""}`,
    {
      font: HelveticaBold,
    }
  );
  doc
    .text(
      `
  XI. Annexes`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc.text(
    `
  Sont annexées et jointes au contrat de location les pièces suivantes :`
  );
  doc.text(
    `
  Une notice d'information relative aux droits et obligations des locataires et des bailleurs`,
    {
      font: HelveticaBold,
    }
  );
  doc
    .text(
      `
  Un état des lieux, un inventaire et un état détaillé du mobilier⁵⁶`,
      {
        font: HelveticaBold,
      }
    )
    .br();
  doc.text(
    `
  Le ${result.signature?.date ?? ""}, à ${result.signature?.lieu ?? ""}`,
    {
      font: HelveticaBold,
    }
  );
  doc
    .text(
      `
  Signature du bailleur                                               Signature du locataire
  `
    )
    .br();

  const memStream = new MemoryStream(null, {
    readable: false,
  });

  doc.pipe(memStream);

  doc.on("end", function () {
    try {
      const pdfBuffer = Buffer.concat(memStream.queue);

      const tempPDF = tmp.fileSync({ postfix: ".pdf" });

      fs.writeFileSync(tempPDF.name, pdfBuffer);

      const fileStat = fs.statSync(tempPDF.name);

      strapi.plugins.upload.services.upload.upload({
        data: {
          refId: result.id,
          ref: "api::contract.contract",
          field: "contract",
        },
        files: {
          path: tempPDF.name,
          name: `contrat_${result.locataires[0]?.last_name ?? ""}${result.id}${"_" + result.updatedAt
            }.pdf`,
          type: "application/pdf",
          size: fileStat.size,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
  doc.end();
};

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    loadPDFContract(result);
  },
  async beforeUpdate(event) {
    event.params.data.contract = null;
  },
  async afterUpdate(event) {
    const { result } = event;

    loadPDFContract(result);
  },
};
