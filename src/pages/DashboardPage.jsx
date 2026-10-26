import { useState, useRef } from 'react';
import { Globe, ChevronLeft, ChevronRight, TrendingUp, Calendar, MapPin, Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// 30 publicaciones científicas y naturales totales
const ALL_SPECIMENS = [
  { id: '01', taxon: 'Coleoptera', taxonColor: 'text-lime-400 outline-lime-500/30', location: 'Dosel de Oaxaca', author: 'Ale', handle: '@Alezz', time: 'hace 4 h', title: 'Escarabajo de Plata', scientific: '(Chrysina limbata)', description: 'Reflexión especular del 97% en cutícula intacta, recolectado en trampa de luz ultravioleta.', likes: '3.5K', comments: '1.1K', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' },
  { id: '02', taxon: 'Lepidoptera', taxonColor: 'text-orange-400 outline-orange-500/30', location: 'Michoacán, MX', author: 'Elena Ríos', handle: '@elena_bio', time: 'hace 6 h', title: 'Mariposa Monarca', scientific: '(Danaus plexippus)', description: 'Racimo de hibernación sobre oyameles en santuario a 3,100 msnm con baja temperatura.', likes: '2.8K', comments: '430', image: 'https://images.unsplash.com/photo-1559535332-db9971090158?auto=format&fit=crop&w=600&q=80' },
  { id: '03', taxon: 'Mantodea', taxonColor: 'text-pink-400 outline-pink-500/30', location: 'Selva Chiapas', author: 'Adelina', handle: '@AdlNieto', time: 'hace 9 h', title: 'Mantis Orquídea', scientific: '(Hymenopus coronatus)', description: 'Mimetismo agresivo excepcional con pétalos de orquídeas epífitas en sotobosque.', likes: '4.1K', comments: '980', image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80' },
  { id: '04', taxon: 'Scarabaeidae', taxonColor: 'text-yellow-400 outline-yellow-500/30', location: 'Alajuela, Costa Rica', author: 'Magali', handle: '@TinkyW', time: 'hace 12 h', title: 'Escarabajo Hércules', scientific: '(Dynastes hercules)', description: 'Macho de 14.8 cm con élitros que varían de tono según la humedad ambiente.', likes: '1.9K', comments: '310', image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=600&q=80' },
  { id: '05', taxon: 'Trochilidae', taxonColor: 'text-sky-400 outline-sky-500/30', location: 'Morelos, MX', author: 'Carlos Nava', handle: '@ornito_cn', time: 'hace 14 h', title: 'Colibrí Corona Violeta', scientific: '(Ramosomyia violiceps)', description: 'Polinizando flores de salvia silvestre en cañada riparia semicálida.', likes: '2.1K', comments: '189', image: 'https://images.unsplash.com/photo-1550853024-fae8cd484475?auto=format&fit=crop&w=600&q=80' },
  { id: '06', taxon: 'Hylidae', taxonColor: 'text-emerald-400 outline-emerald-500/30', location: 'Tortuguero, CR', author: 'BioSelva', handle: '@selvacr', time: 'hace 16 h', title: 'Rana Arborícola de Ojos Rojos', scientific: '(Agalychnis callidryas)', description: 'Postura reproductiva nocturna sobre hoja de heliconia después de tormenta.', likes: '3.1K', comments: '620', image: 'https://images.unsplash.com/photo-1574068468731-c1221768853b?auto=format&fit=crop&w=600&q=80' },
  { id: '07', taxon: 'Felidae', taxonColor: 'text-amber-400 outline-amber-500/30', location: 'Calakmul, Campeche', author: 'Comité Calakmul', handle: '@calakmul_org', time: 'hace 18 h', title: 'Jaguar en Selva Maya', scientific: '(Panthera onca)', description: 'Fototrampeo en aguada natural durante censo estacional de grandes felinos.', likes: '5.4K', comments: '1.5K', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80' },
  { id: '08', taxon: 'Hábitat', taxonColor: 'text-teal-400 outline-teal-500/30', location: 'Sierra de Juárez, Oax', author: 'Mateo Silvestre', handle: '@mat_silv', time: 'hace 1 d', title: 'Bosque de Niebla y Helechos', scientific: '(Ecosistema mesófilo)', description: 'Saturación del 100% de humedad relativa al amanecer en el estrato medio.', likes: '1.6K', comments: '210', image: 'https://images.unsplash.com/photo-1511497584788-876761197069?auto=format&fit=crop&w=600&q=80' },
  { id: '09', taxon: 'Orchidaceae', taxonColor: 'text-yellow-300 outline-yellow-500/30', location: 'Papantla, Veracruz', author: 'FloraSilvestre', handle: '@florasur', time: 'hace 1 d', title: 'Orquídea de Vainilla Silvestre', scientific: '(Vanilla planifolia)', description: 'Floración efímera de una sola mañana registrada con abeja Melipona nativa.', likes: '2.4K', comments: '378', image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80' },
  { id: '10', taxon: 'Mycenaceae', taxonColor: 'text-lime-400 outline-lime-500/30', location: 'Sierra Tarahumara', author: 'MicologíaMX', handle: '@micomx', time: 'hace 1 d', title: 'Hongo Bioluminiscente', scientific: '(Mycena chlorophos)', description: 'Luz verde esmeralda emitida por luciferina fúngica en madera descompuesta húmeda.', likes: '4.7K', comments: '890', image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80' },
  { id: '11', taxon: 'Coleoptera', taxonColor: 'text-lime-400 outline-lime-500/30', location: 'Veracruz, MX', author: 'Roberto Gómez', handle: '@beto_bio', time: 'hace 1 d', title: 'Escarabajo Rinoceronte', scientific: '(Strategus aloeus)', description: 'Ejemplar macho adulto atraído por la canopia iluminada.', likes: '1.2K', comments: '95', image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80' },
  { id: '12', taxon: 'Lepidoptera', taxonColor: 'text-orange-400 outline-orange-500/30', location: 'Yucatán, MX', author: 'Lucia Méndez', handle: '@lucia_m', time: 'hace 2 d', title: 'Polilla Cometa', scientific: '(Actias selene)', description: 'Patrón de alas con ocelos defensivos contra murciélagos insectívoros.', likes: '3.3K', comments: '412', image: 'https://images.unsplash.com/photo-1559535332-db9971090158?auto=format&fit=crop&w=600&q=80' },
  { id: '13', taxon: 'Aves', taxonColor: 'text-blue-400 outline-blue-500/30', location: 'Chiapas, MX', author: 'Ornitólogo Sur', handle: '@sur_aves', time: 'hace 2 d', title: 'Quetzal Mesoamericano', scientific: '(Pharomachrus mocinno)', description: 'Avistamiento en reserva de la biosfera El Triunfo con plumaje nupcial.', likes: '8.9K', comments: '2.3K', image: 'https://images.unsplash.com/photo-1550853024-fae8cd484475?auto=format&fit=crop&w=600&q=80' },
  { id: '14', taxon: 'Reptilia', taxonColor: 'text-emerald-400 outline-emerald-500/30', location: 'Quintana Roo', author: 'FaunaMaya', handle: '@maya_fauna', time: 'hace 2 d', title: 'Iguana Verde', scientific: '(Iguana iguana)', description: 'Termorregulación matutina sobre rama seca en manglar costero.', likes: '2.2K', comments: '150', image: 'https://images.unsplash.com/photo-1574068468731-c1221768853b?auto=format&fit=crop&w=600&q=80' },
  { id: '15', taxon: 'Mammalia', taxonColor: 'text-amber-400 outline-amber-500/30', location: 'Puebla, MX', author: 'Sierranatura', handle: '@sierra_pue', time: 'hace 3 d', title: 'Lince Rojo', scientific: '(Lynx rufus)', description: 'Registro fotográfico nocturno en zona de matorral espinoso.', likes: '4.5K', comments: '670', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80' },
  { id: '16', taxon: 'Amphibia', taxonColor: 'text-lime-400 outline-lime-500/30', location: 'Hidalgo, MX', author: 'Axolotl MX', handle: '@axol_mx', time: 'hace 3 d', title: 'Ajolote Arroyero', scientific: '(Ambystoma altamirani)', description: 'Monitoreo de poblaciones en arroyo de montaña templado frío.', likes: '6.1K', comments: '940', image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80' },
  { id: '17', taxon: 'Arachnida', taxonColor: 'text-red-400 outline-red-500/30', location: 'Sonora, MX', author: 'DesertSpider', handle: '@arac_sonora', time: 'hace 3 d', title: 'Tarántula del Desierto', scientific: '(Aphonopelma chalcodes)', description: 'Búsqueda activa de madriguera durante crepúsculo estival.', likes: '1.8K', comments: '230', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' },
  { id: '18', taxon: 'Plantae', taxonColor: 'text-green-400 outline-green-500/30', location: 'Jalisco, MX', author: 'AgaveLab', handle: '@agave_jal', time: 'hace 4 d', title: 'Agave Azul Tequilana', scientific: '(Agave tequilana)', description: 'Inflorescencia central (quiote) desarrollada en cultivo tradicional.', likes: '2.9K', comments: '310', image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80' },
  { id: '19', taxon: 'Fungi', taxonColor: 'text-purple-400 outline-purple-500/30', location: 'Estado de México', author: 'BojosBOSQUE', handle: '@bosque_edomex', time: 'hace 4 d', title: 'Hongo Rey', scientific: '(Boletus edulis)', description: 'Simbiosis micorrícica con raíces de Pinus patula.', likes: '3.7K', comments: '540', image: 'https://images.unsplash.com/photo-1511497584788-876761197069?auto=format&fit=crop&w=600&q=80' },
  { id: '20', taxon: 'Aves', taxonColor: 'text-cyan-400 outline-cyan-500/30', location: 'Baja California', author: 'MarAbierto', handle: '@mar_bc', time: 'hace 4 d', title: 'Águila Pescadora', scientific: '(Pandion haliaetus)', description: 'Captura exitosa de presa en estero costero protegido.', likes: '5.0K', comments: '810', image: 'https://images.unsplash.com/photo-1550853024-fae8cd484475?auto=format&fit=crop&w=600&q=80' },
  { id: '21', taxon: 'Insecta', taxonColor: 'text-yellow-400 outline-yellow-500/30', location: 'Tabasco, MX', author: 'EntomoTab', handle: '@entomo_tab', time: 'hace 5 d', title: 'Cigarra Gigante', scientific: '(Tegiticicada)', description: 'Emisión acústica vespertina en plantación tropical.', likes: '1.4K', comments: '110', image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=600&q=80' },
  { id: '22', taxon: 'Mammalia', taxonColor: 'text-amber-500 outline-amber-500/30', location: 'Nuevo León', author: 'FaunaNL', handle: '@fauna_nl', time: 'hace 5 d', title: 'Oso Negro Americano', scientific: '(Ursus americanus)', description: 'Individuo subadulto explorando zona de transición forestal.', likes: '7.2K', comments: '1.8K', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80' },
  { id: '23', taxon: 'Reptilia', taxonColor: 'text-emerald-500 outline-emerald-500/30', location: 'Guanajuato', author: 'HerpGto', handle: '@herp_gto', time: 'hace 5 d', title: 'Serpiente de Cascabel', scientific: '(Crotalus basiliscus)', description: 'Comportamiento defensivo en zona de matorral xerófilo.', likes: '2.6K', comments: '490', image: 'https://images.unsplash.com/photo-1574068468731-c1221768853b?auto=format&fit=crop&w=600&q=80' },
  { id: '24', taxon: 'Aves', taxonColor: 'text-indigo-400 outline-indigo-500/30', location: 'Nayarit, MX', author: 'IslaMarias', handle: '@marias_bio', time: 'hace 6 d', title: 'Piquero de Patas Azules', scientific: '(Sula nebouxii)', description: 'Cortejo con exhibición de patas palmeadas color cerúleo.', likes: '4.8K', comments: '720', image: 'https://images.unsplash.com/photo-1550853024-fae8cd484475?auto=format&fit=crop&w=600&q=80' },
  { id: '25', taxon: 'Plantae', taxonColor: 'text-lime-300 outline-lime-500/30', location: 'Tlaxcala, MX', author: 'FloraTlax', handle: '@flora_tlax', time: 'hace 6 d', title: 'Dalia Silvestre', scientific: '(Dahlia coccinea)', description: 'Flor nacional de México en su hábitat de ladera montañosa.', likes: '3.9K', comments: '510', image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80' },
  { id: '26', taxon: 'Mammalia', taxonColor: 'text-orange-500 outline-orange-500/30', location: 'Yucatán, MX', author: 'MarinaYuc', handle: '@marina_yuc', time: 'hace 6 d', title: 'Manatí Antillano', scientific: '(Trichechus manatus)', description: 'Madre y cría alimentándose de pastos marinos en ría.', likes: '6.4K', comments: '1.2K', image: 'https://images.unsplash.com/photo-1511497584788-876761197069?auto=format&fit=crop&w=600&q=80' },
  { id: '27', taxon: 'Insecta', taxonColor: 'text-teal-300 outline-teal-500/30', location: 'Zacatecas, MX', author: 'OdonataZac', handle: '@zac_odonata', time: 'hace 7 d', title: 'Libélula Emperatriz', scientific: '(Anax imperator)', description: 'Vuelo de patrullaje territorial sobre cuerpo de agua dulce.', likes: '2.1K', comments: '160', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' },
  { id: '28', taxon: 'Aves', taxonColor: 'text-rose-400 outline-rose-500/30', location: 'Sinaloa, MX', author: 'Humedales', handle: '@humED_sin', time: 'hace 7 d', title: 'Flamenco Americano', scientific: '(Phoenicopterus ruber)', description: 'Alimentación por filtración en marismas costeras.', likes: '5.7K', comments: '980', image: 'https://images.unsplash.com/photo-1559535332-db9971090158?auto=format&fit=crop&w=600&q=80' },
  { id: '29', taxon: 'Fungi', taxonColor: 'text-violet-400 outline-violet-500/30', location: 'Michoacán, MX', author: 'HongosMich', handle: '@micho_fungi', time: 'hace 7 d', title: 'Amanita Muscaria', scientific: '(Amanita muscaria)', description: 'Cuerpo fructífero maduro bajo bosque mixto de coníferas.', likes: '4.2K', comments: '630', image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80' },
  { id: '30', taxon: 'Mammalia', taxonColor: 'text-yellow-500 outline-yellow-500/30', location: 'Oaxaca, MX', author: 'SierraSurBio', handle: '@sur_bio', time: 'hace 7 d', title: 'Venado de Cola Blanca', scientific: '(Odocoileus virginianus)', description: 'Avistamiento matutino en claro de bosque mesófilo.', likes: '3.8K', comments: '450', image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=600&q=80' },
];

export default function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [feedMode, setFeedMode] = useState('parati');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Paginación inferior: 10 elementos por página (3 páginas en total)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Referencia para el scroll horizontal de las flechas redondas laterales
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const filteredSpecimens = ALL_SPECIMENS.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scientific.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taxon.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory 
      ? item.taxon.toLowerCase() === selectedCategory.toLowerCase() 
      : true;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSpecimens.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpecimens = filteredSpecimens.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#121614] text-zinc-100 flex flex-col font-['Mulish']">
      {/* Navbar Superior */}
      <div className="flex items-center bg-neutral-900/95 border-b border-zinc-800 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="ml-4 p-2 rounded-lg bg-zinc-800 text-lime-400 hover:bg-zinc-700 transition cursor-pointer"
          title={isSidebarOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
        >
          {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <div className="flex-1">
          <Navbar
            user={user}
            onLogout={onLogout}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={['Coleoptera', 'Lepidoptera', 'Mantodea', 'Scarabaeidae', 'Trochilidae', 'Hylidae', 'Felidae', 'Hábitat', 'Orchidaceae', 'Mycenaceae', 'Aves', 'Reptilia', 'Mammalia', 'Amphibia', 'Arachnida', 'Plantae', 'Fungi']}
          />
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden">
        
        {/* Sidebar Izquierdo */}
        {isSidebarOpen && <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />}

        {/* Columna Central */}
        <main className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          
          {/* Selector Para ti / Global */}
          <div className="w-full px-3.5 py-2.5 bg-neutral-900/90 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFeedMode('parati')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  feedMode === 'parati'
                    ? 'bg-lime-500 text-lime-950 shadow-sm'
                    : 'bg-zinc-900 text-neutral-400 outline outline-1 outline-zinc-800'
                }`}
              >
                <span className="size-2 bg-lime-950 rounded-full" />
                Para ti
              </button>

              <button
                type="button"
                onClick={() => setFeedMode('global')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  feedMode === 'global'
                    ? 'bg-lime-500 text-lime-950 shadow-sm'
                    : 'bg-zinc-900 text-neutral-400 outline outline-1 outline-zinc-800 hover:text-zinc-200'
                }`}
              >
                <Globe className="size-3.5" />
                Global
              </button>
            </div>
          </div>

          {/* Encabezado */}
          <div className="pt-1 flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-white text-lg font-bold leading-7">
                Galería de Observaciones y Taxones
              </h1>
              <span className="px-2.5 py-0.5 bg-neutral-800 rounded-full outline outline-1 outline-lime-500/30 text-lime-400 text-xs font-semibold">
                {filteredSpecimens.length} en vitrina • 120 total
              </span>
            </div>
            <p className="text-zinc-400 text-xs">
              Avistamientos fotográficos validados por la comunidad taxonómica y expertos botánicos
            </p>
          </div>

          {/* Carrusel Horizontal de las 10 publicaciones sin barra de scroll visual */}
          <div className="relative px-6">
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-hidden pb-4 pt-1 scroll-smooth"
            >
              {currentSpecimens.map((item) => (
                <div
                  key={item.id}
                  className="w-[320px] min-w-[320px] bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 flex flex-col justify-between overflow-hidden shadow-md shrink-0"
                >
                  <div>
                    <div className="relative h-48 bg-zinc-900 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="px-1.5 py-0.5 left-2.5 top-2.5 absolute bg-lime-500 rounded-sm text-zinc-950 text-[10px] font-extrabold">
                        {item.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 right-2.5 top-2.5 absolute bg-neutral-950/90 rounded-md outline outline-1 backdrop-blur-sm text-xs font-semibold ${item.taxonColor}`}
                      >
                        {item.taxon}
                      </span>
                      <span className="px-2 py-0.5 left-2.5 bottom-2.5 absolute bg-neutral-950/90 rounded-md backdrop-blur-sm text-zinc-300 text-[10px]">
                        📍 {item.location}
                      </span>
                    </div>

                    <div className="p-3.5 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="text-zinc-300 font-medium">{item.author} </span>
                          <span className="text-zinc-500 font-medium">{item.handle}</span>
                        </div>
                        <span className="text-zinc-400">{item.time}</span>
                      </div>

                      <div className="text-sm leading-5">
                        <span className="text-white font-bold">{item.title} </span>
                        <span className="text-zinc-300 font-normal italic">{item.scientific}</span>
                      </div>

                      <p className="text-zinc-400 text-xs leading-4 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 bg-zinc-900/60 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="text-lime-500 font-bold">▲</span> {item.likes}
                      </span>
                      <span>💬 {item.comments}</span>
                    </div>
                    <span className="hover:text-zinc-200 cursor-pointer">↗ Compartir</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Flechas circulares laterales funcionando como barra deslizadora horizontal sin barra de scroll visible */}
            <button
              type="button"
              onClick={handleScrollLeft}
              className="size-11 left-0 top-1/2 -translate-y-1/2 absolute bg-neutral-900/95 rounded-full outline outline-2 outline-lime-500/40 flex items-center justify-center text-lime-400 shadow-xl cursor-pointer hover:bg-neutral-800 z-20"
              title="Desplazar a la izquierda"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="size-11 right-0 top-1/2 -translate-y-1/2 absolute bg-lime-500 rounded-full outline outline-2 outline-white/20 flex items-center justify-center text-zinc-950 shadow-xl cursor-pointer hover:bg-lime-400 z-20"
              title="Desplazar a la derecha"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Barra de Paginación Inferior (3 páginas de 10 en 10) */}
          <div className="px-4 py-3 bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-2 bg-lime-400 rounded-full" />
                <div className="text-xs leading-4">
                  <span className="text-zinc-400">Mostrando </span>
                  <span className="text-white font-bold">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSpecimens.length)}</span>
                  <span className="text-zinc-400"> de </span>
                  <span className="text-lime-400 font-bold">{filteredSpecimens.length}</span>
                  <div className="text-zinc-400">especímenes</div>
                </div>
              </div>
            </div>

            <div className="p-1 bg-zinc-900/60 rounded-xl outline outline-1 outline-zinc-800 flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`size-7 rounded-lg text-xs flex items-center justify-center cursor-pointer ${
                    currentPage === p
                      ? 'bg-lime-500 text-zinc-950 font-bold shadow'
                      : 'text-zinc-300 hover:bg-zinc-800 font-medium'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-zinc-900 rounded-lg outline outline-1 outline-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5 text-lime-400" />
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 bg-lime-500 rounded-lg text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-lime-400 disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

        </main>

        {/* Columna Derecha */}
        <aside className="hidden xl:flex w-72 min-w-[288px] bg-neutral-900 border-l border-zinc-800 p-4 flex-col gap-4 shrink-0">
          <div className="p-3.5 bg-zinc-900 rounded-xl outline outline-1 outline-zinc-800 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 bg-lime-500 rounded-full" />
              <span className="text-zinc-100 text-[10px] font-extrabold uppercase tracking-wide">
                Sugerencias
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Adelina', info: '@AdNieto • Arácnidos', following: false },
                { name: 'Magali', info: '@TinkyW • Escarabajos', following: false },
                { name: 'Ale', info: '@Alezz • Hormigas', following: true },
              ].map((person) => (
                <div key={person.name} className="p-1 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-lime-400 ring-1 ring-lime-500/30">
                      {person.name[0]}
                    </div>
                    <div className="leading-tight">
                      <div className="text-zinc-100 text-xs font-bold">{person.name}</div>
                      <div className="text-neutral-400 text-[10px]">{person.info}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                      person.following
                        ? 'bg-lime-500 text-lime-950'
                        : 'bg-neutral-800 text-neutral-400 outline outline-1 outline-zinc-700 hover:text-white'
                    }`}
                  >
                    {person.following ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900 rounded-xl outline outline-1 outline-zinc-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-lime-400" />
              <span className="text-zinc-100 text-[10px] font-extrabold uppercase tracking-wide">
                Especies en tendencia
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { rank: '#1', name: 'Chrysina limbata', count: '1.2k registros', highlight: true },
                { rank: '#2', name: 'Lucanus cervus', count: '890 registros', highlight: false },
                { rank: '#3', name: 'Atta mexicana', count: '640 registros', highlight: false },
              ].map((sp) => (
                <div key={sp.rank} className="p-2 bg-neutral-800 rounded-lg outline outline-1 outline-zinc-800 flex items-center gap-2.5">
                  <span className={`text-xs font-extrabold ${sp.highlight ? 'text-lime-500' : 'text-neutral-400'}`}>{sp.rank}</span>
                  <div className="leading-tight">
                    <div className="text-zinc-100 text-xs font-semibold italic">{sp.name}</div>
                    <div className="text-neutral-400 text-[10px]">{sp.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}