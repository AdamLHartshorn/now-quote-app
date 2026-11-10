import type { Prospect } from "./territory-types";

// Reviewed editorial snapshot; each business belongs to its physical-address ZIP.
// Conversation starters below are suggestions, not confirmed shipping requirements.
const entries = [
  ["47201", "Applied Laboratories", "Pharmaceutical contract manufacturing", "3240 N Indianapolis Road, Columbus", "Ask about product samples and manufacturing supplies; confirm product handling requirements.", "https://www.appliedlabs.com/contact/", "812-372-2607"],
  ["47201", "Pyramid", "Custom packaging", "725 S Mapleton, Columbus", "Ask about packaging samples, urgent cartons, and finished-order deliveries.", "https://business.columbusareachamber.com/list/member/pyramid-500", "812-372-0288"],
  ["47201", "First Metals and Plastics", "Metals and plastics", "3805 Jonesville Road, Columbus", "Ask about small material orders and urgent customer deliveries.", "https://www.firstmetals.us/contact", "812-379-4400"],
  ["47201", "Cunningham Precision Group", "Machining and patterns", "4399 North US Highway 31, Columbus", "Ask about patterns, machined parts, and foundry transfers.", "https://cunninghamprecision.com/contact.html", "812-379-9571"],
  ["47201", "Central Sheet Metal", "Sheet metal fabrication", "925 S Marr Road, Columbus", "Ask about fabricated components and time-sensitive jobsite deliveries.", "https://www.centralsheetmetalco.com/contact-us", "812-372-9976"],
  ["47203", "Creative Tool and Machining", "Tooling and machining", "4010 Middle Road, Columbus", "Ask about tooling, finished components, and supplier pickups.", "https://business.columbusareachamber.com/list/category/manufacturers-111", "812-378-3562"],
  ["47203", "Flambeau", "Manufacturing", "4325 Middle Road, Columbus", "Ask about customer samples and urgent plant-supply deliveries.", "https://business.columbusareachamber.com/list/category/manufacturers-111", "812-372-4899"],
  ["47203", "ColeTech", "Engineering and fabrication", "3880 N Long Road, Columbus", "Ask about prototypes, testing components, and fabricated parts.", "https://coleusa.com/", "812-378-0800"],
  ["47203", "Lear Machining & Waterjet", "Machining and fabrication", "4056 N Long Road, Columbus", "Ask about finished assemblies, cut parts, and outside-processing deliveries.", "https://www.learmachining.com/", "812-418-8111"],
  ["47203", "Sterling Industries — North Plant", "Precision manufacturing", "4015 N Long Road, Columbus", "Ask about prototypes, production components, and plant transfers.", "https://sterlingindustriesusa.com/?products=22402706", "812-376-8286"],
  ["46140", "Engineered Machined Products", "Thermal-management manufacturing", "125 N Blue Road, Greenfield", "Ask about urgent production components and replacement parts.", "https://www.concentricab.com/contact-us/concentric-greenfield-office/", "317-642-8894"],
  ["46140", "Indiana Automotive Fasteners", "Automotive fasteners", "1300 Anderson Boulevard, Greenfield", "Ask about emergency fastener shipments and supplier transfers.", "https://www.iafi.com/contact-us/", "317-467-0100"],
  ["46140", "TRG — Greenfield", "Packaging and displays", "2200 Royal Drive, Greenfield", "Ask about packaging samples, urgent cartons, and overflow deliveries.", "https://www.teamtrg.com/locations/greenfield-indiana/", "317-462-7743"],
  ["46140", "Service Engineering", "Parts feeding and machining", "2190 West Main Street, Greenfield", "Ask about customer samples and machine-service parts.", "https://serviceengineering.com/service-engineering-inc-acquires-assets-of-piercy-machine-company-a-long-standing-partnership-becomes-an-integrated-company/", "317-467-2000"],
  ["46140", "ATMI Indy", "Precast manufacturing", "6324 W Stoner Drive, Greenfield", "Ask about tooling, maintenance parts, and small jobsite supplies.", "https://www.linkedin.com/company/atmi-indy-llc"],
  ["46168", "AMS Production Machining", "CNC and screw machining", "800 Andico Road, Plainfield", "Ask about finished parts, prototypes, and outside-processing transfers.", "https://www.amsmachining.com/", "317-838-9273"],
  ["46168", "Jeco Plastic Products", "Plastic manufacturing", "885 Andico Road, Plainfield", "Ask about sample pallets, molded components, and maintenance parts.", "https://www.jecoplastics.com/wp-content/uploads/2026/04/Jeco-Capability-Statement-2026R.pdf", "317-839-4943"],
  ["46168", "ProDoor Manufacturing", "Garage doors and components", "6030 Gateway Drive, Plainfield", "Ask about urgent door components and dealer replenishment.", "https://www.prodoorsystems.com/", "800-888-0329"],
  ["46168", "317 Graphics and Apparel", "Printing and apparel", "5778 E US Highway 40, Plainfield", "Ask about finished event orders and time-sensitive print deliveries.", "https://business.plainfield-in.com/directory/Find", "317-223-4146"],
  ["46168", "American Floor Covering", "Commercial flooring", "2340 E Perry Road, Suite 181, Plainfield", "Ask about flooring samples and jobsite material replenishment.", "https://business.plainfield-in.com/directory/Find", "317-837-0980"],
  ["46112", "TCV Manufacturing", "Manufacturing", "8599 Motorsports Way, Brownsburg", "Ask about production-parts shipments and supplier pickups.", "https://www.tcvmanufacturing.com/policies/contact-information", "317-939-0144"],
  ["46112", "HMD Motorsports", "Race preparation", "843 East Main Street, Brownsburg", "Ask about urgent race components and local supplier transfers.", "https://www.hmdmotorsports.com/facility/", "317-270-8723"],
  ["46112", "Vance & Hines Motorsports", "Performance parts", "1211 E Northfield Drive, Brownsburg", "Ask about engine-service parts and performance-component deliveries.", "https://vanceandhinesmotorsports.com/contact/", "317-852-9057"],
  ["46112", "Brown & Miller Racing Solutions", "Hoses and fittings", "489 Southpoint Circle, Suite 300, Brownsburg", "Ask about urgent hose assemblies and race-shop replenishment.", "https://bmrs.net/BMRS_hose_catalog_lo-res.pdf", "317-520-4400"],
  ["46112", "C.F. Roark Welding & Engineering", "Precision fabrication", "136 N Green Street, Brownsburg", "Ask about fabricated components, tooling, and processing transfers.", "https://roarkfab.com/contact/", "317-852-3163"],
  ["46060", "SMC Corporation of America", "Industrial automation", "10100 SMC Boulevard, Noblesville", "Ask about urgent pneumatic components and distributor replenishment.", "https://www.smcworld.com/corporate/network/usa.html", "800-762-7621"],
  ["46060", "Burco Molding", "Plastic injection molding", "15015 Herriman Boulevard, Noblesville", "Ask about prototype deliveries, tooling transfers, and finished components.", "https://www.burco-molding.com/fast-prototyping.html", "317-773-5699"],
  ["46060", "INDEX Corporation", "CNC machines and service", "14700 North Pointe Boulevard, Noblesville", "Ask about urgent machine-service parts and customer-site deliveries.", "https://www.index-group.com/en/company/locations", "317-770-6300"],
  ["46060", "KMC Mold", "Molds and tooling", "1709 Cherry Street, Noblesville", "Ask about tooling, prototype parts, and transfers to customers or finishers.", "https://kmcmold.com/"],
  ["46060", "MPP", "Powdered-metal components", "14670 Cumberland Road, Noblesville", "Ask about prototype components and engineering-sample shipments.", "https://mppinnovation.com/wp-content/uploads/2023/06/mpp-pm-solutions1.pdf"],
  ["46176", "Ryobi Die Casting", "Automotive castings", "800 W Mausoleum Road, Shelbyville", "Ask about tooling and urgent components. Delivery entrance: 525 Industrial Drive.", "https://www.ryobidiecasting.com/", "317-398-3398"],
  ["46176", "Yushiro Manufacturing America", "Metalworking products", "783 W Mausoleum Road, Shelbyville", "Ask about samples and plant supplies; confirm handling requirements for chemicals.", "https://yushirousa.com/contact/", "317-398-9862"],
  ["46176", "Brazeway Indiana", "Manufacturing", "1109 Lincoln Street, Shelbyville", "Ask about maintenance parts, samples, and supplier transfers.", "https://www.brazeway.com/contact", "317-392-2533"],
  ["46176", "Knauf Insulation North America", "Insulation manufacturing", "One Knauf Drive, Shelbyville", "Ask about samples, maintenance components, and urgent plant supplies.", "https://www.knaufinsulation.com/addresses", "317-398-4434"],
  ["46176", "Cleveland Trencher — Indiana Plant", "Machinery parts", "860 Elston Drive, Shelbyville", "Ask about replacement parts and urgent shipments to equipment customers.", "https://cleveland-trencher.com/special_order.aspx", "317-825-0919"],
];

export const staticProspects: Record<string, Prospect[]> = {};
for (const [zip, name, category, streetCity, reason, sourceUrl, phone] of entries) {
  const list = staticProspects[zip] ??= [];
  list.push({ id: `${zip}-${list.length + 1}`, name, category, address: `${streetCity}, IN ${zip}`, reason, sourceUrl, phone, researchedOn: "2026-11-10" });
}
