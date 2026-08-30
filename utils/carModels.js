// utils/carModels.js — خريطة الماركات والموديلات
// المفتاح هو اسم الماركة كما في BRANDS داخل constants.js

export const BRAND_MODELS = {
  Renault: ['Clio', 'Symbol', 'Megane', 'Kangoo', 'Captur', 'Kadjar', 'Duster', 'Talisman', 'Fluence', 'Scenic', 'Laguna', 'Master', 'Trafic', 'Express', 'Logan', 'Sandero', 'Twingo', 'Koleos', 'Arkana', 'Austral', 'R4', 'R5', 'R9', 'R12', 'R18', 'R21'],
  Peugeot: ['208', '207', '206', '301', '308', '307', '306', '405', '406', '407', '508', '2008', '3008', '5008', '1007', 'Partner', 'Expert', 'Boxer', 'Bipper', 'Rifter', 'Traveller', '605', '806'],
  Volkswagen: ['Golf', 'Polo', 'Passat', 'Jetta', 'Tiguan', 'Touareg', 'T-Roc', 'T-Cross', 'Caddy', 'Transporter', 'Amarok', 'Arteon', 'Touran', 'Sharan', 'Bora', 'Beetle', 'Scirocco', 'ID.4', 'Up'],
  Hyundai: ['i10', 'i20', 'i30', 'i40', 'Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'Venue', 'Bayon', 'Grand i10', 'H1', 'H100', 'Getz', 'Atos', 'Matrix', 'Terracan', 'Ioniq'],
  Dacia: ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Stepway', 'Spring', 'Jogger', 'Solenza', 'Pick-Up'],
  Toyota: ['Corolla', 'Yaris', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Prado', 'Auris', 'Avensis', 'C-HR', 'Fortuner', 'Hiace', 'Prius', 'Highlander', 'Supra', 'Starlet', 'Carina'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'City', 'Pilot', 'Fit', 'Odyssey', 'Prelude', 'Legend'],
  Kia: ['Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Ceed', 'Optima', 'Seltos', 'Stonic', 'Soul', 'Carens', 'Carnival', 'K5', 'Pride', 'Niro', 'EV6'],
  BMW: ['Série 1', 'Série 2', 'Série 3', 'Série 4', 'Série 5', 'Série 6', 'Série 7', 'Série 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'M3', 'M4', 'M5', 'i3', 'i4', 'iX'],
  'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'Classe G', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'ML', 'Sprinter', 'Vito', 'Viano', 'Citan', 'AMG GT', 'EQC', '190'],
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'RS3', 'RS6', 'S3', 'S4'],
  Citroën: ['C1', 'C2', 'C3', 'C4', 'C5', 'C-Elysée', 'Berlingo', 'Jumpy', 'Jumper', 'Nemo', 'C3 Aircross', 'C4 Cactus', 'C4 Picasso', 'DS3', 'DS4', 'DS5', 'Xsara', 'Saxo', 'ZX', 'BX'],
  Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Zafira', 'Meriva', 'Vectra', 'Combo', 'Vivaro', 'Movano', 'Antara', 'Adam', 'Kadett'],
  Ford: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'EcoSport', 'Puma', 'Explorer', 'Ranger', 'Transit', 'Tourneo', 'Escort', 'Mustang', 'Edge', 'Fusion', 'C-Max', 'S-Max'],
  Chevrolet: ['Spark', 'Aveo', 'Cruze', 'Malibu', 'Captiva', 'Orlando', 'Trax', 'Camaro', 'Optra', 'Epica', 'Lacetti', 'Silverado', 'Tahoe'],
  Nissan: ['Micra', 'Sunny', 'Sentra', 'Qashqai', 'X-Trail', 'Juke', 'Navara', 'Patrol', 'Pathfinder', 'Almera', 'Note', 'Primera', 'Tiida', 'Kicks', 'Leaf', 'Urvan'],
  Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-7', 'CX-9', 'MX-5', 'BT-50', '323', '626'],
  Suzuki: ['Swift', 'Alto', 'Baleno', 'Vitara', 'Grand Vitara', 'Jimny', 'Celerio', 'Ertiga', 'S-Cross', 'Ignis', 'Maruti', 'Samurai'],
  Mitsubishi: ['Lancer', 'Pajero', 'Outlander', 'ASX', 'L200', 'Montero', 'Colt', 'Eclipse', 'Space Star', 'Attrage', 'Galant'],
  Fiat: ['500', 'Punto', 'Panda', 'Tipo', 'Doblo', 'Ducato', 'Fiorino', 'Bravo', 'Linea', 'Uno', 'Palio', 'Siena', '500X', '500L', 'Croma'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Toledo', 'Cordoba', 'Altea', 'Exeo', 'Alhambra', 'Mii'],
  Skoda: ['Fabia', 'Octavia', 'Superb', 'Rapid', 'Kodiaq', 'Karoq', 'Kamiq', 'Scala', 'Yeti', 'Roomster', 'Felicia', 'Enyaq'],
  Jeep: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Patriot', 'Commander', 'Gladiator', 'Avenger'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Discovery', 'Discovery Sport', 'Defender', 'Freelander'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  Chery: ['Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6', 'QQ', 'Fulwin', 'Envy', 'Cowin'],
  Geely: ['Emgrand', 'Coolray', 'Azkarra', 'Okavango', 'Tugella', 'Atlas', 'GC6', 'CK', 'Panda', 'Starray'],
  'Great Wall (GWM)': ['Wingle 5', 'Wingle 7', 'Poer', 'Steed', 'Hover', 'Voleex', 'Tank 300', 'Tank 500'],
  Haval: ['H1', 'H2', 'H6', 'H9', 'Jolion', 'Dargo', 'F7', 'Big Dog'],
  BYD: ['F0', 'F3', 'Song', 'Tang', 'Han', 'Qin', 'Yuan', 'Atto 3', 'Dolphin', 'Seal', 'Seagull'],
  Changan: ['Alsvin', 'Eado', 'CS35', 'CS55', 'CS75', 'CS85', 'CS95', 'Benni', 'Star Truck', 'UNI-T'],
  JAC: ['S2', 'S3', 'S4', 'S5', 'S7', 'J3', 'J4', 'J5', 'T6', 'T8', 'X200', 'Sunray', 'Refine'],
  MG: ['MG3', 'MG5', 'MG6', 'MG7', 'ZS', 'HS', 'RX5', 'RX8', 'Marvel R', 'MG4', 'One'],
  FAW: ['Bestune', 'V2', 'V5', 'X40', 'X80', 'Besturn B30', 'Besturn B50', 'Jiefang', 'Sirius'],
  Dongfeng: ['S30', 'H30', 'AX3', 'AX4', 'AX7', 'Rich', 'Glory 580', 'Fengon', 'Mini EV'],
  GAC: ['GS3', 'GS4', 'GS5', 'GS8', 'GA3', 'GA4', 'GA6', 'Emkoo', 'Empow', 'Aion S'],
  Wuling: ['Hongguang', 'Almaz', 'Confero', 'Cortez', 'Air EV', 'Bingo', 'Sunshine'],
  Omoda: ['C5', 'C7', 'E5', 'S5', 'Omoda 3'],
  Jaecoo: ['J7', 'J8', 'J5', 'J6'],
  Exeed: ['TXL', 'VX', 'LX', 'RX', 'Sterra'],
  Zotye: ['T600', 'T700', 'Z300', 'Nomad', 'Hunter', 'Damai X5'],
  Lifan: ['520', '620', 'X50', 'X60', 'X70', 'Solano', 'Myway', 'Foison'],
  Baic: ['X25', 'X35', 'X55', 'X7', 'BJ40', 'Senova', 'Weiwang', 'EU5'],
  Foton: ['Tunland', 'View', 'Aumark', 'Gratour', 'Sauvana', 'Toano'],
  SsangYong: ['Korando', 'Rexton', 'Tivoli', 'Actyon', 'Musso', 'Kyron', 'Rodius'],
  Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80', 'GV60'],
  Subaru: ['Impreza', 'Forester', 'Outback', 'Legacy', 'XV', 'BRZ', 'WRX', 'Ascent'],
  Isuzu: ['D-Max', 'MU-X', 'NPR', 'NQR', 'Trooper', 'Rodeo', 'FVR'],
  Daihatsu: ['Terios', 'Sirion', 'Materia', 'Gran Max', 'Xenia', 'Charade', 'Feroza'],
  'Alfa Romeo': ['Giulietta', 'Giulia', 'Stelvio', 'Mito', '147', '156', '159', '166', 'Brera', 'Tonale'],
  Lancia: ['Ypsilon', 'Delta', 'Musa', 'Thema', 'Phedra'],
  Volvo: ['S40', 'S60', 'S80', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C30', 'EX30'],
  Saab: ['9-3', '9-5', '900', '9000'],
  Mini: ['Cooper', 'Countryman', 'Clubman', 'Paceman', 'Cabrio', 'One'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman', 'Taycan'],
  Jaguar: ['XE', 'XF', 'XJ', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type', 'S-Type', 'X-Type'],
  Bentley: ['Continental', 'Bentayga', 'Flying Spur', 'Mulsanne'],
  'Rolls-Royce': ['Phantom', 'Ghost', 'Wraith', 'Cullinan', 'Dawn'],
  'Aston Martin': ['DB9', 'DB11', 'DBX', 'Vantage', 'Rapide', 'Vanquish'],
  Maserati: ['Ghibli', 'Quattroporte', 'Levante', 'GranTurismo', 'Grecale', 'MC20'],
  Ferrari: ['488', 'F8', 'Roma', 'Portofino', 'SF90', '812', 'California', '458'],
  Lamborghini: ['Huracan', 'Aventador', 'Urus', 'Gallardo', 'Revuelto'],
  McLaren: ['570S', '720S', 'GT', 'Artura', '765LT'],
  Dodge: ['Charger', 'Challenger', 'Durango', 'Journey', 'RAM', 'Caliber', 'Nitro'],
  Chrysler: ['300C', 'Voyager', 'Pacifica', 'PT Cruiser', 'Sebring'],
  Cadillac: ['Escalade', 'CTS', 'ATS', 'XT5', 'SRX', 'XT4', 'Lyriq'],
  GMC: ['Sierra', 'Yukon', 'Terrain', 'Acadia', 'Canyon', 'Savana'],
  Lincoln: ['Navigator', 'MKZ', 'MKX', 'Aviator', 'Corsair', 'Continental'],
  Buick: ['Encore', 'Envision', 'Enclave', 'Regal', 'LaCrosse', 'Excelle'],
  RAM: ['1500', '2500', '3500', 'ProMaster'],
  Lexus: ['IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'UX', 'RC', 'CT'],
  Infiniti: ['Q30', 'Q50', 'Q60', 'Q70', 'QX50', 'QX60', 'QX70', 'QX80', 'FX35'],
  Acura: ['ILX', 'TLX', 'RDX', 'MDX', 'RSX', 'TSX', 'NSX'],
  Lada: ['Niva', 'Granta', 'Vesta', 'Largus', 'Kalina', 'Priora', 'Samara', '2107'],
  Proton: ['Saga', 'Persona', 'Waja', 'Gen-2', 'Exora', 'X50', 'X70'],
  Tata: ['Indica', 'Indigo', 'Nano', 'Safari', 'Xenon', 'Harrier', 'Nexon'],
  Mahindra: ['Scorpio', 'XUV500', 'XUV300', 'Bolero', 'Thar', 'KUV100', 'Pik-Up'],
};

// إرجاع موديلات ماركة معيّنة، مع "أخرى" دائماً كخيار أخير
export function getModelsForBrand(brand) {
  if (!brand) return [];
  const models = BRAND_MODELS[brand];
  if (!models || models.length === 0) return ['أخرى'];
  return [...models, 'أخرى'];
}

// كل الموديلات في قائمة واحدة (تُستخدم في البحث عندما لا تُحدَّد ماركة)
export function getAllModels() {
  const set = new Set();
  Object.values(BRAND_MODELS).forEach((list) => list.forEach((m) => set.add(m)));
  return [...set].sort((a, b) => a.localeCompare(b));
}
